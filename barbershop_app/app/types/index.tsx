import { ReactNode } from "react";

export type ServiceType = {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  icon?: string;
};

export type ProductType = {
  id: number;
  name: string;
  description: string,
  price: number;
  quantity: number;
  image: string;
};
