import { bleShareProfileData, sendUserProfile } from "@/agent/bleShareData"
import PreferenceSharingModal from "@/components/SharePreferencesModal"
import { defaultUserData } from "@/constants/userData"
import {
  useCentral,
  useCentralShutdownOnUnmount,
  useCloseTransportsOnUnmount,
} from "@animo-id/react-native-ble-didcomm"
import { useAgent } from "@credo-ts/react-hooks"
import { useLocalSearchParams, useRouter } from "expo-router"
import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet } from "react-native"
import { ActivityIndicator, useTheme } from "react-native-paper"

export const Spacer = () => <View style={{ height: 20, width: 20 }} />

const extractValues = (data: any, keys: string[]) => {
  const extractedData = {}
  keys.forEach((key) => {
    if (data.hasOwnProperty(key)) {
      extractedData[key] = data[key]
    }
  })
  return extractedData
}

export default function QRScreen() {
  const { colors } = useTheme()
  const router = useRouter()
  const params = useLocalSearchParams()
  const [userConnected, setUserConnected] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [connectionId, setConnectionId] = useState("")
  const [query, setQuery] = useState<string[]>([])

  console.log("params", params?.serviceUUID)

  if (!params?.serviceUUID) {
    router.back()

    return null
  }
  const { agent } = useAgent()
  const { central } = useCentral()

  const onFailure = () => console.error("[CENTRAL]: failure")
  const onConnected = () => {
    console.log("[CENTRAL]: connected")
    setUserConnected(true)
  }
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
      // profileData: { displayName: "Kevin" },
    }).then((data) => {
      console.log("data check 1111", data)

      if (!data.query && !data.connection) return

      setQuery(data.query!)
      setConnectionId(data.connection.id)
      setModalVisible(true)
    })

  useEffect(() => {
    if (!params.serviceUUID) return

    const shareUserData = async () => {
      await shareProof(params.serviceUUID as string)
    }
    shareUserData()
  }, [params.serviceUUID])

  const styles = StyleSheet.create({
    container: {
      position: "relative",
      flex: 1,
      paddingHorizontal: 40,
      paddingVertical: 40,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "flex-start",
    },

    title: {
      fontSize: 28,
      fontWeight: "bold",
      marginVertical: 20,
      textAlign: "center",
    },

    subtitle: {
      fontSize: 20,
      marginBottom: 20,
      textAlign: "center",
    },

    qr: {
      alignItems: "center",
      justifyContent: "center",
      height: 250,
      width: 250,
    },

    icon: {
      color: colors.primary,
    },
  })

  const handleShare = async () => {
    try {
      console.log(
        "Shared all preferences",
        defaultUserData,
        query,
        connectionId
      )
      // use only values present in query from defaultUserData
      const userData = extractValues(defaultUserData, query)

      console.log("userData sharing", userData)

      await sendUserProfile(agent, connectionId!, userData)
      console.log("userData shared")

      setModalVisible(false)
      router.replace("/")
    } catch (error) {
      console.log("Error sharing user data", error)
    }
  }

  const handleDecline = () => {
    console.log("Declined sharing preferences")
    setModalVisible(false)
    router.replace("/")
  }

  return (
    <View style={styles.container}>
      <View style={styles.qr}>
        {!userConnected ? (
          <ActivityIndicator size={80} />
        ) : (
          <Text style={styles.subtitle}>You are now connected.</Text>
        )}
      </View>

      {!userConnected && (
        <Text style={styles.subtitle}>
          Please wait for the other party to connect successfully.
        </Text>
      )}

      <PreferenceSharingModal
        visible={modalVisible}
        onDismiss={handleDecline}
        onShare={handleShare}
        onDecline={handleDecline}
        requestedPreferences={query}
        requesterName="Verifier"
      />
    </View>
  )
}
