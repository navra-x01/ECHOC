import { Stack } from "expo-router"
import ClientLayout from "../app/components/ClientLayout"
import Navigation from "../app/components/Navigation"

export default function RootLayout() {
  return (
    <ClientLayout >
      <Stack screenOptions={{ headerShown: false }} />
      <Navigation />
    </ClientLayout>
  )
}
