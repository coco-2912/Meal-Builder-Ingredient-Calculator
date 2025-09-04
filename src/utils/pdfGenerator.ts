import { jsPDF } from 'jspdf';
import { SelectedDish } from '../types';
import { calculateIngredientsForPeople } from '../utils/calculations';

export const generatePDF = (selectedDishes: SelectedDish[], filename: string) => {
  const doc = new jsPDF();
  let yOffset = 20;

  // Title
  doc.setFontSize(18);
  doc.text('Meal Plan Ingredients', 20, yOffset);
  yOffset += 10;

  // Summary
  doc.setFontSize(12);
  doc.text(`Total dishes: ${selectedDishes.length}`, 20, yOffset);
  yOffset += 5;
  doc.text(`Total people: ${selectedDishes.reduce((sum, sd) => sum + sd.people, 0)}`, 20, yOffset);
  yOffset += 10;

  // Iterate through each dish
  selectedDishes.forEach(({ dish, people }) => {
    // Dish header
    doc.setFontSize(14);
    doc.text(`${dish.name} (for ${people} people)`, 20, yOffset);
    yOffset += 10;

    // Ingredients table
    const ingredients = calculateIngredientsForPeople(dish, people);
    const tableData = ingredients.map(ing => [
      ing.name,
      `${ing.amount.toFixed(1)}${ing.unit}`
    ]);

    // Simple table rendering
    doc.setFontSize(10);
    doc.setLineWidth(0.5);
    const tableX = 20;
    const tableWidth = 170;
    const rowHeight = 8;
    const colWidths = [100, 70];

    // Draw table header
    doc.setFillColor(200, 200, 200);
    doc.rect(tableX, yOffset, tableWidth, rowHeight, 'F');
    doc.text('Ingredient', tableX + 2, yOffset + 6);
    doc.text('Amount', tableX + colWidths[0] + 2, yOffset + 6);
    yOffset += rowHeight;

    // Draw table rows
    tableData.forEach(row => {
      doc.rect(tableX, yOffset, colWidths[0], rowHeight);
      doc.rect(tableX + colWidths[0], yOffset, colWidths[1], rowHeight);
      doc.text(row[0], tableX + 2, yOffset + 6);
      doc.text(row[1], tableX + colWidths[0] + 2, yOffset + 6);
      yOffset += rowHeight;
    });

    // Draw table border
    doc.rect(tableX, yOffset - rowHeight * (tableData.length + 1), tableWidth, rowHeight * (tableData.length + 1));

    yOffset += 10; // Space before next dish
    if (yOffset > 270) { // Add new page if needed
      doc.addPage();
      yOffset = 20;
    }
  });

  doc.save(filename);
};