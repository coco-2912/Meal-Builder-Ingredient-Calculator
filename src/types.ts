export interface Dish {
  id: string;
  name: string;
  mealType: string;
  servings: number;
  totalWeight: string;
  ingredients: { name: string; amount: number; unit: string }[];
  instructions: string[];
  createdAt: number;
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}