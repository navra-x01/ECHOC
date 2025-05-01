import { View, Text, TouchableOpacity } from "react-native"
import { Link, usePathname } from "expo-router"
import { Home, BookOpen, Search, CreditCard, User } from "lucide-react-native"
import { GlobalStyles } from "../../styles"

export default function Navigation() {
  const pathname = usePathname()
  
  // Hide navigation on auth pages
  if (pathname.startsWith('/auth/')) {
    return null;
  }

  const getColor = (path: string) => (pathname === path ? GlobalStyles.accentTeal.color : GlobalStyles.textSecondary.color)

  return (
    <View style={GlobalStyles.navContainer}>
      <Link href="/" asChild>
        <TouchableOpacity style={GlobalStyles.navItem}>
          <Home color={getColor("/")} size={24} />
          <Text style={[GlobalStyles.navText, { color: getColor("/") }]}>Home</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/learn" asChild>
        <TouchableOpacity style={GlobalStyles.navItem}>
          <BookOpen color={getColor("/learn")} size={24} />
          <Text style={[GlobalStyles.navText, { color: getColor("/learn") }]}>Learn</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/search" asChild>
        <TouchableOpacity style={GlobalStyles.navItem}>
          <Search color={getColor("/search")} size={24} />
          <Text style={[GlobalStyles.navText, { color: getColor("/search") }]}>Search</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/wallet" asChild>
        <TouchableOpacity style={GlobalStyles.navItem}>
          <CreditCard color={getColor("/wallet")} size={24} />
          <Text style={[GlobalStyles.navText, { color: getColor("/wallet") }]}>Wallet</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/profile" asChild>
        <TouchableOpacity style={GlobalStyles.navItem}>
          <User color={getColor("/profile")} size={24} />
          <Text style={[GlobalStyles.navText, { color: getColor("/profile") }]}>Profile</Text>
        </TouchableOpacity>
      </Link>
    </View>
  )
}
