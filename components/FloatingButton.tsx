import React from "react"
import { StyleSheet } from "react-native"
import { FAB, Portal, useTheme } from "react-native-paper"

const FloatingScanButton = ({ onPress }: { onPress: () => void }) => {
  const theme = useTheme()

  const styles = StyleSheet.create({
    container: {
      position: "absolute",
      margin: 16,
      right: 0,
      bottom: 0,
    },
    fab: {
      backgroundColor: theme.colors.primary,
      position: "absolute",
      margin: 16,
      right: 0,
      bottom: 0,
    },
  })

  return (
    <Portal>
      <FAB
        icon="qrcode-scan"
        color="white"
        style={styles.fab}
        onPress={onPress}
        size="large"
      />
    </Portal>
  )
}

export default FloatingScanButton
