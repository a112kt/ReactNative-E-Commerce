import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ActivityIndicator,
  GestureResponderEvent,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Toast from "react-native-toast-message";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";

import type { RootState, AppDispatch } from "../redux/store";
import type { ProductDetail } from "../assests/types";
import type { RootStackParamList } from "../navigation/index";
import { addToCart } from "../redux/slices/cartSlice";

export type Product = {
  _id: string;
  title: string;
  imageCover?: string | null;
  price: number;
  ratingsAverage?: number;
};

export default function ProductCard({
  product,
  fetchDetails = false,
  onPress,
  onAddToCart, 
}: {
  product: Product;
  fetchDetails?: boolean;
  onPress?: (detail?: ProductDetail) => void;
  onAddToCart?: (productId: string, qty?: number) => Promise<void> | void;
}) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const token = useSelector((s: RootState) => s.auth.token);
  const dispatch = useDispatch<AppDispatch>();

  const [liked, setLiked] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);

  const placeholder = "https://via.placeholder.com/400x400?text=No+Image";
  const imageUri = product.imageCover ?? placeholder;

  const handlePress = useCallback(() => {
    if (onPress) {
      onPress();
      return;
    }
    navigation.navigate("ProductDetails", { productId: product._id });
  }, [navigation, onPress, product._id]);

  const handleAddToCart = useCallback(
    async (e?: GestureResponderEvent) => {
      if (e && typeof e.stopPropagation === "function") e.stopPropagation();
      if (onAddToCart) {
        try {
          setLoadingAdd(true);
          await onAddToCart(product._id, 1);
          Toast.show({ type: "success", text1: "Added to cart", text2: product.title, visibilityTime: 1200 });
        } catch (err: any) {
          Toast.show({ type: "error", text1: "Failed", text2: err?.message ?? "Could not add to cart" });
        } finally {
          setLoadingAdd(false);
        }
        return;
      }
      if (!token) {
        Toast.show({ type: "error", text1: "Login required", text2: "Please login to add items to cart" });
        return;
      }

      try {
        setLoadingAdd(true);
        const action = await dispatch(addToCart({ productId: product._id, token }));
        if ((action as any).error) {
          const err = (action as any).error;
          console.error("addToCart thunk error:", err);
          const msg = err?.message ?? "Failed to add to cart";
          Toast.show({ type: "error", text1: "Error", text2: msg });
        } else {
          Toast.show({ type: "success", text1: "Added to cart", text2: product.title, visibilityTime: 1200 });
        }
      } catch (err: any) {
        console.error("dispatch(addToCart) caught:", err);
        Toast.show({ type: "error", text1: "Error", text2: err?.message ?? "Failed to add to cart" });
      } finally {
        setLoadingAdd(false);
      }
    },
    [onAddToCart, product._id, product.title, token, dispatch]
  );

  return (
    <Pressable onPress={handlePress} style={{ flex: 1 }} testID={`product-card-${product._id}`}>
      <View style={styles.card}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
          <Pressable
            onPress={(e) => {
              if (e && typeof e.stopPropagation === "function") e.stopPropagation();
              setLiked((s) => !s);
            }}
            style={styles.heartIcon}
            hitSlop={6}
            testID={`like-${product._id}`}
          >
            <Ionicons name={liked ? "heart" : "heart-outline"} size={18} color={liked ? "red" : "#fff"} />
          </Pressable>
        </View>

        <Text numberOfLines={2} style={styles.title}>
          {product.title}
        </Text>

        <View style={styles.bottomRow}>
          <Text style={styles.price}>${product.price}</Text>

          {loadingAdd ? (
            <ActivityIndicator size="small" />
          ) : (
            <Pressable onPress={handleAddToCart} style={styles.cartButton} testID={`add-to-cart-${product._id}`}>
              <Ionicons name="cart-outline" size={22} color="#4ae282ff" />
            </Pressable>
          )}
        </View>
      </View>
    </Pressable>
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
    shadowOpacity: 0.12,
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
    padding: 6,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: 14,
  },
  title: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 6,
    textAlign: "center",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  price: {
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
  },
  cartButton: {
    padding: 6,
  },
});
