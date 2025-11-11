// src/api/farmhubAPI.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { Comment, LoginResponse, Product, User } from "./types";

const API: AxiosInstance = axios.create({
  baseURL: "https://farmhub-backend-26rg.onrender.com/api",
});

// Automatically attach token to protected routes
API.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await AsyncStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------- AUTH ROUTES ----------
export const registerUser = (data: Partial<User>) =>
  API.post<LoginResponse>("/auth/register", data);

export const loginUser = (data: Pick<User, "email" | "password">) =>
  API.post<LoginResponse>("/auth/login", data);

// ---------- USERS ----------
export const getAllUsers = () => API.get<User[]>("/users");

// ---------- FARMERS ----------
export const registerFarmer = (data: Partial<User>) =>
  API.post<User>("/farmers/register", data);

export const getAllFarmers = () => API.get<User[]>("/farmers");

// ---------- PRODUCTS ----------
export const getAllProducts = () => API.get<Product[]>("/products");
export const createProduct = (data: Product) => API.post<Product>("/products", data);
export const updateProduct = (id: string, data: Product) => API.put<Product>(`/products/${id}`, data);
export const deleteProduct = (id: string) => API.delete(`/products/${id}`);
export const getProductById = (id: string) => API.get<Product>(`/products/${id}`);

// ---------- COMMENTS ----------
export const getComments = (productId: string) =>
  API.get<Comment[]>(`/products/${productId}/comments`);

export const addComment = (productId: string, data: { content: string }) =>
  API.post<Comment>(`/products/${productId}/comments`, data);



export default API;
