import { Ingredient } from "./ingredient";

export interface Pizza {
  _id: string;
  name: string;
  description: string;
  img: string;
  ingredients: Ingredient[];
  lat?: number;
  long?: number;
}

export function ingredientToArrayIds(pizzas: any) {
  let ret = [];
  for (const index in pizzas.ingredients) {
    ret.push(pizzas.ingredients[index]._id);
  }
  return ret;
}
