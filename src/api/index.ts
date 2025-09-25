import axios from "axios";

const API = axios.create({
  baseURL: "https://ecommerce.routemisr.com/api/v1",
  headers: { "Content-Type": "application/json" },
});

// Get all products
export const getProducts = async () => {
  try {
    const response = await API.get("/products");
    return response.data.data; 
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Get all categories
export const getCategories = async () => {
  try {
    const response = await API.get("/categories");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Get all brands
export const getBrands = async () => {
  try {
    const response = await API.get("/brands");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching brands:", error);
    throw error;
  }
};


