import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { getBrands } from "../api"; 

export type Brand = {
  _id: string;
  name: string;
  slug?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
};

const { width: WINDOW_WIDTH } = Dimensions.get("window");

const CARD_WIDTH = Math.round(WINDOW_WIDTH * 0.28); 
const CARD_HEIGHT = Math.round(CARD_WIDTH * 0.8); 
const ITEM_MARGIN = 12;

export default function Brands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  async function fetchBrands() {
    try {
      setLoading(true);
      setError(null);
      const data: Brand[] = await getBrands();
      setBrands(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.log("getBrands error:", err);
      setError(err?.message || "Failed to load brands");
    } finally {
      setLoading(false);
    }
  }

  function renderItem({ item }: { item: Brand }) {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.cardWrap}
        onPress={() => {
          
        }}
      >
        <View style={styles.card}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.logo} resizeMode="cover" />
          ) : (
            <View style={[styles.logo, styles.logoFallback]}>
              <Text numberOfLines={1} style={styles.fallbackText}>
                {item.name?.charAt(0) ?? "B"}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.brandName} numberOfLines={1}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Your favorite brands</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="small" color="#4ae282ff" style={{ marginVertical: 12 }} />
      ) : error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchBrands}>
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={brands}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(b) => b._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: ITEM_MARGIN }}
          ItemSeparatorComponent={() => <View style={{ width: ITEM_MARGIN }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: ITEM_MARGIN,
    marginBottom: 8,
  },
  title: { fontSize: 18, fontWeight: "700" },
  viewAll: { color: "#4ae282ff", fontWeight: "600" },

  cardWrap: {
    width: CARD_WIDTH,
    alignItems: "center",
  },
  card: {
    width: "100%",
    height: CARD_HEIGHT,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 0.3,
    borderColor: "#eee",
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  logoFallback: {
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    alignItems: "center",
  },
  fallbackText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#666",
  },
  brandName: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 13,
    fontWeight: "600",
    width: "100%",
  },

  errorBox: {
    paddingHorizontal: ITEM_MARGIN,
    alignItems: "center",
  },
  errorText: { color: "red", marginBottom: 8 },
  retryBtn: {
    backgroundColor: "#4ae282ff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryText: { color: "#fff", fontWeight: "600" },
});
