import "react-native-get-random-values"
import "fast-text-encoding"
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native"
import { useFonts } from "expo-font"
import { Stack } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { useEffect, useState } from "react"
import "react-native-reanimated"

import { useColorScheme } from "@/hooks/useColorScheme"
import AgentProvider from "@credo-ts/react-hooks"
import { AppAgent, initializeAppAgent } from "@/agent"
import { Central, CentralProvider } from "@animo-id/react-native-ble-didcomm"

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [agent, setAgent] = useState<AppAgent>()
  const colorScheme = useColorScheme()
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  })

  // Initialize agent
  useEffect(() => {
    if (agent) return

    const startAgent = async () => {
      try {
        const newAgent = await initializeAppAgent({ walletLabel: "Kevin" })
        if (!newAgent) return

        const data = await newAgent.modules.userProfile.getUserProfileData()

        console.log("data", data.displayName)
        if (!data?.displayName) {
          const userData =
            await newAgent.modules.userProfile.updateUserProfileData({
              displayName: "Kevin",
            })

          console.log("userData", userData)
        }

        setAgent(newAgent)
      } catch (error) {
        console.log("Error initializing agent", error)
      }
    }

    void startAgent()
  }, [])

  useEffect(() => {
    if (loaded && agent) {
      SplashScreen.hideAsync()
    }
  }, [loaded, agent])

  if (!loaded || !agent) {
    return null
  }

  return (
    <AgentProvider agent={agent}>
      <CentralProvider central={new Central()}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          {/* <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack> */}
          <Stack initialRouteName="index">
            <Stack.Screen
              options={{
                presentation: "modal",
                title: "Scan QR Code",
              }}
              name="scan"
            />
            <Stack.Screen
              options={{
                title: "Process QR Code",
              }}
              name="qrprocess"
            />
            <Stack.Screen name="+not-found" />
          </Stack>
        </ThemeProvider>
      </CentralProvider>
    </AgentProvider>
  )
}
