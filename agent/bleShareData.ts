import {
  type Agent,
  JsonTransformer,
  OutOfBandInvitation,
} from "@credo-ts/core"
import {
  BleInboundTransport,
  BleOutboundTransport,
} from "@credo-ts/transport-ble"
import {
  Central,
  DEFAULT_DIDCOMM_INDICATE_CHARACTERISTIC_UUID,
  DEFAULT_DIDCOMM_MESSAGE_CHARACTERISTIC_UUID,
} from "@animo-id/react-native-ble-didcomm"
import {
  ProfileEventTypes,
  UserProfileData,
  UserProfileRequestedEvent,
} from "@2060.io/credo-ts-didcomm-user-profile"
import { AppAgent } from "./agent"

export type BleShareProfileOptions = {
  agent: AppAgent
  central: Central
  serviceUuid: string
  onFailure: () => Promise<void> | void
  onConnected?: () => Promise<void> | void
  onDisconnected?: () => Promise<void> | void
  profileData: Record<string, unknown>
}

export const bleShareProfileData = async ({
  agent,
  central,
  serviceUuid,
  onFailure,
  onConnected,
  onDisconnected,
  profileData,
}: BleShareProfileOptions) => {
  try {
    await startBleTransport(agent, central)

    await startCentral(central, agent, serviceUuid)

    disconnectedNotifier(agent, central, onDisconnected)

    await discoverAndConnect(agent, central)

    await connectedNotifier(agent, central, onConnected)

    const proofRecord = await shareUserData(
      agent,
      central,
      serviceUuid,
      profileData
    )
    return proofRecord.id
  } catch (e) {
    if (e instanceof Error) {
      agent.config.logger.error(e.message, { cause: e })
    } else {
      agent.config.logger.error(e as string)
    }

    onFailure()
    throw e
  }
}

const startBleTransport = async (agent: Agent, central: Central) => {
  const bleInboundTransport = new BleInboundTransport(central)
  agent.registerInboundTransport(bleInboundTransport)
  await bleInboundTransport.start(agent)
  const bleOutboundTransport = new BleOutboundTransport(central)
  agent.registerOutboundTransport(bleOutboundTransport)
  await bleOutboundTransport.start(agent)
}

const startCentral = async (
  central: Central,
  agent: Agent,
  serviceUuid: string
) => {
  await central.start()
  await central.setService({
    serviceUUID: serviceUuid,
    messagingUUID: DEFAULT_DIDCOMM_MESSAGE_CHARACTERISTIC_UUID,
    indicationUUID: DEFAULT_DIDCOMM_INDICATE_CHARACTERISTIC_UUID,
  })
  await central.scan()
  agent.config.logger.info(
    `[CENTRAL]: Scanning on service UUID '${serviceUuid}'`
  )
}

const discoverAndConnect = async (agent: Agent, central: Central) =>
  await new Promise<void>((resolve) => {
    const listener = central.registerOnDiscoveredListener(
      ({ identifier, name }) => {
        agent.config.logger.info(
          `[CENTRAL]: Discovered device ${
            name ? `(${name})` : ""
          }: ${identifier}`
        )

        central.connect(identifier).then(() => {
          listener.remove()
          resolve()
        })
      }
    )
  })

const connectedNotifier = async (
  agent: Agent,
  central: Central,
  onConnected?: () => Promise<void> | void
) =>
  new Promise<void>((resolve) => {
    const connectedListener = central.registerOnConnectedListener(
      async ({ identifier, name }) => {
        agent.config.logger.info(
          `[CENTRAL]: Connected to device ${
            name ? `(${name})` : ""
          }: ${identifier}`
        )
        if (onConnected) await onConnected()
        connectedListener.remove()
        resolve()
      }
    )
  })

const disconnectedNotifier = (
  agent: Agent,
  central: Central,
  onDisconnected?: () => Promise<void> | void
) => {
  const disconnectedListener = central.registerOnDisconnectedListener(
    async ({ identifier }) => {
      agent.config.logger.info(
        `[CENTRAL]: Disconnected from device ${identifier}`
      )
      if (onDisconnected) await onDisconnected()
      disconnectedListener.remove()
    }
  )
}

const shareUserData = async (
  agent: AppAgent,
  central: Central,
  serviceUuid: string,
  profileData: Partial<UserProfileData> | Record<string, unknown>
) =>
  new Promise<Record<string, unknown>>((resolve) => {
    const receivedMessageListener = central.registerMessageListener(
      async ({ message }) => {
        agent.config.logger.info(
          `[CENTRAL]: received message ${message.slice(0, 16)}...`
        )

        const parsedMessage = JsonTransformer.deserialize(
          message,
          OutOfBandInvitation
        )

        const routing = await agent.mediationRecipient.getRouting({
          useDefaultMediator: false,
        })

        await agent.oob.receiveInvitation(parsedMessage, {
          routing: { ...routing, endpoints: [`ble://${serviceUuid}`] },
        })

        const userProfileRecord = await autoRespondToBleProofRequest(
          agent,
          profileData
        )

        receivedMessageListener.remove()
        resolve(userProfileRecord)
      }
    )
  })

const autoRespondToBleProofRequest = (
  agent: AppAgent,
  profileData: Partial<UserProfileData> | Record<string, unknown>
): Promise<Record<string, unknown>> => {
  return new Promise<Record<string, unknown>>((resolve, reject) => {
    const listener = async ({
      payload: { connection, threadId, query },
    }: UserProfileRequestedEvent) => {
      const off = () =>
        agent.events.off(ProfileEventTypes.UserProfileRequested, listener)

      await agent.modules.userProfile.sendUserProfile({
        connectionId: connection.id,
        profileData,
      })
      resolve(profileData)
      off()
    }
    agent.events.on<UserProfileRequestedEvent>(
      ProfileEventTypes.UserProfileRequested,
      listener
    )
  })
}
