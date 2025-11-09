// src/api/farmhubAPI.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { Comment, LoginResponse, Product, User } from "./types";

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
  API.post<LoginResponse>("/users/register", data);

export const loginUser = (data: Pick<User, "email" | "password">) =>
  API.post<LoginResponse>("/users/login", data);

export const getAllUsers = () => API.get<User[]>("/users");

// -------- FARMER ROUTES ----------
export const registerFarmer = (data: Partial<User>) =>
  API.post<User>("/farmers/register", data);

export const getAllFarmers = () => API.get<User[]>("/farmers");

// -------- PRODUCT ROUTES ----------
export const getAllProducts = () => API.get<Product[]>("/products");

export const createProduct = (data: Product) =>
  API.post<Product>("/products", data);

export const getProductById = (id: string) =>
  API.get<Product>(`/products/${id}`);

// -------- COMMENT ROUTES ----------
export const getComments = (productId: string) =>
  API.get<Comment[]>(`/products/${productId}/comments`);

export const addComment = (productId: string, data: Comment) =>
  API.post<Comment>(`/products/${productId}/comments`, data);

export default API;