import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";

import Carousel from "../../../components/carousel";
import Announcement from "../../../components/announcement";
import Brands from "../../../components/BrandsCard";
import Recommended from "../../../components/recommended";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Platform.OS === "android" ? "#000" : "transparent"}
        translucent={false}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 0 }}
        contentInsetAdjustmentBehavior="never"
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.fullWidth}>
          <View style={styles.offer}>
            <Text style={{ color: "white" }}>
              Don’t miss out! New users get a welcome discount 🎉
            </Text>
          </View>
        </View>

        <View style={styles.fullWidth}>
          <Carousel />
        </View>

        <View style={styles.fullWidth}>
          <Announcement />
        </View>

        <View style={styles.fullWidth}>
          <Brands />
        </View>

        <View style={styles.fullWidth}>
          <Recommended />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d8d8d8ff",
  },
  fullWidth: {
    width: "100%",
    alignItems: "center",
  },
  offer: {
    width:"100%",
    backgroundColor: "#000",
    padding: 6,
    alignItems: "center",
  },
});
