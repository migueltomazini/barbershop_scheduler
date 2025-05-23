import { ReactNode } from "react";

export type ServiceType = {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  icon?: ReactNode;
};

export type ProductType = {
  id: number;
  name: string;
  price: number;
  image: string;
};
