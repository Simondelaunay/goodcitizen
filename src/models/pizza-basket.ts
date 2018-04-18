import { Ingredient } from "./ingredient";

export interface PizzaBasket {
  _id: string;
  name: string;
  description: string;
  price: number;
  nb: number;
  img: string;
  ingredients: Ingredient[];
}

