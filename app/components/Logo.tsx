import Svg, { Path } from "react-native-svg";
import { View, StyleSheet } from "react-native";

export default function Logo({ style }: { style?: object }) {
  return (
    <View style={[styles.container, style]}>
      <Svg viewBox="0 0 35 35" width={35} height={35} fill="none">
        <Path d="M17.5 3.5L3.5 10.5V24.5L17.5 31.5L31.5 24.5V10.5L17.5 3.5Z" stroke="black" strokeWidth="1.5" fill="none" />
        <Path d="M17.5 3.5L31.5 10.5L17.5 17.5L3.5 10.5L17.5 3.5Z" stroke="black" strokeWidth="1.5" fill="none" />
        <Path d="M17.5 17.5L31.5 10.5V24.5L17.5 31.5V17.5Z" stroke="black" strokeWidth="1.5" fill="none" />
        <Path d="M17.5 17.5L3.5 10.5V24.5L17.5 31.5V17.5Z" stroke="black" strokeWidth="1.5" fill="none" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
