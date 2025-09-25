import React, { useState } from "react";
import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import { Rating } from "react-native-ratings";
import Ionicons from "@expo/vector-icons/Ionicons";

export type Product = {
  _id: string;
  title: string;
  imageCover: string;
  price: number;
  ratingsAverage: number;
};

export default function ProductCard({ product }: { product: Product }) {
  const [liked, setLiked] = useState(false);

  return (
    <View style={styles.card}>
      {/* Image + Favorite Icon */}
      <View style={styles.imageWrapper}>
        <Image source={{ uri: product.imageCover }} style={styles.image} resizeMode="cover" />
        {/* Favorite Heart Icon */}
        <Pressable style={styles.heartIcon} onPress={() => setLiked(!liked)}>
          <Ionicons name={liked ? "heart" : "heart-outline"} size={18} color={liked ? "red" : "#fff"} />
        </Pressable>
      </View>

      {/* Title */}
      <Text numberOfLines={2} style={styles.title}>{product.title}</Text>

      {/* Rating + Free Delivery */}
      <View style={styles.infoRow}>
        <Rating imageSize={14} ratingCount={5} startingValue={product.ratingsAverage || 0} ratingBackgroundColor="#C0C0C0" />
        <Text style={styles.freeDelivery}>Free Delivery</Text>
      </View>

      {/* Price + Add to Cart */}
      <View style={styles.bottomRow}>
        <Text style={styles.price}>${product.price}</Text>
        <Pressable style={styles.cartButton}
        // هنعملها لسا 
         onPress={() => console.log("Add to cart", product._id)}>
          <Ionicons name="cart-outline" size={22} color="#4ae282ff" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 4,
    borderRadius: 10,
    backgroundColor: "#fff",
    padding: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  imageWrapper: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  heartIcon: {
    position: "absolute",
    top: 6,
    right: 6,
    padding: 4,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 12,
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 4,
    textAlign: "center",
  },
  infoRow: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 4,
  },
  freeDelivery: {
    fontSize: 10,
    color: "#4ae282ff",
    marginTop: 2,
    fontWeight: "600",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  price: {
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
  },
  cartButton: {
    padding: 4,
  },
});
