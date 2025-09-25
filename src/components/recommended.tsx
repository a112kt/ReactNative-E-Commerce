import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Pressable,
  Dimensions,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { DrawerParamList } from "../navigation";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { Rating } from "react-native-ratings";
import { Product } from "./productCard"; 
import { getProducts } from "../api"; 
import Ionicons from "@expo/vector-icons/Ionicons";

const { width: WINDOW_WIDTH } = Dimensions.get("window");
const ITEM_WIDTH = Math.round(WINDOW_WIDTH * 0.34);
const ITEM_MARGIN = 8;

type HomeNavProp = DrawerNavigationProp<DrawerParamList, "Home">;

export default function ProductList() {
  const [errors, setErrors] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loader, setLoader] = useState(false);
  const navigation = useNavigation<HomeNavProp>();

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoader(true);
      setErrors("");
      const list: Product[] = await getProducts(); 
      setProducts(Array.isArray(list) ? list : []);
    } catch (err: any) {
      console.log("getProducts error:", err);
      setErrors(err?.message || "Failed to load products");
    } finally {
      setLoader(false);
    }
  }

  function SmallProductCard({ item }: { item: Product }) {
    const [liked, setLiked] = useState(false);

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => {
          // navigation.navigate("ProductDetails", { productId: item._id });
        }}
        style={localStyles.card}
      >
        {/* Heart Icon */}
        <Pressable
          style={localStyles.heartIcon}
          onPress={() => setLiked(!liked)}
        >
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={16}
            color={liked ? "red" : "black"}
          />
        </Pressable>

        {/* Image + Cart */}
        <View style={localStyles.imageBox}>
          {item.imageCover ? (
            <Image
              source={{ uri: item.imageCover }}
              style={localStyles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={localStyles.imagePlaceholder}>
              <Text style={localStyles.imagePlaceholderText}>No image</Text>
            </View>
          )}
          <Pressable
            style={localStyles.cartButton}
            onPress={() => console.log("Add to cart", item._id)}
          >
            <Ionicons name="cart-outline" size={18} color="#000" />
          </Pressable>
        </View>

        {/* Title */}
        <Text numberOfLines={2} style={localStyles.title}>
          {item.title}
        </Text>

        {/* Rating + Free Delivery */}
        <View style={localStyles.ratingColumn}>
          <Rating
            imageSize={12}
            ratingCount={5}
            startingValue={item.ratingsAverage || 0}
            ratingBackgroundColor="#C0C0C0"
          />
          <Text style={localStyles.freeDelivery}>Free Delivery</Text>
        </View>

        {/* Price */}
        <Text style={localStyles.price}>${item.price}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={{ marginBottom: 20, width: "100%" }}>
      <FlatList
        data={products}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingHorizontal: ITEM_MARGIN }}
        ItemSeparatorComponent={() => <View style={{ width: ITEM_MARGIN }} />}
        renderItem={({ item }) => (
          <View style={{ width: ITEM_WIDTH }}>
            <SmallProductCard item={item} />
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Products")}
      >
        <Text style={styles.textButton}>See More</Text>
      </TouchableOpacity>

      {loader && (
        <ActivityIndicator
          size={"large"}
          color={"#4ae282ff"}
          style={{ alignSelf: "center", marginTop: 10 }}
        />
      )}
      {errors ? (
        <View style={{ alignItems: "center", marginTop: 10 }}>
          <Text style={{ color: "red", marginBottom: 8 }}>{errors}</Text>
          <Pressable style={styles.retryBtn} onPress={fetchProducts}>
            <Text style={styles.retryText}>Try again</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const localStyles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 10,
    backgroundColor: "#fff",
    padding: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e6e6e6",
    position: "relative",
    marginTop:20,
  },
  heartIcon: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#fff",
    padding: 2,
    borderRadius: 12,
    zIndex: 2,
    elevation: 2,
  },
  imageBox: {
    width: "100%",
    borderRadius: 8,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
  },
  imagePlaceholder: {
    width: "100%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
  },
  imagePlaceholderText: {
    color: "#999",
    fontSize: 12,
  },
  cartButton: {
    position: "absolute",
    bottom: 4,
    right: 4,
  },
  title: {
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
  ratingColumn: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 4,
  },
  freeDelivery: {
    fontSize: 10,
    color: "#4ae282ff",
    fontWeight: "600",
    marginTop: 2,
  },
  price: {
    marginTop: 4,
    fontWeight: "bold",
    fontSize: 13,
    color: "#111",
  },
});

const styles = StyleSheet.create({
  button: {
    backgroundColor: "white",
    borderColor: "#4ae282ff",
    borderWidth: 2,
    paddingHorizontal: 20,
    borderRadius: 27,
    width: "auto",
    alignSelf: "flex-end",
   
  },
  textButton: {
    color: "#4ae282ff",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    fontStyle: "italic",
  },
  retryBtn: {
    backgroundColor: "#4ae282ff",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontWeight: "600",
  },
});
