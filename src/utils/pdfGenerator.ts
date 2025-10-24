import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SelectedDish } from '../components/MealBuilder';
import { calculateIngredientsForPeople } from './calculations';

export const generatePDF = (selectedDishes: SelectedDish[], filename: string = 'meal_plan.pdf') => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Meal Plan & Shopping List', 105, 20, { align: 'center' });

  // Generated date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`, 105, 28, { align: 'center' });

  let startY = 40;

  // Loop through each selected dish
  selectedDishes.forEach(({ dish, people }, index) => {
    const calculatedIngredients = calculateIngredientsForPeople(dish, people);

    // Dish Title
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`${dish.name || 'Unnamed Dish'}`, 14, startY);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'italic');
    doc.text(`(for ${people} people)`, 14, startY + 6);

    // Dish metadata
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Original: Serves ${dish.servings || 1} • Total Weight: ${dish.totalWeight || 'N/A'}`,
      14,
      startY + 12
    );

    // Ingredients Table
    const tableData = calculatedIngredients.map(ing => [
      ing.name || 'Unknown',
      `${ing.amount.toFixed(2)} ${ing.unit || ''}`.trim(),
    ]);

    autoTable(doc, {
      head: [['Ingredient', 'Amount']],
      body: tableData,
      startY: startY + 18,
      theme: 'striped',
      styles: { fontSize: 9, cellPadding: 2.5 },
      headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
      pageBreak: 'auto',
      rowPageBreak: 'avoid',
    });

    // Update startY after table
    startY = (doc as any).lastAutoTable.finalY + 15;

    // Add new page if needed
    if (index < selectedDishes.length - 1 && startY > 250) {
      doc.addPage();
      startY = 20;
    }
  });

  // === Consolidated Shopping List ===
  const allIngredients: Record<string, { name: string; amount: number; unit: string }> = {};

  selectedDishes.forEach(({ dish, people }) => {
    calculateIngredientsForPeople(dish, people).forEach(ing => {
      const key = `${ing.name}-${ing.unit}`;
      if (!allIngredients[key]) {
        allIngredients[key] = { name: ing.name, amount: 0, unit: ing.unit };
      }
      allIngredients[key].amount += ing.amount;
    });
  });

  const consolidated = Object.values(allIngredients).map(item => [
    item.name,
    `${item.amount.toFixed(2)} ${item.unit}`.trim(),
  ]);

  if (consolidated.length > 0) {
    if (startY > 220) {
      doc.addPage();
      startY = 20;
    }

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Consolidated Shopping List', 14, startY);
    startY += 10;

    autoTable(doc, {
      head: [['Item', 'Total Amount']],
      body: consolidated,
      startY,
      theme: 'grid',
      headStyles: { fillColor: [34, 197, 94], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 10, cellPadding: 3 },
      margin: { left: 14, right: 14 },
    });
  }

  // Save PDF
  doc.save(filename);
};