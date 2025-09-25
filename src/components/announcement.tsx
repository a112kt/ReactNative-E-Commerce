import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { getCategories } from "../api";

export type Category = {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt: string;
  updatedAt: string;
};

const { width: WINDOW_WIDTH } = Dimensions.get("window");

const H_PADDING = 12;
const CONTAINER_WIDTH = WINDOW_WIDTH - H_PADDING * 2;
const ITEM_MARGIN = 8;
const NUM_COLS = 5;
const ITEM_WIDTH = Math.floor(
  (CONTAINER_WIDTH - ITEM_MARGIN * (NUM_COLS - 1)) / NUM_COLS
);

export default function Announcement() {
  const [cats, setCats] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await getCategories();
        setCats(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.log("getCategories error:", err);
        setError(err?.message || "Failed to load categories");
      }
    };
    fetchCats();
  }, []);

  const renderItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.item, { width: ITEM_WIDTH, marginRight: ITEM_MARGIN }]}
    >
      <View style={styles.imageWrap}>
        <Image source={{ uri: item.image }} style={styles.circleImage} />
      </View>
      <Text style={styles.name} numberOfLines={2}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.outer}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>BROWSE BY CATEGORIES</Text>
      </View>

      {error ? (
        <Text style={{ color: "red", textAlign: "center", marginTop: 8 }}>
          {error}
        </Text>
      ) : (
        <FlatList
          data={cats}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          numColumns={NUM_COLS}
          contentContainerStyle={{ paddingHorizontal: H_PADDING, paddingBottom: 8 }}
          columnWrapperStyle={{ justifyContent: "flex-start", marginBottom: 1 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: "100%",
  },
  headerRow: {
    width: "100%",
    paddingHorizontal: H_PADDING,
    marginBottom: 6,
  },
  heading: {
    fontSize: 18,
    fontWeight: "800",
    textAlign: "left",
    letterSpacing: 0.5,
    marginTop:20,
    padding:4,
  },
  item: {
    alignItems: "center",
  },
  imageWrap: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    borderRadius: ITEM_WIDTH / 2,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 0.3,
    borderColor: "#eee",
  },
  circleImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  name: {
    marginTop: 6,
    fontSize: 11,
    textAlign: "center",
    width: ITEM_WIDTH,
    color: "#111",
    fontWeight: "500",
  },
});
