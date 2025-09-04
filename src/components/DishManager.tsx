import React, { useState, useEffect } from 'react';
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
  const [importError, setImportError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    setSelectedMealType('all');
  }, []);

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

  const handleCsvImport = (file: File) => {
    setImportError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        if (typeof data !== 'string') throw new Error('Invalid file content');
        const lines = data.split(/\r\n|\n/);
        if (lines.length === 0) throw new Error('CSV file is empty');

        const headers = lines[0].split(',');
        const requiredHeaders = ['Name', 'Servings', 'Ingredients'];
        const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
        if (missingHeaders.length > 0) {
          throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
        }

        const newDishes: Omit<Dish, 'id'>[] = lines.slice(1).map((line, rowIndex) => {
          if (!line.trim()) return null; // skip empty lines
          const cols = line.split(',');

          const rowData = headers.reduce((obj, header, i) => {
            obj[header] = cols[i];
            return obj;
          }, {} as any);

          if (!rowData.Name || typeof rowData.Name !== 'string') {
            throw new Error(`Invalid or missing Name in row ${rowIndex + 2}`);
          }
          if (isNaN(parseInt(rowData.Servings)) || parseInt(rowData.Servings) <= 0) {
            throw new Error(`Invalid or missing Servings in row ${rowIndex + 2}`);
          }

          let ingredients;
          try {
            ingredients = rowData.Ingredients ? JSON.parse(rowData.Ingredients) : [];
            if (!Array.isArray(ingredients)) throw new Error('Ingredients must be an array');
            ingredients.forEach((ing: any, index: number) => {
              if (!ing.name || typeof ing.name !== 'string' || isNaN(ing.amount) || !ing.unit) {
                throw new Error(`Invalid ingredient format at index ${index} in row ${rowIndex + 2}`);
              }
            });
          } catch (err) {
            throw new Error(`Invalid Ingredients JSON in row ${rowIndex + 2}: ${(err as Error).message}`);
          }

          let instructions = [];
          if (rowData.Instructions) {
            try {
              instructions = JSON.parse(rowData.Instructions);
              if (!Array.isArray(instructions)) throw new Error('Instructions must be an array');
            } catch (err) {
              throw new Error(`Invalid Instructions JSON in row ${rowIndex + 2}: ${(err as Error).message}`);
            }
          }

          return {
            name: rowData.Name,
            servings: parseInt(rowData.Servings) || 1,
            totalWeight: rowData.TotalWeight || 'Unknown',
            mealType: rowData.MealType as 'breakfast' | 'lunch' | 'dinner' | 'snack' | undefined,
            ingredients,
            instructions,
          };
        }).filter(Boolean) as Omit<Dish, 'id'>[];

        newDishes.forEach(newDish => {
          const existingDish = dishes.find(d => d.name.toLowerCase() === newDish.name.toLowerCase());
          if (existingDish) {
            onUpdateDish(existingDish.id, newDish);
          } else {
            onAddDish(newDish);
          }
        });

        setImportError(null);
        console.log(`Successfully imported ${newDishes.length} dishes`);
      } catch (err) {
        const errorMessage = `Failed to import CSV file: ${(err as Error).message}`;
        setImportError(errorMessage);
        console.error(errorMessage);
      }
    };
    reader.onerror = () => {
      const errorMessage = 'Error reading file';
      setImportError(errorMessage);
      console.error(errorMessage);
    };
    reader.readAsText(file);
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
          <label className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg cursor-pointer">
            <input
              type="file"
              accept=".csv"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleCsvImport(file);
              }}
              className="hidden"
            />
            <span>Import CSV</span>
          </label>
        </div>
      </div>
      {importError && (
        <div className="text-red-600 text-center mb-4">{importError}</div>
      )}
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
              : 'Try adjusting your search terms or meal type filter.'
            }
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
