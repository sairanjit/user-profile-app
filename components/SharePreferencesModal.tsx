import { formatDisplayText } from "@/utils"
import React from "react"
import { View, StyleSheet, ScrollView } from "react-native"
import {
  Modal,
  Portal,
  Button,
  Text,
  List,
  Divider,
  Surface,
  IconButton,
} from "react-native-paper"

interface PreferenceSharingModalProps {
  visible: boolean
  onDismiss: () => void
  onShare: () => void
  onDecline: () => void
  requestedPreferences: string[]
  requesterName: string
}

const PreferenceSharingModal: React.FC<PreferenceSharingModalProps> = ({
  visible,
  onDismiss,
  onShare,
  onDecline,
  requestedPreferences,
  requesterName,
}) => {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <Surface style={styles.surface}>
          <View style={styles.header}>
            <Text variant="headlineSmall" style={styles.title}>
              Share Information
            </Text>
            <IconButton
              icon="close"
              size={24}
              onPress={onDismiss}
              style={styles.closeButton}
            />
          </View>

          <Text style={styles.subtitle}>
            {requesterName} is requesting access to the following information:
          </Text>

          <ScrollView style={styles.preferenceList}>
            {requestedPreferences.map((preference, index) => (
              <React.Fragment key={preference}>
                <List.Item
                  title={formatDisplayText(preference)}
                  left={(props) => <List.Icon {...props} icon="information" />}
                />
                {index < requestedPreferences.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </ScrollView>

          <Divider />

          <View style={styles.footer}>
            <Button
              mode="outlined"
              onPress={onDecline}
              style={styles.footerButton}
            >
              Decline
            </Button>
            <Button
              mode="contained"
              onPress={onShare}
              style={styles.footerButton}
            >
              Share
            </Button>
          </View>
        </Surface>
      </Modal>
    </Portal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
  },
  surface: {
    borderRadius: 12,
    backgroundColor: "white",
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  title: {
    flex: 1,
  },
  closeButton: {
    margin: -8,
  },
  subtitle: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    opacity: 0.7,
  },
  preferenceList: {
    maxHeight: "60%",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
    gap: 12,
  },
  footerButton: {
    minWidth: 100,
  },
})

export default PreferenceSharingModal
