import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";
import Logo from "./Logo";

interface HeaderProps {
  title?: string;
  rightComponent?: React.ReactNode;
}

export default function Header({ title, rightComponent }: HeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.header, { backgroundColor: colors.card }]}>
      <View style={styles.leftSection}>
        <Logo style={styles.logo} />
      </View>
      {title && (
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        </View>
      )}
      <View style={styles.rightSection}>
        {rightComponent}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 70,
  },
  logo: {
    width: 16,
    height: 16,
  },
  titleContainer: {
    flex: 2,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  rightSection: {
    flex: 1,
    alignItems: "flex-end",
  },
}); 