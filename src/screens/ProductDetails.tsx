import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
  Dimensions,
  FlatList,
  Pressable,
  TouchableOpacity,
  SafeAreaView,
  GestureResponderEvent,
  Alert,
} from "react-native";
import {
  useRoute,
  useNavigation,
  NavigationProp,
} from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Rating } from "react-native-ratings";
import Toast from "react-native-toast-message";
import { useSelector, useDispatch } from "react-redux";

import { getSpecificProduct, getProducts } from "../api";
import { ProductDetail } from "../assests/types";
import { RootStackParamList } from "../navigation";
import type { RootState, AppDispatch } from "../redux/store";
import { addToCart } from "../redux/slices/cartSlice";

const { width } = Dimensions.get("window");

export default function ProductDetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { productId } = route.params as { productId: string };

  const token = useSelector((s: RootState) => s.auth.token);
  const dispatch = useDispatch<AppDispatch>();

  const [detail, setDetail] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const mainListRef = useRef<FlatList<string> | null>(null);

  // related products
  const [related, setRelated] = useState<any[]>([]);
  const [relatedLoading, setRelatedLoading] = useState<boolean>(false);

  // add-to-cart loading
  const [adding, setAdding] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;

    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getSpecificProduct(productId);
        if (!cancelled) setDetail(data);
      } catch (err: any) {
        if (!cancelled) setError(err?.message ?? "Unexpected error occurred");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchDetail();

    return () => {
      cancelled = true;
    };
  }, [productId]);
  useEffect(() => {
    let cancelled = false;
    if (!detail) return;

    const fetchRelated = async () => {
      setRelatedLoading(true);
      try {
        const all = await getProducts();
        if (cancelled) return;

        const relatedFiltered = all
          .filter(
            (p: any) =>
              p._id !== detail._id &&
              (p.brand?._id === detail.brand?._id ||
                p.category?._id === detail.category?._id)
          )
          .map((p: any) => ({
            ...p,
            categoryName: p.category?.name || "Unknown",
          }));

        setRelated(relatedFiltered.slice(0, 8));
      } catch (err) {
        console.warn("Error fetching related products", err);
        setRelated([]);
      } finally {
        if (!cancelled) setRelatedLoading(false);
      }
    };

    fetchRelated();

    return () => {
      cancelled = true;
    };
  }, [detail]);

  const images = detail
    ? detail.images?.length
      ? detail.images
      : [detail.imageCover]
    : [];

  const renderMainImage = ({ item }: { item: string }) => (
    <Image source={{ uri: item }} style={styles.mainImage} resizeMode="cover" />
  );

  const goToIndex = (index: number) => {
    setActiveIndex(index);
    if (mainListRef.current) {
      try {
        mainListRef.current.scrollToIndex({ index, animated: true });
      } catch {}
    }
  };

  // ------------ updated: handleAddToCart using Redux thunk ------------
  const handleAddToCart = useCallback(
    async (e?: GestureResponderEvent) => {
      if (e && typeof e.stopPropagation === "function") e.stopPropagation();
      if (!detail) return;

      if (!token) {
        Toast.show({
          type: "error",
          text1: "Login required",
          text2: "Please login to add items to cart",
        });
        return;
      }

      try {
        setAdding(true);
        const action = await dispatch(
          addToCart({ productId: detail._id, token })
        );
        if ((action as any).error) {
          const err = (action as any).error;
          console.error("addToCart thunk error:", err);
          const msg = err?.message ?? "Failed to add to cart";
          Toast.show({ type: "error", text1: "Error", text2: msg });
          return;
        }
        Toast.show({
          type: "success",
          text1: "Added to cart",
          text2: detail.title,
          visibilityTime: 1400,
        });
      } catch (err: any) {
        console.error("dispatch(addToCart) caught:", err);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: err?.message ?? "Failed to add to cart",
        });
      } finally {
        setAdding(false);
      }
    },
    [detail, token, dispatch]
  );
  // ------------------------------------------------------------------

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={{ color: "red" }}>{error}</Text>
      </SafeAreaView>
    );
  }

  if (!detail) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>No product data available</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={22} color="#111" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={styles.mainImageArea}>
          <FlatList
            ref={(r) => {
              mainListRef.current = r;
            }}
            data={images}
            keyExtractor={(item, idx) => `${item}-${idx}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={renderMainImage}
            onMomentumScrollEnd={(ev) => {
              const newIndex = Math.round(
                ev.nativeEvent.contentOffset.x / width
              );
              setActiveIndex(newIndex);
            }}
            style={{ flexGrow: 0 }}
          />
        </View>

        <View style={styles.thumbsArea}>
          <FlatList
            data={images}
            keyExtractor={(item, idx) => `${item}-thumb-${idx}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <Pressable
                onPress={() => goToIndex(index)}
                style={[
                  styles.thumbWrapper,
                  index === activeIndex ? styles.thumbActive : undefined,
                ]}
              >
                <Image
                  source={{ uri: item }}
                  style={styles.thumbImage}
                  resizeMode="cover"
                />
              </Pressable>
            )}
            ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
            contentContainerStyle={{ paddingHorizontal: 12 }}
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{detail.title}</Text>

          <View style={styles.rowBetween}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Rating
                imageSize={16}
                ratingCount={5}
                startingValue={detail.ratingsAverage || 0}
                readonly
                ratingBackgroundColor="#C0C0C0"
              />
              <Text style={styles.smallText}> ({detail.ratingsQuantity})</Text>
            </View>

            <Text style={styles.soldText}>Sold: {detail.sold}</Text>
          </View>

          <Text style={styles.price}>${detail.price}</Text>

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Brand:</Text>
            <Text style={styles.metaValue}>{detail.brand?.name ?? "-"}</Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Category:</Text>
            <Text style={styles.metaValue}>{detail.category?.name ?? "-"}</Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Availability:</Text>
            <Text style={styles.metaValue}>
              {detail.quantity > 0
                ? `${detail.quantity} in stock`
                : "Out of stock"}
            </Text>
          </View>

          {detail.description ? (
            <>
              <Text style={[styles.sectionTitle, { marginTop: 12 }]}>
                Description
              </Text>
              <Text style={styles.description}>{detail.description}</Text>
            </>
          ) : null}

          <View style={{ marginTop: 18 }}>
            <Pressable
              style={[
                styles.addButton,
                detail.quantity <= 0 || adding ? { opacity: 0.6 } : undefined,
              ]}
              onPress={handleAddToCart}
              disabled={detail.quantity <= 0 || adding}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {adding ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="cart-outline" size={20} color="#fff" />
                    <Text style={styles.addButtonText}> Add to Cart</Text>
                  </>
                )}
              </View>
            </Pressable>
          </View>
        </View>

        {/* Related products */}
        <View style={styles.relatedSection}>
          <View style={styles.relatedHeader}>
            <Text style={styles.sectionTitle}>Related Products</Text>
            {relatedLoading ? <ActivityIndicator size="small" /> : null}
          </View>

          {related.length === 0 && !relatedLoading ? (
            <Text style={{ color: "#666", marginHorizontal: 12, marginTop: 8 }}>
              No related products found.
            </Text>
          ) : (
            <FlatList
              data={related}
              horizontal
              keyExtractor={(item) => item._id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 12 }}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.relatedCard}
                  onPress={() =>
                    navigation.navigate("ProductDetails", {
                      productId: item._id,
                    })
                  }
                >
                  <Image
                    source={{ uri: item.imageCover }}
                    style={styles.relatedImage}
                  />
                  <Text numberOfLines={2} style={styles.relatedTitle}>
                    {item.title}
                  </Text>
                  <Text style={styles.relatedCategory}>
                    {item.categoryName}
                  </Text>
                  <Text style={styles.relatedPrice}>${item.price}</Text>
                </Pressable>
              )}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  backButton: {
    marginTop: 40,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  mainImageArea: {
    width,
    height: width,
    backgroundColor: "#f5f5f5",
  },
  mainImage: { width, height: width, resizeMode: "cover" },

  thumbsArea: { height: 88, marginTop: 8 },
  thumbWrapper: {
    width: 72,
    height: 72,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  thumbActive: {
    borderColor: "#4ae282ff",
  },
  thumbImage: { width: "100%", height: "100%", resizeMode: "cover" },

  content: { paddingHorizontal: 16, paddingTop: 12 },
  title: { fontSize: 18, fontWeight: "700", textAlign: "left" },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  smallText: { fontSize: 12, color: "#555", marginLeft: 6 },
  soldText: { fontSize: 12, color: "#555" },
  price: { fontSize: 20, fontWeight: "800", marginTop: 8, color: "#1a1a1a" },
  metaRow: { flexDirection: "row", marginTop: 8 },
  metaLabel: { fontWeight: "600", marginRight: 6 },
  metaValue: { color: "#444" },
  sectionTitle: { fontWeight: "700", marginTop: 12, padding: 10, fontSize: 14 },
  description: { marginTop: 6, color: "#444", lineHeight: 18 },
  addButton: {
    backgroundColor: "#4ae282ff",
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: { color: "#fff", fontWeight: "700" },

  relatedSection: { marginTop: 18 },
  relatedHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  relatedCard: {
    width: 140,
    marginRight: 12,
    borderRadius: 8,
    padding: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  relatedImage: { width: "100%", height: 90, borderRadius: 6, marginBottom: 8 },
  relatedTitle: { fontSize: 12, fontWeight: "600" },
  relatedCategory: { fontSize: 11, color: "#777", marginTop: 2 },
  relatedPrice: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "700",
    color: "#111",
  },
});
