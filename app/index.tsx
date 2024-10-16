import { requestPermissions } from "@/agent"
import { Stack, useRouter } from "expo-router"
import { useEffect } from "react"
import { Button, Platform } from "react-native"

export default function Screen() {
  const router = useRouter()

  useEffect(() => {
    try {
      console.log("asdljas")
      if (Platform.OS === "android") {
        requestPermissions().then((check) => console.log("check", check))
      }
    } catch (error) {
      console.log("Error requesting permissions", error)
    }
  }, [])

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Home",
        }}
      />
      <Button title="Scan" onPress={() => router.push("/scan")} />
    </>
  )
}
