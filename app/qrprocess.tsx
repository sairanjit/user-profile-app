import { bleShareProfileData } from "@/agent/bleShareData"
import {
  useCentral,
  useCentralShutdownOnUnmount,
  useCloseTransportsOnUnmount,
} from "@animo-id/react-native-ble-didcomm"
import { useAgent } from "@credo-ts/react-hooks"
import { useLocalSearchParams, useRouter } from "expo-router"
import React, { useEffect, useState } from "react"
import { View, Text, Button } from "react-native"

export const Spacer = () => <View style={{ height: 20, width: 20 }} />

export default function QRScreen() {
  console.log("dsklasjld")
  const router = useRouter()
  const params = useLocalSearchParams()

  console.log("params", params?.serviceUUID)

  if (!params?.serviceUUID) {
    router.back()

    return null
  }

  const [hasSharedProof, setHasSharedProof] = useState(false)
  const { agent } = useAgent()
  const { central } = useCentral()

  const onFailure = () => console.error("[CENTRAL]: failure")
  const onConnected = () => console.log("[CENTRAL]: connected")
  const onDisconnected = () => console.log("[CENTRAL]: disconnected")

  useCentralShutdownOnUnmount()
  useCloseTransportsOnUnmount(agent)

  const shareProof = (serviceUuid: string) =>
    bleShareProfileData({
      onFailure,
      serviceUuid,
      central,
      agent,
      onConnected,
      onDisconnected,
      profileData: { displayName: "Kevin" },
    }).then(() => setHasSharedProof(true))

  useEffect(() => {
    if (!params.serviceUUID) return

    const shareUserData = async () => {
      await shareProof(params.serviceUUID)
    }
    shareUserData()
  }, [params.serviceUUID])

  return (
    <>
      <Text>Ble Prover</Text>
      <Spacer />
      {/* <Button title="Ready to share" onPress={shareProof} /> */}
      <Spacer />
      <Text>Proof has{hasSharedProof ? " " : " not "}been shared!</Text>
    </>
  )
}
