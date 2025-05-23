import { Scissors, Brush, SprayCan } from "lucide-react";

export const mockServices = [
  {
    id: 1,
    name: "Haircut",
    description: "Classic and modern cuts tailored to your style.",
    price: 25,
    duration: 30,
    image: "/images/haircut.jpg",
    icon: <Scissors className="w-8 h-8 mx-auto" />,
  },
  {
    id: 2,
    name: "Beard Trim",
    description: "Clean and sharp beard styling.",
    price: 15,
    duration: 20,
    image: "/images/beard_trim.jpg",
    icon: <Brush className="w-8 h-8 mx-auto" />,
  },
  {
    id: 3,
    name: "Hair Styling",
    description: "Finishing touches with premium products.",
    price: 20,
    duration: 25,
    image: "/images/hair_styling.jpg",
    icon: <SprayCan className="w-8 h-8 mx-auto" />,
  },
];
