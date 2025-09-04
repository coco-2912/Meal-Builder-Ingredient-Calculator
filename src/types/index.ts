export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

export interface Dish {
  id: string;
  name: string;
  servings: number;
  totalWeight: string;
  ingredients: Ingredient[];
  instructions?: string[];
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface MealPlan {
  id: string;
  name: string;
  dishes: {
    dishId: string;
    servings: number;
  }[];
  totalPeople: number;
  mealType: 'breakfast' | 'lunch' | 'dinner';
}

export interface ConsolidatedIngredient {
  name: string;
  totalAmount: number;
  unit: string;
  dishes: string[];
}