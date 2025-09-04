import React, { useState, useEffect } from 'react';
import { Dish } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { sampleDishes } from './data/sampleDishes';
import DishManager from './components/DishManager';
import MealBuilder from './components/MealBuilder';
import { ChefHat, Calculator, Settings } from 'lucide-react';

type ActiveTab = 'dishes' | 'meals';

function App() {
  const [dishes, setDishes] = useLocalStorage<Dish[]>('meal-builder-dishes', sampleDishes);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dishes');

  // Removed the resetting useEffect to allow persistent changes even if length changes

  const handleAddDish = (dishData: Omit<Dish, 'id'>) => {
    const newDish: Dish = { ...dishData, id: Date.now().toString() };
    setDishes([...dishes, newDish]);
  };

  const handleUpdateDish = (id: string, dishData: Omit<Dish, 'id'>) => {
    console.log('Updating dish:', id, dishData);
    setDishes(dishes.map(dish => dish.id === id ? { ...dishData, id } : dish));
  };

  const handleDeleteDish = (id: string) => {
    setDishes(dishes.filter(dish => dish.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-emerald-50">
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-orange-500 to-emerald-500 p-2 rounded-lg">
                <ChefHat className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-emerald-600 bg-clip-text text-transparent">
                  Meal Builder
                </h1>
                <p className="text-gray-600 text-sm">Plan meals & calculate ingredients</p>
              </div>
            </div>
            <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('dishes')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                  activeTab === 'dishes'
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Settings className="h-4 w-4" />
                <span>Manage Dishes</span>
              </button>
              <button
                onClick={() => setActiveTab('meals')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                  activeTab === 'meals'
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Calculator className="h-4 w-4" />
                <span>Build Meals</span>
              </button>
            </nav>
          </div>
        </div>
      </header>
      <main className="pb-8">
        {activeTab === 'dishes' ? (
          <DishManager
            dishes={dishes}
            onAddDish={handleAddDish}
            onUpdateDish={handleUpdateDish}
            onDeleteDish={handleDeleteDish}
          />
        ) : (
          <MealBuilder dishes={dishes} />
        )}
      </main>
      <footer className="bg-white border-t border-gray-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-600">
            Built with ❤️ for home cooks who love precision in their meal planning
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;