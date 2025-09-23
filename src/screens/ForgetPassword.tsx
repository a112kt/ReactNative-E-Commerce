import { Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

export default function ForgetPassword() {
  let navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
      <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={30} color="#fff" />
      </Pressable>

      <View style={styles.content}>
        <Text style={styles.text}>Forget Password Screen</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  backBtn: {
    margin: 3,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
   
  },
  text: {
    fontSize: 20,
    fontWeight: "600",
     color:"#fff"
  },
});
