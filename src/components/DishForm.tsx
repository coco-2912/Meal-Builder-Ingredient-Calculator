import React, { useState, useEffect } from 'react';
import { Dish, Ingredient } from '../types';
import { Plus, Trash2, Save, X } from 'lucide-react';

interface DishFormProps {
  dish?: Dish;
  onSave: (dish: Omit<Dish, 'id'>) => void;
  onCancel: () => void;
}

export default function DishForm({ dish, onSave, onCancel }: DishFormProps) {
  const [name, setName] = useState(dish?.name || '');
  const [servings, setServings] = useState(dish?.servings || 1);
  const [totalWeight, setTotalWeight] = useState(dish?.totalWeight || '');
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>(
    dish?.mealType || 'breakfast'
  );
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    dish?.ingredients || [{ name: '', amount: 0, unit: 'g' }]
  );
  const [instructions, setInstructions] = useState<string[]>(
    dish?.instructions || ['']
  );

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: 0, unit: 'g' }]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: any) => {
    const updated = ingredients.map((ingredient, i) =>
      i === index ? { ...ingredient, [field]: value } : ingredient
    );
    setIngredients(updated);
  };

  const addInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const removeInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const updateInstruction = (index: number, value: string) => {
    const updated = instructions.map((instruction, i) =>
      i === index ? value : instruction
    );
    setInstructions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validIngredients = ingredients.filter(
      (ingredient) => ingredient.name.trim() && ingredient.amount > 0
    );
    
    const validInstructions = instructions.filter((instruction) => instruction.trim());

    onSave({
      name,
      servings,
      totalWeight,
      mealType,
      ingredients: validIngredients,
      instructions: validInstructions.length > 0 ? validInstructions : undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {dish ? 'Edit Dish' : 'Add New Dish'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Dish Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter dish name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Meal Type
              </label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value as any)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Servings *
              </label>
              <input
                type="number"
                value={servings}
                onChange={(e) => setServings(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Total Weight
              </label>
              <input
                type="text"
                value={totalWeight}
                onChange={(e) => setTotalWeight(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., 250g"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-semibold text-gray-700">
                Ingredients *
              </label>
              <button
                type="button"
                onClick={addIngredient}
                className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 font-medium hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Ingredient</span>
              </button>
            </div>

            <div className="space-y-3">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex space-x-3 items-end">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={ingredient.name}
                      onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Ingredient name"
                      required
                    />
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      value={ingredient.amount}
                      onChange={(e) => updateIngredient(index, 'amount', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Amount"
                      min="0"
                      step="0.1"
                      required
                    />
                  </div>
                  <div className="w-20">
                    <select
                      value={ingredient.unit}
                      onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="g">g</option>
                      <option value="kg">kg</option>
                      <option value="ml">ml</option>
                      <option value="L">L</option>
                      <option value="tsp">tsp</option>
                      <option value="tbsp">tbsp</option>
                      <option value="cup">cup</option>
                      <option value="piece">piece</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                    disabled={ingredients.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-semibold text-gray-700">
                Instructions (Optional)
              </label>
              <button
                type="button"
                onClick={addInstruction}
                className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 font-medium hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Step</span>
              </button>
            </div>

            <div className="space-y-3">
              {instructions.map((instruction, index) => (
                <div key={index} className="flex space-x-3">
                  <div className="flex-1">
                    <textarea
                      value={instruction}
                      onChange={(e) => updateInstruction(index, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder={`Step ${index + 1}...`}
                      rows={2}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeInstruction(index)}
                    className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors self-start mt-1"
                    disabled={instructions.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{dish ? 'Update Dish' : 'Save Dish'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}