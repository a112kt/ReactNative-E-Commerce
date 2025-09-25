import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TextInput,
} from "react-native";
import { getProducts } from "../../../api";
import ProductCard, { Product } from "../../../components/productCard";

export default function ProductsScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProducts();
        setProducts(data); 
        setFilteredProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  useEffect(() => {
    const term = search.toLowerCase();
    const filtered = products.filter((p) =>
      p.title.toLowerCase().includes(term)
    );
    setFilteredProducts(filtered);
  }, [search, products]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4ae282ce" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Search Input */}
      <TextInput
        placeholder="Search products..."
        style={styles.searchInput}
        value={search}
        onChangeText={setSearch}
        autoFocus={true} 
      />

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item._id}
        numColumns={3}
        renderItem={({ item }) => (
          <View style={{ flex: 1 / 3, margin: 4 }}>
            <ProductCard product={item} />
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchInput: {
    height: 40,
    margin: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
});
