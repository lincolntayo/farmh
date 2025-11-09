// src/api/types.ts

// Separate types for requests and responses
export interface UserResponse {
  _id: string;
  name: string;
  email: string;
  role: "farmer" | "buyer" | "admin";
}

export interface UserCreateRequest {
  name: string;
  email: string;
  password: string;
  role?: "farmer" | "buyer" | "admin";
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

// User type for registration (includes all fields)
export interface User {
  name: string;
  email: string;
  password: string;
  role?: "farmer" | "buyer" | "admin";
  phoneNumber?: string;
  farmName?: string;
  country?: string;
  state?: string;
  address?: string;
  photoID?: string;
}

export interface Product {
  _id?: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  description: string;
  farmerId: string; // Added: track who created the product
  createdAt?: string;
  updatedAt?: string; // Added: track updates
}

export interface Comment {
  _id?: string;
  productId: string;
  userId: string; // Added: track who created the comment
  userName?: string; // Optional: for display purposes
  text: string;
  createdAt?: string;
}

export interface LoginResponse {
  token: string;
  user: UserResponse; // Use response type without password
}