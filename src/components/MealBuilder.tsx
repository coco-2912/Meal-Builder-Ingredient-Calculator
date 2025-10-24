import React, { useState } from 'react';
import { Dish } from '../types';
import { Users, Plus, Minus, Calculator, Search, Download } from 'lucide-react';
import { calculateIngredientsForPeople } from '../utils/calculations';
import { generatePDF } from '../utils/pdfGenerator';

interface SelectedDish {
  dish: Dish;
  people: number;
}

interface MealBuilderProps {
  dishes: Dish[];
}

export default function MealBuilder({ dishes }: MealBuilderProps) {
  const [selectedDishes, setSelectedDishes] = useState<SelectedDish[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const addDish = (dish: Dish) => {
    if (!selectedDishes.some(sd => sd.dish.id === dish.id)) {
      setSelectedDishes([...selectedDishes, { dish, people: 1 }]);
    }
  };

  const removeDish = (dishId: string) => {
    setSelectedDishes(selectedDishes.filter(sd => sd.dish.id !== dishId));
  };

  const updatePeopleCount = (dishId: string, people: number) => {
    setSelectedDishes(selectedDishes.map(sd =>
      sd.dish.id === dishId ? { ...sd, people: Math.max(1, people) } : sd
    ));
  };

  const filterDishes = (mealType: string | null) => {
    return dishes.filter(d =>
      (mealType === null ? !d.mealType : d.mealType === mealType) &&
      (d.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    );
  };

  const breakfastDishes = filterDishes('breakfast');
  const lunchDishes = filterDishes('lunch');
  const dinnerDishes = filterDishes('dinner');
  const snackDishes = filterDishes('snack');
  const otherDishes = filterDishes(null);

  const DishGroup = ({ title, dishes: groupDishes, color }: { title: string; dishes: Dish[]; color: string }) => {
    if (groupDishes.length === 0) return null;

    return (
      <div className="mb-6">
        <h4 className={`font-semibold text-lg mb-3 ${color}`}>{title}</h4>
        <div className="grid gap-3">
          {groupDishes.map(dish => (
            <div key={dish.id} className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div>
                <h5 className="font-medium text-gray-900">{dish.name || 'Unnamed Dish'}</h5>
                <p className="text-sm text-gray-500">Serves {dish.servings || 1} • {dish.totalWeight || 'Unknown'}</p>
              </div>
              <button
                onClick={() => addDish(dish)}
                disabled={selectedDishes.some(sd => sd.dish.id === dish.id)}
                className="flex items-center space-x-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="h-4 w-4" />
                <span>Add</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleExportPDF = () => {
    generatePDF(selectedDishes, `meal_plan_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Build Your Meal
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Select dishes and adjust servings to generate a complete shopping list.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Available Dishes */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Calculator className="h-6 w-6 mr-2 text-indigo-600" />
            Available Dishes
          </h3>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="space-y-6 max-h-96 overflow-y-auto">
            <DishGroup title="Breakfast" dishes={breakfastDishes} color="text-orange-600" />
            <DishGroup title="Lunch" dishes={lunchDishes} color="text-emerald-600" />
            <DishGroup title="Dinner" dishes={dinnerDishes} color="text-purple-600" />
            <DishGroup title="Snacks" dishes={snackDishes} color="text-blue-600" />
            <DishGroup title="Other" dishes={otherDishes} color="text-gray-600" />
          </div>
        </div>

        {/* Selected Dishes */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <Users className="h-6 w-6 mr-2 text-indigo-600" />
                Selected Dishes ({selectedDishes.length})
              </h3>
              {selectedDishes.length > 0 && (
                <button
                  onClick={handleExportPDF}
                  className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all font-medium"
                >
                  <Download className="h-5 w-5" />
                  <span>Export PDF</span>
                </button>
              )}
            </div>

            {selectedDishes.length === 0 ? (
              <div className="text-center py-12">
                <Calculator className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No dishes selected. Add from the left panel!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedDishes.map(({ dish, people }) => (
                  <div key={dish.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{dish.name || 'Unnamed Dish'}</h4>
                        <p className="text-sm text-gray-500">Serves {dish.servings || 1}</p>
                      </div>
                      <button
                        onClick={() => removeDish(dish.id)}
                        className="text-red-600 hover:text-red-800 text-sm hover:bg-red-50 px-3 py-1 rounded-lg"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <span className="font-medium text-gray-700">People:</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updatePeopleCount(dish.id, people - 1)}
                          disabled={people <= 1}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <input
                          type="number"
                          value={people}
                          onChange={(e) => updatePeopleCount(dish.id, Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-16 text-center font-bold border rounded-md px-2 py-1"
                          min="1"
                        />
                        <button
                          onClick={() => updatePeopleCount(dish.id, people + 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <select
                          onChange={(e) => updatePeopleCount(dish.id, parseInt(e.target.value))}
                          className="px-2 py-1 border rounded-md text-sm"
                        >
                          <option value="">Bulk</option>
                          <option value="10">10</option>
                          <option value="25">25</option>
                          <option value="50">50</option>
                          <option value="75">75</option>
                          <option value="100">100</option>
                        </select>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-3 border">
                      <h5 className="font-medium text-gray-800 mb-2">Ingredients:</h5>
                      <div className="space-y-1 text-sm">
                        {calculateIngredientsForPeople(dish, people).map((ing, i) => (
                          <div key={i} className="flex justify-between">
                            <span>{ing.name}</span>
                            <span className="font-medium">{ing.amount.toFixed(1)} {ing.unit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}