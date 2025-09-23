import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { clearToken } from "../redux/slices/tokenSlice";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";

type HomeNavProp = NativeStackNavigationProp<RootStackParamList, "Home">;

export default function HomeScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<HomeNavProp>();

  const handleSignOut = () => {
    dispatch(clearToken());
    navigation.replace("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome Home 🎉</Text>
      <Pressable style={styles.button} onPress={handleSignOut}>
        {/* ملحوووووووووووووووووووووووووووظهههههههههههههههههههههههههههههههههههههههههههههه */}
        {/* ابقي خد الزاز دا واعمله فوق للخرووووج خليه ايقون */}
        <Text style={styles.buttonText}>Sign Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  // وابقي شيل الاقرف دا 
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" },
  text: { 
    fontSize: 22,
     marginBottom: 20 },
  button: {
    backgroundColor: "red",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: { color: "#fff", fontSize: 16 },
});
