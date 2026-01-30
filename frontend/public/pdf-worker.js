/* eslint-disable no-undef */
importScripts('https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js');

self.onmessage = async (e) => {
  const { recipe } = e.data;
  
  try {
    const pdfDoc = await PDFLib.PDFDocument.create();
    const timesRomanFont = await pdfDoc.embedFont(PDFLib.StandardFonts.TimesRoman);
    const timesRomanBoldFont = await pdfDoc.embedFont(PDFLib.StandardFonts.TimesRomanBold);
    
    let page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    let y = height - 50;

    const drawText = (text, size = 12, font = timesRomanFont, indent = 0) => {
      if (y < 50) {
        page = pdfDoc.addPage();
        y = height - 50;
      }
      page.drawText(text, {
        x: 50 + indent,
        y: y,
        size: size,
        font: font,
        color: PDFLib.rgb(0, 0, 0),
      });
      y -= size + 10;
    };

    // Title
    drawText(recipe.title || 'Untitled Recipe', 24, timesRomanBoldFont);
    y -= 10;
    
    // Description
    if (recipe.description) {
      drawText(recipe.description, 12, timesRomanFont);
      y -= 10;
    }

    // Info
    drawText(`Cuisine: ${recipe.cuisine || 'N/A'} | Category: ${recipe.category || 'N/A'}`, 10, timesRomanFont);
    drawText(`Prep Time: ${recipe.prepTime || 0} mins | Cook Time: ${recipe.cookTime || 0} mins`, 10, timesRomanFont);
    drawText(`Servings: ${recipe.servings || 'N/A'}`, 10, timesRomanFont);
    y -= 20;

    // Ingredients
    drawText('Ingredients', 16, timesRomanBoldFont);
    (recipe.ingredients || []).forEach(ing => {
      drawText(`• ${ing.item || ing.name}: ${ing.amount || ing.quantity || ''}`, 11, timesRomanFont, 10);
    });
    y -= 20;

    // Instructions
    drawText('Instructions', 16, timesRomanBoldFont);
    (recipe.instructions || []).forEach((step, i) => {
      drawText(`${i + 1}. ${step.title || 'Step'}`, 12, timesRomanBoldFont, 10);
      drawText(step.instruction || '', 11, timesRomanFont, 20);
      y -= 5;
    });

    const pdfBytes = await pdfDoc.save();
    self.postMessage(pdfBytes);
  } catch (error) {
    console.error('PDF Worker Error:', error);
    self.postMessage({ error: error.message });
  }
};
