import QrScanner from "@/components/QrScanner"
import { useIsFocused } from "@react-navigation/native"
import { BarcodeScanningResult } from "expo-camera"
import { useRouter } from "expo-router"
import React, { useState } from "react"

export default function ScanScreen() {
  const router = useRouter()
  const [helpText, setHelpText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const isFocused = useIsFocused()

  const onScan = async (scannedData: BarcodeScanningResult) => {
    if (isProcessing || !isFocused) return
    setIsProcessing(true)
    setIsLoading(true)

    console.log("scannedData", scannedData.data)

    setHelpText("scannedData.data")

    await new Promise((resolve) => setTimeout(resolve, 5000))
    setHelpText("")
    setIsLoading(false)
    setIsProcessing(false)
  }

  // Only show cancel button on Android
  const onCancel = () => router.back()

  return (
    <>
      <QrScanner
        onScan={(data) => {
          void onScan(data)
        }}
        onCancel={onCancel}
        helpText={helpText}
      />
    </>
  )
}
