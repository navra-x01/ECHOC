import { Stack } from "expo-router"
import ClientLayout from "../app/components/ClientLayout"
import Navigation from "../app/components/Navigation"
import { AuthProvider } from "../lib/AuthProvider"

export default function RootLayout() {
  return (
    <AuthProvider>
      <ClientLayout>
        <Stack screenOptions={{ headerShown: false }} />
        <Navigation />
      </ClientLayout>
    </AuthProvider>
  )
}
