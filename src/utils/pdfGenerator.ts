
import jsPDF from 'jspdf';

export interface ReceiptItem {
  description: string;
  quantity: string;
  price: number;
}

export interface ReceiptData {
  id: string;
  date: string;
  time: string;
  status: string;
  items: ReceiptItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  deliveryAddress: string;
  vehicle: string;
}

export const generateReceiptPDF = (receipt: ReceiptData): jsPDF => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  
  // Add company logo/name
  pdf.setFontSize(20);
  pdf.setTextColor(0, 35, 75); // Navy blue
  pdf.text("FuelNinja", pageWidth / 2, 20, { align: "center" });
  
  // Receipt details
  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Receipt: ${receipt.id}`, 20, 35);
  pdf.text(`Date: ${receipt.date} at ${receipt.time}`, 20, 45);
  pdf.text(`Status: ${receipt.status}`, 20, 55);
  
  // Draw a line
  pdf.setDrawColor(0, 35, 75); // Navy blue
  pdf.line(20, 60, pageWidth - 20, 60);
  
  // Items header
  pdf.setFontSize(10);
  pdf.text("Description", 20, 70);
  pdf.text("Quantity", 120, 70);
  pdf.text("Price", 170, 70);
  
  // Items
  let yPos = 80;
  receipt.items.forEach(item => {
    pdf.text(item.description, 20, yPos);
    pdf.text(item.quantity, 120, yPos);
    pdf.text(`$${item.price.toFixed(2)}`, 170, yPos);
    yPos += 10;
  });
  
  // Draw a line
  pdf.line(20, yPos, pageWidth - 20, yPos);
  yPos += 10;
  
  // Totals
  pdf.text(`Subtotal:`, 120, yPos);
  pdf.text(`$${receipt.subtotal.toFixed(2)}`, 170, yPos);
  yPos += 10;
  
  pdf.text(`Tax:`, 120, yPos);
  pdf.text(`$${receipt.tax.toFixed(2)}`, 170, yPos);
  yPos += 10;
  
  pdf.setFontSize(12);
  pdf.text(`Total:`, 120, yPos);
  pdf.text(`$${receipt.total.toFixed(2)}`, 170, yPos);
  yPos += 20;
  
  // Payment and delivery info
  pdf.setFontSize(10);
  pdf.text(`Payment Method: ${receipt.paymentMethod}`, 20, yPos);
  yPos += 10;
  
  pdf.text(`Delivery Address: ${receipt.deliveryAddress}`, 20, yPos);
  yPos += 10;
  
  pdf.text(`Vehicle: ${receipt.vehicle}`, 20, yPos);
  yPos += 20;
  
  // Thank you message
  pdf.setTextColor(90, 90, 90);
  pdf.text("Thank you for choosing FuelNinja!", pageWidth / 2, yPos, { align: "center" });
  
  return pdf;
};
