import { defaultUserData, User } from "@/constants/userData"
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from "react"

const GlobalContext = createContext<null | {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
}>(null)

export const GlobalProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(defaultUserData)

  const value = {
    user,
    setUser,
  }

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  )
}

export const useGlobalState = () => {
  const context = useContext(GlobalContext)
  if (context === undefined) {
    throw new Error("useGlobalState must be used within a GlobalProvider")
  }

  return context
}
