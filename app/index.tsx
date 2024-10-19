import { requestPermissions } from "@/agent"
import FloatingScanButton from "@/components/FloatingButton"
import { Stack, usePathname, useRouter } from "expo-router"
import { View, StyleSheet, ScrollView, Platform } from "react-native"

import React, { useState, useEffect } from "react"
import {
  Avatar,
  Card,
  Title,
  Text,
  List,
  Divider,
  Button,
  useTheme,
  TextInput,
  Snackbar,
  Switch,
} from "react-native-paper"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { formatDisplayText } from "@/utils"
import { defaultUserData } from "@/constants/userData"

export default function UserProfile() {
  const router = useRouter()
  const { colors } = useTheme()
  const [isEditing, setIsEditing] = useState(false)
  const [snackbarVisible, setSnackbarVisible] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const pathname = usePathname()

  useEffect(() => {
    try {
      if (Platform.OS === "android") {
        requestPermissions().then((check) => console.log("check", check))
      }
    } catch (error) {
      console.log("Error requesting permissions", error)
    }
  }, [])

  // State for user data
  const [userData, setUserData] = useState(defaultUserData)

  // State for form validation
  const [errors, setErrors] = useState({})

  // State for temporary edits
  const [editedData, setEditedData] = useState({ ...userData })

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      phone: "",
    }

    if (!editedData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!editedData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(editedData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!editedData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) {
      setSnackbarMessage("Please fix the errors in the form")
      setSnackbarVisible(true)
      return
    }

    try {
      // Here you would typically make an API call to update the user profile
      // await updateUserProfile(editedData);

      setUserData(editedData)
      setIsEditing(false)
      setSnackbarMessage("Profile updated successfully!")
      setSnackbarVisible(true)
    } catch (error) {
      setSnackbarMessage("Failed to update profile. Please try again.")
      setSnackbarVisible(true)
    }
  }

  const handleCancel = () => {
    setEditedData({ ...userData })
    setErrors({})
    setIsEditing(false)
  }

  const renderProfileHeader = () => (
    <Card style={styles.header}>
      <View style={styles.avatarContainer}>
        <Avatar.Image
          size={120}
          source={{ uri: isEditing ? editedData.avatar : userData.avatar }}
        />
        {isEditing ? (
          <TextInput
            value={editedData.name}
            onChangeText={(text) =>
              setEditedData((prev) => ({ ...prev, name: text }))
            }
            style={styles.nameInput}
            error={errors.name}
            mode="outlined"
          />
        ) : (
          <Title style={styles.name}>{userData.name}</Title>
        )}
        {isEditing ? (
          <TextInput
            value={editedData.location}
            onChangeText={(text) =>
              setEditedData((prev) => ({ ...prev, location: text }))
            }
            style={styles.locationInput}
            mode="outlined"
          />
        ) : (
          <Text style={styles.location}>{userData.location}</Text>
        )}
      </View>

      {isEditing ? (
        <View style={styles.editButtonsContainer}>
          <Button
            mode="contained"
            onPress={handleSave}
            style={[styles.editButton, { marginRight: 8 }]}
          >
            Save
          </Button>
          <Button
            mode="outlined"
            onPress={handleCancel}
            style={styles.editButton}
          >
            Cancel
          </Button>
        </View>
      ) : (
        <Button
          mode="contained"
          style={styles.editButton}
          onPress={() => setIsEditing(true)}
        >
          Edit Profile
        </Button>
      )}
    </Card>
  )

  const renderAboutSection = () => (
    <Card style={styles.section}>
      <Card.Content>
        <Title>About</Title>
        {isEditing ? (
          <TextInput
            value={editedData.bio}
            onChangeText={(text) =>
              setEditedData((prev) => ({ ...prev, bio: text }))
            }
            multiline
            numberOfLines={4}
            mode="outlined"
            style={styles.bioInput}
          />
        ) : (
          <Text style={styles.bio}>{userData.bio}</Text>
        )}
      </Card.Content>
    </Card>
  )

  const renderContactSection = () => (
    <Card style={styles.section}>
      <Card.Content>
        <Title>Contact Information</Title>
        {isEditing ? (
          <>
            <TextInput
              label="Email"
              value={editedData.email}
              onChangeText={(text) =>
                setEditedData((prev) => ({ ...prev, email: text }))
              }
              error={errors.email}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="email" />}
            />
            <TextInput
              label="Phone"
              value={editedData.phone}
              onChangeText={(text) =>
                setEditedData((prev) => ({ ...prev, phone: text }))
              }
              error={errors.phone}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="phone" />}
            />
          </>
        ) : (
          <>
            <List.Item
              title="Email"
              description={userData.email}
              left={(props) => (
                <MaterialCommunityIcons
                  {...props}
                  name="email"
                  size={24}
                  color={colors.primary}
                />
              )}
            />
            <Divider />
            <List.Item
              title="Phone"
              description={userData.phone}
              left={(props) => (
                <MaterialCommunityIcons
                  {...props}
                  name="phone"
                  size={24}
                  color={colors.primary}
                />
              )}
            />
          </>
        )}
      </Card.Content>
    </Card>
  )

  const renderSocialLinksSection = () => (
    <Card style={[styles.section, styles.lastSection]}>
      <Card.Content>
        <Title>Social Links</Title>
        {isEditing ? (
          <>
            <TextInput
              label="Twitter"
              value={editedData.socialLinks.twitter}
              onChangeText={(text) =>
                setEditedData((prev) => ({
                  ...prev,
                  socialLinks: { ...prev.socialLinks, twitter: text },
                }))
              }
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="twitter" />}
            />
            <TextInput
              label="LinkedIn"
              value={editedData.socialLinks.linkedin}
              onChangeText={(text) =>
                setEditedData((prev) => ({
                  ...prev,
                  socialLinks: { ...prev.socialLinks, linkedin: text },
                }))
              }
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="linkedin" />}
            />
            <TextInput
              label="GitHub"
              value={editedData.socialLinks.github}
              onChangeText={(text) =>
                setEditedData((prev) => ({
                  ...prev,
                  socialLinks: { ...prev.socialLinks, github: text },
                }))
              }
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="github" />}
            />
          </>
        ) : (
          <>
            <List.Item
              title="Twitter"
              description={userData.socialLinks.twitter}
              left={(props) => (
                <MaterialCommunityIcons
                  {...props}
                  name="twitter"
                  size={24}
                  color="#1DA1F2"
                />
              )}
            />
            <Divider />
            <List.Item
              title="LinkedIn"
              description={userData.socialLinks.linkedin}
              left={(props) => (
                <MaterialCommunityIcons
                  {...props}
                  name="linkedin"
                  size={24}
                  color="#0077B5"
                />
              )}
            />
            <Divider />
            <List.Item
              title="GitHub"
              description={userData.socialLinks.github}
              left={(props) => (
                <MaterialCommunityIcons
                  {...props}
                  name="github"
                  size={24}
                  color="#333"
                />
              )}
            />
          </>
        )}
      </Card.Content>
    </Card>
  )

  const handleValueChange = (
    mainKey: string,
    subKey: string,
    newValue: string | boolean | number
  ) => {
    setUserData({
      ...userData,
      [mainKey]: {
        ...userData[mainKey],
        [subKey]: newValue,
      },
    })
  }

  const renderUserPreferencesSection = () => {
    const excludedKeys = [
      "name",
      "email",
      "phone",
      "avatar",
      "location",
      "socialLinks",
      "bio",
    ]

    return (
      <View style={styles.container}>
        {Object.entries(userData).map(([mainKey, section]) => {
          if (excludedKeys.includes(mainKey)) {
            return null
          }

          return (
            <Card key={mainKey} style={styles.section}>
              <Card.Content>
                <Title>{formatDisplayText(mainKey)}</Title>
                {Object.entries(section).map(([subKey, value], index) => {
                  const isLastItem =
                    index === Object.entries(section).length - 1
                  const displayName = formatDisplayText(subKey)

                  return (
                    <View key={`${mainKey}-${subKey}`}>
                      {isEditing ? (
                        typeof value === "boolean" ? (
                          <List.Item
                            title={displayName}
                            description={
                              typeof value === "string" && !isEditing
                                ? value
                                : undefined
                            }
                            left={(props) => (
                              <MaterialCommunityIcons
                                {...props}
                                name="information-outline"
                                size={24}
                                color={colors.primary}
                              />
                            )}
                            right={() => (
                              <Switch
                                value={value}
                                onValueChange={(checked) =>
                                  handleValueChange(mainKey, subKey, checked)
                                }
                                color={colors.primary}
                              />
                            )}
                            style={styles.listItem}
                          />
                        ) : (
                          <TextInput
                            label={displayName}
                            value={String(value)}
                            onChangeText={(text) =>
                              handleValueChange(mainKey, subKey, text)
                            }
                            mode="outlined"
                            style={styles.input}
                            left={<TextInput.Icon icon="information-outline" />}
                          />
                        )
                      ) : (
                        <List.Item
                          title={displayName}
                          description={
                            typeof value === "string" && !isEditing
                              ? value
                              : undefined
                          }
                          left={(props) => (
                            <MaterialCommunityIcons
                              {...props}
                              name="information-outline"
                              size={24}
                              color={colors.primary}
                            />
                          )}
                          right={() => (
                            <>
                              {typeof value === "boolean" && (
                                <Switch value={value} color={colors.primary} />
                              )}
                            </>
                          )}
                          style={styles.listItem}
                        />
                      )}
                      {!isLastItem && <Divider />}
                    </View>
                  )
                })}
              </Card.Content>
            </Card>
          )
        })}
      </View>
    )
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Profile",
        }}
      />

      {pathname === "/" && !isEditing && (
        <FloatingScanButton onPress={() => router.push("/scan")} />
      )}
      <ScrollView style={styles.container}>
        {renderProfileHeader()}
        {renderAboutSection()}
        {renderContactSection()}
        {renderSocialLinksSection()}
        {renderUserPreferencesSection()}
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: "Close",
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </>
  )
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    marginBottom: 16,
  },
  header: {
    margin: 16,
    elevation: 4,
  },
  avatarContainer: {
    alignItems: "center",
    paddingVertical: 20,
    position: "relative",
  },
  avatarEditButton: {
    position: "absolute",
    right: "35%",
    bottom: "40%",
    backgroundColor: "#fff",
    elevation: 4,
    borderRadius: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 12,
    textAlign: "center",
  },
  nameInput: {
    width: "80%",
    marginTop: 12,
    backgroundColor: "#fff",
  },
  location: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
  locationInput: {
    width: "80%",
    marginTop: 4,
    backgroundColor: "#fff",
  },
  editButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 16,
  },
  editButton: {
    flex: 1,
    marginHorizontal: 4,
    marginBottom: 8,
  },
  section: {
    margin: 16,
    marginBottom: 0,
    elevation: 4,
    backgroundColor: "#fff",
  },
  lastSection: {
    marginBottom: 16,
  },
  bio: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    color: "#444",
  },
  bioInput: {
    marginTop: 8,
    backgroundColor: "#fff",
  },
  input: {
    marginVertical: 8,
    backgroundColor: "#fff",
  },
  divider: {
    marginVertical: 16,
  },
  socialLinkContainer: {
    marginVertical: 8,
  },
  errorText: {
    color: "#B00020",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 12,
  },
  dialogContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  dialogActions: {
    padding: 16,
    justifyContent: "flex-end",
  },
  snackbar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  // Form specific styles
  formContainer: {
    padding: 16,
  },
  formField: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  // Image picker styles
  imagePickerButton: {
    position: "absolute",
    bottom: -10,
    right: -10,
    backgroundColor: "#fff",
    borderRadius: 20,
    elevation: 4,
  },
  // Social media icons specific styles
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  // Stats section specific styles
  statsLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
  statsValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  // Card specific styles
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  // Button specific styles
  primaryButton: {
    borderRadius: 8,
    paddingVertical: 12,
    elevation: 2,
  },
  secondaryButton: {
    borderRadius: 8,
    paddingVertical: 12,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  // List item specific styles
  listItem: {
    paddingVertical: 12,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  listItemDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  // Error state styles
  errorInput: {
    borderColor: "#B00020",
  },
  // Success state styles
  successText: {
    color: "#28a745",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 12,
  },
  // Loading state styles
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  // Responsive styles for different screen sizes
  tabletContainer: {
    maxWidth: 600,
    alignSelf: "center",
    width: "100%",
  },
  desktopContainer: {
    maxWidth: 800,
    alignSelf: "center",
    width: "100%",
  },
})
