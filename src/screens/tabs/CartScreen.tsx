import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import {
  fetchCart,
  selectCartItems,
  selectCartTotal,
  selectCartCount,
  updateCartItem,
  removeCartItem,
} from "../../redux/slices/cartSlice";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation";

type CartItemFromStore = {
  cartItemId: string;
  productId?: string;
  title?: string;
  imageCover?: string | null;
  price?: number;
  quantity?: number;
};

export default function CartScreen() {
  type checkout = NativeStackNavigationProp<RootStackParamList,"checkout">
  let navigation = useNavigation<checkout>()
  const token = useSelector((state: RootState) => state.auth.token);
  const itemsFromStore = useSelector((state: RootState) =>
    selectCartItems(state)
  );
  const totalFromStore = useSelector((state: RootState) =>
    selectCartTotal(state)
  );
  const dispatch = useDispatch<AppDispatch>();

  const [refreshing, setRefreshing] = useState(false);
  const [itemLoadingMap, setItemLoadingMap] = useState<Record<string, boolean>>(
    {}
  );

  const setItemLoading = (id: string, loading: boolean) =>
    setItemLoadingMap((m) => ({ ...m, [id]: loading }));

  useEffect(() => {
    if (token) {
      dispatch(fetchCart(token));
    }
  }, [token, dispatch]);

  const onRefresh = async () => {
    if (!token) return;
    setRefreshing(true);
    try {
      await dispatch(fetchCart(token));
    } catch (err) {
      console.error("fetchCart error:", err);
      Alert.alert("Error", "Failed to refresh cart.");
    } finally {
      setRefreshing(false);
    }
  };

  const changeQuantity = async (
    cartItemId: string,
    productId: string | undefined,
    nextQty: number
  ) => {
    if (!token) {
      Alert.alert("Login required", "Please login to update cart.");
      return;
    }
    if (!productId) {
      Alert.alert("Error", "Missing product id for this cart item.");
      return;
    }
    if (nextQty < 1) return;

    setItemLoading(cartItemId, true);
    try {
      const action = await dispatch(
        updateCartItem({ token, productId, count: nextQty })
      );
      if ((action as any).error) throw (action as any).error;
    } catch (err: any) {
      console.error("updateCartItem error:", err);
      Alert.alert("Error", err?.message ?? "Could not update quantity.");
    } finally {
      setItemLoading(cartItemId, false);
    }
  };

  const handleRemove = (cartItemId: string, productId?: string) => {
    Alert.alert("Remove item", "Are you sure you want to remove this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          if (!token) {
            Alert.alert("Login required", "Please login to remove items.");
            return;
          }

          const idToSend = productId ?? cartItemId;
          setItemLoading(cartItemId, true);
          try {
            const action = await dispatch(
              removeCartItem({ token, productId: idToSend })
            );
            if ((action as any).error) throw (action as any).error;
          } catch (err: any) {
            console.error("removeCartItem error:", err);
            Alert.alert("Error", err?.message ?? "Could not remove item.");
          } finally {
            setItemLoading(cartItemId, false);
          }
        },
      },
    ]);
  };

  const items: CartItemFromStore[] = itemsFromStore ?? [];

  if (!items) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#4ae282" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🛒Your Cart</Text>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Ionicons name="cart-outline" size={72} color="#cfcfcf" />
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <Pressable style={styles.reloadBtn} onPress={onRefresh}>
            <Text style={styles.reloadBtnText}>Reload</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.cartItemId}
            onRefresh={onRefresh}
            refreshing={refreshing}
            contentContainerStyle={{ paddingBottom: 140 }}
            renderItem={({ item }) => {
              const imageUri =
                item.imageCover ??
                "https://via.placeholder.com/80x80?text=No+Image";
              const updating = !!itemLoadingMap[item.cartItemId];
              const price = Number(item.price ?? 0);
              const qty = Number(item.quantity ?? 0);
              const rowTotal = Number((price * qty).toFixed(2));

              return (
                <View style={[styles.card]}>
                  <View style={styles.left}>
                    <Image source={{ uri: imageUri }} style={styles.thumb} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text numberOfLines={2} style={styles.productTitle}>
                        {item.title ?? "Untitled"}
                      </Text>
                      <Text style={styles.skuText}>
                        {item.productId ? `ID: ${item.productId}` : ""}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.right}>
                    <Text style={styles.price}>${price.toFixed(2)}</Text>

                    <View style={styles.qtyRow}>
                      <Pressable
                        style={({ pressed }) => [
                          styles.qtyBtn,
                          pressed && styles.pressedBtn,
                          updating && styles.disabledBtn,
                        ]}
                        onPress={() => {
                          if (updating) return;
                          if (qty <= 1) {
                            handleRemove(item.cartItemId, item.productId);
                          } else {
                            changeQuantity(
                              item.cartItemId,
                              item.productId,
                              qty - 1
                            );
                          }
                        }}
                      >
                        <Ionicons
                          name="remove"
                          size={16}
                          color={qty <= 1 ? "#999" : "#333"}
                        />
                      </Pressable>

                      <Text style={styles.qtyText}>{qty}</Text>

                      <Pressable
                        style={({ pressed }) => [
                          styles.qtyBtn,
                          pressed && styles.pressedBtn,
                          updating && styles.disabledBtn,
                        ]}
                        onPress={() =>
                          !updating &&
                          changeQuantity(
                            item.cartItemId,
                            item.productId,
                            qty + 1
                          )
                        }
                      >
                        <Ionicons name="add" size={16} color="#333" />
                      </Pressable>
                    </View>

                    <Text style={styles.rowTotal}>${rowTotal.toFixed(2)}</Text>

                    <Pressable
                      style={({ pressed }) => [
                        styles.deleteBtn,
                        pressed && styles.pressedDelete,
                        updating && styles.disabledBtn,
                      ]}
                      onPress={() =>
                        !updating &&
                        handleRemove(item.cartItemId, item.productId)
                      }
                    >
                      <Ionicons name="trash-outline" size={16} color="#fff" />
                    </Pressable>
                  </View>
                </View>
              );
            }}
            ListFooterComponent={() => (
              <View style={styles.footer}>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>
                    ${Number(totalFromStore ?? 0).toFixed(2)}
                  </Text>
                </View>

                <Pressable
                  style={({ pressed }) => [
                    styles.checkoutBtn,
                    pressed && styles.pressedCheckout,
                  ]}
                  onPress={() => {
                    navigation.navigate("checkout")
                    
                  }}
                >
                  <Text style={styles.checkoutText}>Proceed to Checkout</Text>
                </Pressable>
              </View>
            )}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
    padding: 16,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: { fontSize: 22, fontWeight: "800", color: "#1a1a1a", marginTop: 20 },

  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  emptyText: { marginTop: 12, fontSize: 16, color: "#7a7a7a" },
  reloadBtn: {
    marginTop: 14,
    backgroundColor: "#4ae282",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },
  reloadBtnText: { color: "#fff", fontWeight: "700" },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  left: { flexDirection: "row", alignItems: "center", flex: 1 },
  thumb: { width: 72, height: 72, borderRadius: 10, backgroundColor: "#eee" },
  productTitle: {
    fontWeight: "700",
    fontSize: 14,
    color: "#111",
    marginBottom: 4,
  },
  skuText: { fontSize: 11, color: "#999" },

  right: {
    width: 150,
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  price: { fontSize: 14, fontWeight: "700", color: "#333" },

  qtyRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  qtyBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e6e6e6",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  pressedBtn: { transform: [{ scale: 0.98 }], opacity: 0.9 },
  disabledBtn: { opacity: 0.5 },
  qtyText: {
    marginHorizontal: 10,
    fontWeight: "700",
    minWidth: 18,
    textAlign: "center",
  },

  rowTotal: { marginTop: 8, fontWeight: "800", color: "#111" },

  deleteBtn: {
    marginTop: 8,
    backgroundColor: "#ff6b6b",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  pressedDelete: { transform: [{ scale: 0.98 }], opacity: 0.95 },

  footer: { marginTop: 10, paddingVertical: 14, paddingHorizontal: 12 },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  totalLabel: { fontSize: 16, color: "#666", fontWeight: "700" },
  totalValue: { fontSize: 20, color: "#111", fontWeight: "900" },

  checkoutBtn: {
    backgroundColor: "#111827",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  pressedCheckout: { opacity: 0.9, transform: [{ scale: 0.995 }] },
  checkoutText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
