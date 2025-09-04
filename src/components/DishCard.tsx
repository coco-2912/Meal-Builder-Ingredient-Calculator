import React from 'react';
import { Dish } from '../types';
import { Clock, Users, Scale } from 'lucide-react';

interface DishCardProps {
  dish: Dish;
  onEdit: (dish: Dish) => void;
  onDelete: (id: string) => void;
}

const mealTypeColors = {
  breakfast: 'bg-orange-100 text-orange-800 border-orange-200',
  lunch: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  dinner: 'bg-purple-100 text-purple-800 border-purple-200',
  snack: 'bg-blue-100 text-blue-800 border-blue-200',
};

export default function DishCard({ dish, onEdit, onDelete }: DishCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{dish.name}</h3>
            {dish.mealType && (
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${mealTypeColors[dish.mealType]}`}>
                {dish.mealType.charAt(0).toUpperCase() + dish.mealType.slice(1)}
              </span>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(dish)}
              className="text-indigo-600 hover:text-indigo-800 font-medium text-sm hover:bg-indigo-50 px-3 py-1 rounded-lg transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(dish.id)}
              className="text-red-600 hover:text-red-800 font-medium text-sm hover:bg-red-50 px-3 py-1 rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-6 mb-4 text-gray-600">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span className="text-sm">Serves {dish.servings}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Scale className="h-4 w-4" />
            <span className="text-sm">{dish.totalWeight}</span>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="font-semibold text-gray-900 mb-2">Ingredients:</h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {dish.ingredients.slice(0, 5).map((ingredient, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-700">{ingredient.name}</span>
                <span className="text-gray-500 font-medium">
                  {ingredient.amount}{ingredient.unit}
                </span>
              </div>
            ))}
            {dish.ingredients.length > 5 && (
              <div className="text-sm text-gray-500 italic">
                +{dish.ingredients.length - 5} more ingredients...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}