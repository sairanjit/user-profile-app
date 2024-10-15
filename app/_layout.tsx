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
import type { InitConfig } from "@credo-ts/core"
import {
  Agent,
  ConnectionsModule,
  ConsoleLogger,
  LogLevel,
} from "@credo-ts/core"
import { AskarModule } from "@credo-ts/askar"
import { agentDependencies } from "@credo-ts/react-native"
import AgentProvider from "@credo-ts/react-hooks"
import { View } from "react-native"
import { ariesAskar } from "@hyperledger/aries-askar-react-native"

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [agent, setAgent] = useState()
  const colorScheme = useColorScheme()
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  })

  // Initialize agent
  useEffect(() => {
    if (agent) return

    const startAgent = async () => {
      try {
        const config: InitConfig = {
          label: "Kevin",
          logger: new ConsoleLogger(LogLevel.debug),
          walletConfig: {
            id: "wallet-id",
            key: "secure-key",
          },
        }

        const newAgent = new Agent({
          config,
          dependencies: agentDependencies,
          modules: {
            askar: new AskarModule({ ariesAskar }),
            connections: new ConnectionsModule({ autoAcceptConnections: true }),
          },
        })

        await newAgent.initialize()
        if (!newAgent) return

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
    // <AgentProvider agent={agent}>
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
    // </AgentProvider>
  )
}
