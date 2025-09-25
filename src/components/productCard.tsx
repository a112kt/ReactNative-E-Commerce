import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { Image } from "expo-image";
import React from "react";
import { Rating } from "react-native-ratings";

export type Product = {
  sold: number;
  images: string[];
  subcategory: {
    _id: string;
    name: string;
    slug: string;
    category: string;
  }[];
  ratingsQuantity: number;
  _id: string;
  title: string;
  slug: string;
  description: string;
  quantity: number;
  price: number;
  availableColors: string[];
  imageCover: string;
  category: {
    _id: string;
    name: string;
    slug: string;
    image: string;
  };
  brand: {
    _id: string;
    name: string;
    slug: string;
    image: string;
  };
  ratingsAverage: number;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  id: string;
};

export default function ProductCard({ product }: { product: Product }) {
  const styles = createStyles();

  return (
    <TouchableWithoutFeedback onPress={()=>{
        
    }}>
  
      <View style={styles.card}>
        <View>
          <Image
            source={{ uri: product.imageCover }}
            style={styles.image}
            contentFit="cover"
          />
        </View>
        <Text
          numberOfLines={2}
          style={{
            fontSize: 15,
            margin: 10,
            fontWeight: "bold",
            flexWrap: "wrap",
          }}
        >
          {product.title}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Rating
            imageSize={15}
            ratingCount={5}
            startingValue={product.ratingsAverage}
            ratingBackgroundColor="#C0C0C0"
          />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: 18 }}> {product.ratingsAverage}</Text>
            <Text style={{ color: "gray" }}>/5</Text>
          </View>
        </View>
        <Text style={{ fontSize: 20, margin: 10, fontWeight: "bold" }}>
          ${product.price}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
}
function createStyles() {
  return StyleSheet.create({
    card: {
      width: "80%",
      marginHorizontal: 20,
      padding: 10,
      borderWidth: 2,
      borderColor: "#ccc",
      backgroundColor: "white",
      borderRadius: 15,
    },
    image: {
      width: 198,
      alignSelf: "center",
      height: 200,
      borderRadius: 10,
      resizeMode: "cover",
      // backgroundColor: "red",
    },
  });
}
