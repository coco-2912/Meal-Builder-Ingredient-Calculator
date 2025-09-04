import { Dish, ConsolidatedIngredient } from '../types';

export function calculateIngredientsForPeople(dish: Dish, numberOfPeople: number) {
  return dish.ingredients.map(ingredient => ({
    ...ingredient,
    amount: (ingredient.amount * numberOfPeople) / dish.servings,
  }));
}

export function consolidateIngredients(
  selectedDishes: { dish: Dish; people: number }[]
): ConsolidatedIngredient[] {
  const consolidated: { [key: string]: ConsolidatedIngredient } = {};

  selectedDishes.forEach(({ dish, people }) => {
    const calculatedIngredients = calculateIngredientsForPeople(dish, people);
    
    calculatedIngredients.forEach(ingredient => {
      const key = `${ingredient.name}_${ingredient.unit}`;
      
      if (consolidated[key]) {
        consolidated[key].totalAmount += ingredient.amount;
        if (!consolidated[key].dishes.includes(dish.name)) {
          consolidated[key].dishes.push(dish.name);
        }
      } else {
        consolidated[key] = {
          name: ingredient.name,
          totalAmount: ingredient.amount,
          unit: ingredient.unit,
          dishes: [dish.name],
        };
      }
    });
  });

  return Object.values(consolidated).sort((a, b) => a.name.localeCompare(b.name));
}