import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Pressable,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { DrawerParamList } from "../navigation";
import { DrawerNavigationProp } from "@react-navigation/drawer";

import React from "react";
import { useState, useEffect } from "react";
import ProductCard, { Product } from "./productCard";
import axios from "axios";
import { Dimensions } from "react-native";

export default function Recommended() {
  const [errors, setErrors] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loader, setLoader] = useState(false);
  type HomeNavProp = DrawerNavigationProp<DrawerParamList, "Home">;
  const navigation = useNavigation<HomeNavProp>();
  useEffect(() => {
    getProducts();
  }, []);
  function getProducts() {
    setLoader(true);
    axios
      .get("https://ecommerce.routemisr.com/api/v1/products?price[gte]=100")
      .then((res) => {
        console.log(res.data.data[2]);
        setProducts(res.data.data);
      })
      .catch((err) => {
        console.log(err.response);
        setErrors(err.response.data?.message);
      })
      .finally(() => {
        setLoader(false);
      });
  }
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={styles.title}>Recommended For You</Text>

      <View style={styles.cont}>
        {!loader ? (
          <FlatList
            data={products}
            renderItem={({ item }) => (
              <View
                style={{
                  alignItems: "center",
                  width: Dimensions.get("window").width,
                }}
              >
                <ProductCard product={item} />
              </View>
            )}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            pagingEnabled
          />
        ) : (
          <ActivityIndicator
            size={"large"}
            color={"#4ae282ff"}
            style={{ alignSelf: "center" }}
          />
        )}
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate("Products");
        }}
      >
        <Text style={styles.textButton}>View More ...</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    marginTop: 20,
    marginBottom: 5,
    fontSize: 22,
    fontWeight: "bold",
    textShadowColor: "black",
    textShadowOffset: {
      width: 1,
      height: 1,
    },
    textShadowRadius: 2,
  },
  cont: {
    paddingVertical: 10,
    marginTop: 5,
    minHeight: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "white",
    borderColor: "#4ae282ff",
    borderWidth: 3,

    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 27,
    width: "60%",

    // Shadow iOS
    shadowColor: "#000000f6",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,

    // Shadow Android
    elevation: 5,
    alignSelf: "center",
  },
  textButton: {
    color: "#4ae282ff",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    fontStyle: "italic",
  },
});
