// src/components/DishManager.tsx
import React, { useState } from 'react';
import { Dish } from '../types';
import DishCard from './DishCard';
import DishForm from './DishForm';
import { Plus, Search } from 'lucide-react';

interface DishManagerProps {
  dishes: Dish[];
  onAddDish: (dish: Omit<Dish, 'id'>) => void;
  onUpdateDish: (id: string, dish: Omit<Dish, 'id'>) => void;
  onDeleteDish: (id: string) => void;
}

export default function DishManager({ dishes, onAddDish, onUpdateDish, onDeleteDish }: DishManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMealType, setSelectedMealType] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSaveDish = (dishData: Omit<Dish, 'id'>) => {
    if (editingDish) {
      onUpdateDish(editingDish.id, dishData);
    } else {
      onAddDish(dishData);
    }
    setShowForm(false);
    setEditingDish(undefined);
  };

  const handleEditDish = (dish: Dish) => {
    setEditingDish(dish);
    setShowForm(true);
  };

  const handleDeleteDish = (id: string) => {
    if (window.confirm('Are you sure you want to delete this dish?')) {
      onDeleteDish(id);
    }
  };

  const filteredDishes = dishes.filter(dish => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      (dish.name && typeof dish.name === 'string' ? dish.name.toLowerCase().includes(searchLower) : false) ||
      (Array.isArray(dish.ingredients) ? dish.ingredients.some(ing =>
        ing.name && typeof ing.name === 'string' ? ing.name.toLowerCase().includes(searchLower) : false
      ) : false);
    const matchesMealType = selectedMealType === 'all' || dish.mealType === selectedMealType;
    return matchesSearch && matchesMealType;
  });

  // Sort by insertion order: ascending is original order, descending reverses array to show newest first
  const sortedDishes = [...filteredDishes];
  if (sortOrder === 'desc') {
    sortedDishes.reverse();
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Manage Your Dishes
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Create, edit, and organize your recipe collection with precise ingredient measurements.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
        <div className="flex flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search dishes or ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={selectedMealType}
            onChange={(e) => setSelectedMealType(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Meals</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snacks</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="asc">Added: Oldest First</option>
            <option value="desc">Added: Newest First</option>
          </select>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium"
          >
            <Plus className="h-5 w-5" />
            <span>Add Dish</span>
          </button>
        </div>
      </div>

      {sortedDishes.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <Plus className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {dishes.length === 0 ? 'No dishes yet' : 'No dishes match your search'}
          </h3>
          <p className="text-gray-600 mb-6">
            {dishes.length === 0
              ? 'Get started by adding your first dish with all the ingredients and measurements.'
              : 'Try adjusting your search terms or meal type filter.'}
          </p>
          {dishes.length === 0 && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium"
            >
              Add Your First Dish
            </button>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedDishes.map(dish => (
            <DishCard
              key={dish.id}
              dish={dish}
              onEdit={handleEditDish}
              onDelete={handleDeleteDish}
            />
          ))}
        </div>
      )}

      {showForm && (
        <DishForm
          dish={editingDish}
          onSave={handleSaveDish}
          onCancel={() => {
            setShowForm(false);
            setEditingDish(undefined);
          }}
        />
      )}
    </div>
  );
}