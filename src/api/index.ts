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

// Get specific product
export const getSpecificProduct = async (id: string | number) => {
  try {
    const response = await API.get(`/products/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error getting specific product:", error);
    throw error;
  }
};

// Add product To cart
export const addToCartApi = async (productId: string, token: string) => {
  console.log("Calling API with token:", token);
  const res = await API.post(
    "/cart",
    { productId },
    { headers: { token: token } }
  );
  console.log(res.data);
  return res.data;
};
// get cart product
export const getCartApi = async (token: string) => {
  try {
    const res = await API.get("/cart", { headers: { token: token } });
    return res.data;
  } catch (err: any) {
    console.error("API error:", err.response?.data ?? err.message);
    throw err;
  }
};

// update cart
export const updateCartItemApi = async (
  token: string,
  productId: string,
  count: number
) => {
  try {
    const res = await API.put(
      `/cart/${productId}`, 
      { count },            
      { headers: { token } } 
    );
    return res.data;
  } catch (err: any) {
    console.error(
      "updateCartItemApi error:",
      err.response?.data ?? err.message
    );
    throw err;
  }
};


// Delete From Cart
export const removeCartItemApi = async (token: string, productId: string) => {
  try {
    const res = await API.delete(`/cart/${productId}`, {
      headers: { token: token },
    });
    return res.data;
  } catch (err: any) {
    console.error("removeCartItemApi error:", err.response?.data ?? err.message);
    throw err;
  }
};

// checkout
export const checkoutSessionApi = async (
  token: string,
  cartId: string,
  shippingAddress: { details: string; phone: string; city: string },
  paymentMethod: "online" | "cash" = "online"
) => {
  try {
    const res = await API.post(
      `/orders/checkout-session/${cartId}?url=http://localhost:3000`,
      { shippingAddress, paymentMethod },
      { headers: { token } }
    );
    return res.data;
  } catch (err: any) {
    console.error("checkoutSessionApi error:", err.response?.data ?? err.message);
    throw err;
  }
};
