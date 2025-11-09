// api/farmhubapi.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

const API_BASE_URL = "https://farmhub-backend-26rg.onrender.com/api";

const API: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach token
API.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

// -------- TYPE DEFINITIONS ----------
export interface User {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: "farmer" | "buyer";
  phoneNumber?: string;
  farmName?: string;
  country?: string;
  state?: string;
  address?: string;
  photoID?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface Product {
  _id?: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  description: string;
  image?: string;
  farmerId?: string;
  farmer?: User;
  createdAt?: string;
  updatedAt?: string;
}

export interface Comment {
  _id?: string;
  productId: string;
  userId: string;
  userName?: string;
  text: string;
  createdAt?: string;
}

// -------- USER AUTH ROUTES ----------
export const registerUser = async (data: Partial<User>) => {
  try {
    const response = await API.post<LoginResponse>("/users/register", data);
    return response;
  } catch (error: any) {
    throw error;
  }
};

export const loginUser = async (data: { email: string; password: string }) => {
  try {
    const response = await API.post<LoginResponse>("/users/login", data);
    return response;
  } catch (error: any) {
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await API.get<User>("/users/me");
    return response;
  } catch (error: any) {
    throw error;
  }
};

// -------- PRODUCT ROUTES ----------
export const getAllProducts = async () => {
  try {
    const response = await API.get<Product[]>("/products");
    return response;
  } catch (error: any) {
    throw error;
  }
};

export const createProduct = async (data: FormData) => {
  try {
    const response = await API.post<Product>("/products", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error: any) {
    throw error;
  }
};

export const getProductById = async (id: string) => {
  try {
    const response = await API.get<Product>(`/products/${id}`);
    return response;
  } catch (error: any) {
    throw error;
  }
};

export const updateProduct = async (id: string, data: Partial<Product>) => {
  try {
    const response = await API.put<Product>(`/products/${id}`, data);
    return response;
  } catch (error: any) {
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const response = await API.delete(`/products/${id}`);
    return response;
  } catch (error: any) {
    throw error;
  }
};

// -------- COMMENT ROUTES ----------
export const getComments = async (productId: string) => {
  try {
    const response = await API.get<Comment[]>(`/products/${productId}/comments`);
    return response;
  } catch (error: any) {
    throw error;
  }
};

export const addComment = async (productId: string, text: string) => {
  try {
    const response = await API.post<Comment>(`/products/${productId}/comments`, { text });
    return response;
  } catch (error: any) {
    throw error;
  }
};

export default API;