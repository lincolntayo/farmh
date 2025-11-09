// src/api/types.ts

export interface User {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role?: "farmer" | "buyer" | "admin";
}

export interface Product {
  _id?: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  description: string;
  createdAt?: string;
}

export interface Comment {
  _id?: string;
  productId: string;
  text: string;
  createdAt?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
