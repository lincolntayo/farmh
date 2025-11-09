// src/api/farmhubAPI.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { Comment, LoginResponse, Product, User, UserResponse } from "./types";
import { getUserFromToken } from "./utils";

const API: AxiosInstance = axios.create({
  baseURL: "https://farmhub-backend-26rg.onrender.com/api",
});

// ✅ Automatically attach token to requests
API.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await AsyncStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// -------- USER AUTH ROUTES ----------
export const registerUser = (data: Partial<User>) =>
  API.post<any>("/users/register", data);

export const loginUser = (data: Pick<User, "email" | "password">) =>
  API.post<any>("/users/login", data);

export const getAllUsers = () => API.get<UserResponse[]>("/users");

// Get current user info (try to fetch, fallback to token decode)
export const getCurrentUser = async (): Promise<UserResponse | null> => {
  try {
    const response = await API.get<UserResponse>("/users/me");
    return response.data;
  } catch (error) {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      const userInfo = getUserFromToken(token);
      return {
        _id: userInfo.id || "",
        email: userInfo.email || "",
        name: "",
        role: "buyer" as const,
      };
    }
    return null;
  }
};

// -------- FARMER ROUTES ----------
export const registerFarmer = (data: Partial<User>) =>
  API.post<any>("/farmers/register", data);

export const getAllFarmers = () => API.get<UserResponse[]>("/farmers");

// -------- PRODUCT ROUTES ----------
export const getAllProducts = () => API.get<Product[]>("/products");

export const createProduct = (data: Product) =>
  API.post<Product>("/products", data);

export const getProductById = (id: string) =>
  API.get<Product>(`/products/${id}`);

// ✅ FIXED getSavedAds
export const getSavedAds = async (userId: string) => {
  const response = await API.get(`/saved-ads/${userId}`);
  return response.data;
};

// -------- COMMENT ROUTES ----------
export const getComments = (productId: string) =>
  API.get<Comment[]>(`/products/${productId}/comments`);

export const addComment = (productId: string, data: Comment) =>
  API.post<Comment>(`/products/${productId}/comments`, data);

export default API;
