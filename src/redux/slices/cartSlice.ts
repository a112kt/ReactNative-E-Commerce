import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { addToCartApi, getCartApi, updateCartItemApi, removeCartItemApi } from "../../api";
import type { RootState } from "../store";

type CartProduct = {
  cartItemId: string;
  productId?: string;
  title?: string;
  imageCover?: string | null;
  price?: number;
  quantity?: number;
};

type CartState = {
  loading: boolean;
  error?: string | null;
  numOfCartItems: number;
  cartId?: string | null;
  items: CartProduct[]; 
  totalCartPrice: number;
};

const initialState: CartState = {
  loading: false,
  error: null,
  numOfCartItems: 0,
  cartId: null,
  items: [],
  totalCartPrice: 0,
};

// Thunks
export const fetchCart = createAsyncThunk("cart/fetchCart", async (token: string) => {
  const res = await getCartApi(token);
  return res; 
});

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, token }: { productId: string; token: string }) => {
    const res = await addToCartApi(productId, token);
    return res; 
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ token, productId, count }: { token: string; productId: string; count: number }) => {
    const res = await updateCartItemApi(token, productId, count);
    return res;
  }
);

export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async ({ token, productId }: { token: string; productId: string }) => {
    const res = await removeCartItemApi(token, productId);
    return res;
  }
);
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartCount(state, action: PayloadAction<number>) {
      state.numOfCartItems = action.payload;
    },
    clearCartState(state) {
      state.numOfCartItems = 0;
      state.items = [];
      state.cartId = null;
      state.totalCartPrice = 0;
    },
    optimisticAdd(state, action: PayloadAction<{ productId: string; title?: string; price?: number }>) {
      const tempId = `temp-${Date.now()}`;
      const { productId, title, price } = action.payload;
      state.items.push({
        cartItemId: tempId,
        productId,
        title,
        price,
        quantity: 1,
      });
      state.numOfCartItems = (state.numOfCartItems || 0) + 1;
      state.totalCartPrice = Number((state.totalCartPrice + (price || 0)).toFixed(2));
    },
  },
  extraReducers: (builder) => {
    // fetchCart
    builder.addCase(fetchCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.loading = false;
      const payload = action.payload ?? {};
      const data = payload.data ?? {};
      state.cartId = payload.cartId ?? data._id ?? state.cartId;
      state.numOfCartItems = Number(payload.numOfCartItems ?? data.numOfCartItems ?? (data.products?.length ?? state.numOfCartItems));
      const products = data.products ?? [];
      state.items = products.map((p: any) => ({
        cartItemId: p._id,
        productId: p.product?._id ?? p.product,
        title: p.product?.title ?? undefined,
        imageCover: p.product?.imageCover ?? undefined,
        price: p.price ?? undefined,
        quantity: p.count ?? 1,
      }));
      state.totalCartPrice = Number((data.totalCartPrice ?? 0).toFixed(2));
    });
    builder.addCase(fetchCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error?.message ?? "Failed to fetch cart";
    });

    // addToCart: optimistic pattern
    builder.addCase(addToCart.pending, (state, action) => {
      state.loading = true;
      state.error = null;
      // Optimistically increase count (UI shows immediate increment)
      state.numOfCartItems = (state.numOfCartItems ?? 0) + 1;
    });
    builder.addCase(addToCart.fulfilled, (state, action) => {
      state.loading = false;
      const payload = action.payload ?? {};
      const data = payload.data ?? {};
      state.cartId = payload.cartId ?? data._id ?? state.cartId;
      state.numOfCartItems = Number(payload.numOfCartItems ?? data.numOfCartItems ?? state.numOfCartItems);
      const products = data.products ?? [];
      state.items = products.map((p: any) => ({
        cartItemId: p._id,
        productId: p.product?._id ?? p.product,
        title: p.product?.title ?? undefined,
        imageCover: p.product?.imageCover ?? undefined,
        price: p.price ?? undefined,
        quantity: p.count ?? 1,
      }));
      state.totalCartPrice = Number((data.totalCartPrice ?? 0).toFixed(2));
    });
    builder.addCase(addToCart.rejected, (state, action) => {
      state.loading = false;
      state.numOfCartItems = Math.max(0, (state.numOfCartItems ?? 1) - 1);
      state.error = action.error?.message ?? "Failed to add to cart";
    });

    builder.addCase(updateCartItem.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateCartItem.fulfilled, (state, action) => {
      state.loading = false;
      const payload = action.payload ?? {};
      const data = payload.data ?? {};
      const products = data.products ?? [];
      state.items = products.map((p: any) => ({
        cartItemId: p._id,
        productId: p.product?._id ?? p.product,
        title: p.product?.title ?? undefined,
        imageCover: p.product?.imageCover ?? undefined,
        price: p.price ?? undefined,
        quantity: p.count ?? 1,
      }));
      state.numOfCartItems = Number(payload.numOfCartItems ?? data.numOfCartItems ?? state.numOfCartItems);
      state.totalCartPrice = Number((data.totalCartPrice ?? 0).toFixed(2));
    });
    builder.addCase(updateCartItem.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error?.message ?? "Failed to update cart item";
    });

    // removeCartItem
    builder.addCase(removeCartItem.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(removeCartItem.fulfilled, (state, action) => {
      state.loading = false;
      const payload = action.payload ?? {};
      const data = payload.data ?? {};
      const products = data.products ?? [];
      state.items = products.map((p: any) => ({
        cartItemId: p._id,
        productId: p.product?._id ?? p.product,
        title: p.product?.title ?? undefined,
        imageCover: p.product?.imageCover ?? undefined,
        price: p.price ?? undefined,
        quantity: p.count ?? 1,
      }));
      state.numOfCartItems = Number(payload.numOfCartItems ?? data.numOfCartItems ?? state.numOfCartItems);
      state.totalCartPrice = Number((data.totalCartPrice ?? 0).toFixed(2));
    });
    builder.addCase(removeCartItem.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error?.message ?? "Failed to remove cart item";
    });
  },
});

export const { setCartCount, clearCartState, optimisticAdd } = cartSlice.actions;
export default cartSlice.reducer;


export const selectCartItems = (s: RootState) => s.cart.items;
export const selectCartCount = (s: RootState) => s.cart.numOfCartItems;
export const selectCartTotal = (s: RootState) => s.cart.totalCartPrice;
