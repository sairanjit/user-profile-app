import React, { useState, useEffect } from "react"
import { Text, View, StyleSheet, Button } from "react-native"
import { CameraView, Camera, BarcodeScanningResult } from "expo-camera"

interface QRScannerProps {
  onScan(data: BarcodeScanningResult): void
  onCancel?(): void
  helpText?: string
}

export default function QrScanner({
  onScan,
  helpText,
  onCancel,
}: QRScannerProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync()
      setHasPermission(status === "granted")
    }

    getCameraPermissions()
  }, [])

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={onScan}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "pdf417"],
        }}
        style={StyleSheet.absoluteFillObject}
      />
      {helpText && <Button title={helpText} onPress={onCancel} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
})
