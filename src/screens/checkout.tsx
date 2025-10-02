import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { checkoutSessionApi } from "../api";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/index";

export default function Checkout() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const token = useSelector((s: RootState) => s.auth.token);
  const storeCartId = useSelector((s: RootState) => s.cart.cartId);
  const total = useSelector((s: RootState) => s.cart.totalCartPrice);

  const [cartId, setCartId] = useState<string>(storeCartId ?? "");
  const [details, setDetails] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cash">(
    "online"
  );
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!cartId?.trim()) {
      Alert.alert("Validation", "Cart ID is required.");
      return false;
    }
    if (!details?.trim()) {
      Alert.alert("Validation", "Please enter address details.");
      return false;
    }
    if (!phone?.trim()) {
      Alert.alert("Validation", "Please enter a phone number.");
      return false;
    }
    if (!city?.trim()) {
      Alert.alert("Validation", "Please enter a city.");
      return false;
    }
    if (!token) {
      Alert.alert(
        "Login required",
        "Please login before proceeding to checkout."
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const shippingAddress = {
        details: details.trim(),
        phone: phone.trim(),
        city: city.trim(),
      };
      const res = await checkoutSessionApi(
        token!,
        cartId.trim(),
        shippingAddress,
        paymentMethod
      );

      if (paymentMethod === "online") {
        const redirectUrl =
          res?.session?.url ?? res?.data?.session?.url ?? null;
        if (redirectUrl) {
          navigation.navigate("onlinePay", { url: redirectUrl });
        } else {
          Alert.alert(
            "Checkout",
            res?.message ?? "Checkout session created. No redirect URL."
          );
        }
      } else {
        navigation.navigate("cashPay", {
          message: res?.message ?? "Order placed — pay on delivery.",
        });
      }
    } catch (err: any) {
      console.error(err);
      const message =
        err?.response?.data?.message ??
        err?.message ??
        "Failed to create checkout session.";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  const preFillExample = () => {
    if (!cartId && storeCartId) setCartId(storeCartId);
    setDetails("123 Example St, Apt 4");
    setPhone("01010700999");
    setCity("Cairo");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f6f7fb" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.heading}>Checkout</Text>
            <Text style={styles.smallMuted}>
              Total:{" "}
              <Text style={styles.price}>${Number(total ?? 0).toFixed(2)}</Text>
            </Text>
          </View>

          <Text style={styles.label}>Cart ID</Text>
          <TextInput
            value={cartId}
            onChangeText={setCartId}
            placeholder="Enter cart id"
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Address details</Text>
          <TextInput
            value={details}
            onChangeText={setDetails}
            placeholder="Street, building, notes..."
            style={[styles.input, { height: 100 }]}
            multiline
          />

          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Phone</Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="01XXXXXXXXX"
                keyboardType="phone-pad"
                style={styles.input}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>City</Text>
              <TextInput
                value={city}
                onChangeText={setCity}
                placeholder="Cairo"
                style={styles.input}
              />
            </View>
          </View>

          <Text style={[styles.label, { marginTop: 16 }]}>Payment method</Text>
          <View style={styles.paymentRow}>
            <Pressable
              style={[
                styles.paymentOption,
                paymentMethod === "online" && styles.paymentSelected,
              ]}
              onPress={() => setPaymentMethod("online")}
            >
              <View style={styles.payLeft}>
                <Ionicons
                  name="card-outline"
                  size={20}
                  color={paymentMethod === "online" ? "#fff" : "#333"}
                />
                <Text
                  style={[
                    styles.payText,
                    paymentMethod === "online" && { color: "#fff" },
                  ]}
                >
                  Pay Online
                </Text>
              </View>
              {paymentMethod === "online" && (
                <View style={styles.check}>
                  <Ionicons name="checkmark" size={16} color="#fff" />
                </View>
              )}
            </Pressable>

            <Pressable
              style={[
                styles.paymentOption,
                paymentMethod === "cash" && styles.paymentSelected,
              ]}
              onPress={() => setPaymentMethod("cash")}
            >
              <View style={styles.payLeft}>
                <Ionicons
                  name="cash-outline"
                  size={20}
                  color={paymentMethod === "cash" ? "#fff" : "#333"}
                />
                <Text
                  style={[
                    styles.payText,
                    paymentMethod === "cash" && { color: "#fff" },
                  ]}
                >
                  Cash on Delivery
                </Text>
              </View>
              {paymentMethod === "cash" && (
                <View style={styles.check}>
                  <Ionicons name="checkmark" size={16} color="#fff" />
                </View>
              )}
            </Pressable>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.primaryBtn,
              pressed && { opacity: 0.95 },
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryBtnText}>
                {paymentMethod === "online"
                  ? "Proceed to Payment"
                  : "Place Order (Cash)"}
              </Text>
            )}
          </Pressable>

          <Pressable onPress={preFillExample} style={styles.ghostBtn}>
            <Text style={styles.ghostText}>Fill example data</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 80, padding: 18, paddingBottom: 40 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  heading: { fontSize: 20, fontWeight: "800" },
  smallMuted: { fontSize: 13, color: "#666" },
  price: { color: "#111", fontWeight: "900" },
  label: { marginTop: 8, marginBottom: 6, fontWeight: "700", color: "#333" },
  input: {
    backgroundColor: "#f6f7fb",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#eee",
    fontSize: 15,
  },
  paymentRow: { flexDirection: "row", marginTop: 6, gap: 12 },
  paymentOption: {
    flex: 1,
    backgroundColor: "#fafafa",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  paymentSelected: { backgroundColor: "#111827", borderColor: "#111827" },
  payLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  payText: { fontWeight: "700", color: "#111" },
  check: { backgroundColor: "#4ae282", padding: 6, borderRadius: 8 },
  primaryBtn: {
    marginTop: 18,
    backgroundColor: "#111827",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  ghostBtn: { marginTop: 12, alignItems: "center", paddingVertical: 10 },
  ghostText: { color: "#4ae282", fontWeight: "700" },
});
