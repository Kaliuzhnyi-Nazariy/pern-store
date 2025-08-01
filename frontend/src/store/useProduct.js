import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

const BASE_URL = "http://localhost:3000/api/products";

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,
  currentProduct: null,

  //form state
  formData: {
    name: "",
    price: "",
    image: "",
  },

  setFormData: (formData) => set({ formData }),
  resetFrom: () =>
    set({
      formData: {
        name: "",
        price: "",
        image: "",
      },
    }),

  addProduct: async (e) => {
    e.preventDefault();
    set({ loading: true });

    try {
      const { formData } = get();
      await axios.post(`${BASE_URL}`, formData);
      await get().fetchProducts();
      get().resetFrom();
      toast.success("Product added successfully");
      document.getElementById("add_product_modal").close();
    } catch (error) {
      console.log("ERror during adding product: ", error);
      toast.error("Something went wrong");
    } finally {
      set({ loading: false });
    }
  },

  fetchProducts: async () => {
    set({ loading: true });
    set({ error: null });
    try {
      const res = await axios.get(`${BASE_URL}`);
      set({ products: res.data.data, error: null });
    } catch (err) {
      if (err.status == 429)
        set({ error: "Rate limit exceeded", products: [] });
      else {
        set({ error: "Something went wrong", products: [] });
      }
    } finally {
      set({ loading: false });
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true });
    set({ error: null });
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      set((prev) => ({
        products: prev.products.filter((product) => product.id !== id),
      }));
      toast.success("Product successfully deleted!");
    } catch (error) {
      console.log("Error during delting: ", error);
      toast.error("Something went wrong!");
    } finally {
      set({ loading: false });
    }
  },

  fetchProduct: async (id) => {
    set({ loading: true });
    try {
      const res = await axios.get(`${BASE_URL}/${id}`);
      set({
        currentProduct: res.data.data,
        formData: res.data.data,
        error: null,
      });
    } catch (error) {
      console.log("Error in getch product: ", error);
      set({ error: "Something went wrong", currentProduct: null });
    } finally {
      set({ loading: false });
    }
  },

  updateProduct: async (id) => {
    set({ loading: true });
    try {
      const { formData } = get();
      const res = await axios.put(`${BASE_URL}/${id}`, formData);
      set({
        currentProduct: res.data.data,
        error: null,
      });
      toast.success("Product updated successfully");
    } catch (error) {
      console.log("Error in upd product: ", error);
      toast.error("Something went wrong");
    } finally {
      set({ loading: false });
    }
  },
}));
