import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Dimensions,
  Image,
} from "react-native";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { clearToken } from "../../../redux/slices/tokenSlice";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import Announcement from "../../../components/announcement";
import ProductCard, { Product } from "../../../components/productCard";
import { ScrollView } from "react-native-gesture-handler";
type HomeNavProp = NativeStackNavigationProp<RootStackParamList, "MyTabs">;
import Carousel from "../../../components/carousel";
import Recommended from "../../../components/recommended";
export default function HomeScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<HomeNavProp>();

  const handleSignOut = () => {
    dispatch(clearToken());
    navigation.replace("Login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.offer}>
          <Text style={{ color: "white" }}>
            Don’t miss out! New users get a welcome discount 🎉
          </Text>
        </View>
        <Carousel />
        <Recommended />
        <Announcement />
      
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#d8d8d8ff",
  },
  

  buttonText: { color: "#fff", fontSize: 16 },
  offer: {
    backgroundColor: "#000",
    padding: 3,
    margin: 0,
  },
});
