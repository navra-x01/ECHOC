import Svg, { Path } from "react-native-svg";
import { View, StyleSheet } from "react-native";

export default function Logo({ style }: { style?: object }) {
  return (
    <View style={[styles.container, style]}>
      <Svg viewBox="0 0 100 100" width={100} height={100} fill="none">
        <Path d="M50 10L10 30V70L50 90L90 70V30L50 10Z" stroke="black" strokeWidth="4" fill="none" />
        <Path d="M50 10L90 30L50 50L10 30L50 10Z" stroke="black" strokeWidth="4" fill="none" />
        <Path d="M50 50L90 30V70L50 90V50Z" stroke="black" strokeWidth="4" fill="none" />
        <Path d="M50 50L10 30V70L50 90V50Z" stroke="black" strokeWidth="4" fill="none" />
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
