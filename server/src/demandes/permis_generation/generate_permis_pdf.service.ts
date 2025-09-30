// pdf-generator.service.ts
import { Injectable } from '@nestjs/common';
import path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as fs from 'fs';

@Injectable()
export class PdfGeneratorService {
  async generatePdf(design: any): Promise<Buffer> {
  const { elements, data } = design;

  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]);

    // Load custom font (Arabic compatible)
    const fontPath = path.resolve(__dirname, './Amiri-Regular.ttf');
    const fontBytes = fs.readFileSync(fontPath);
    const customFont = await pdfDoc.embedFont(fontBytes);

    for (const element of elements) {
      if (element.type === 'text') {
        const text = this.replacePlaceholders(element.text, data);

        page.drawText(text, {
          x: element.x,
          y: 842 - element.y - (element.fontSize || 12),
          size: element.fontSize || 12,
          font: customFont,   // ✅ use custom font
          color: this.hexToRgb(element.color || '#000000'),
          maxWidth: element.width || 500,
          lineHeight: element.lineHeight || 14,
          opacity: element.opacity || 1,
        });
      } else if (element.type === 'rectangle') {
          page.drawRectangle({
            x: element.x,
            y: 842 - element.y - (element.height || 0),
            width: element.width || 0,
            height: element.height || 0,
            borderWidth: element.strokeWidth || 1,
            borderColor: this.hexToRgb(element.stroke || '#000000'),
            color: this.hexToRgb(element.fill || '#ffffff'),
            opacity: element.opacity || 1
          });
        } else if (element.type === 'line') {
          page.drawLine({
            start: { x: element.x, y: 842 - element.y },
            end: { x: element.x + (element.width || 0), y: 842 - element.y },
            thickness: element.strokeWidth || 1,
            color: this.hexToRgb(element.stroke || '#000000'),
            opacity: element.opacity || 1
          });
        }
      }
      
      return Buffer.from(await pdfDoc.save());
    } catch (error) {
      console.error('Error in PDF generation:', error);
      throw new Error('Failed to generate PDF');
    }
  }

  private hexToRgb(hex: string) {
    const r = parseInt(hex.substring(1, 3), 16) / 255;
    const g = parseInt(hex.substring(3, 5), 16) / 255;
    const b = parseInt(hex.substring(5, 7), 16) / 255;
    return rgb(r, g, b);
  }

  private replacePlaceholders(text: string, data: any): string {
    if (!text) return '';
    
    return text
      .replace(/\{\{code_demande\}\}/g, data.code_demande || '')
      .replace(/\{\{typePermis\.lib_type\}\}/g, data.typePermis?.lib_type || '')
      .replace(/\{\{detenteur\.nom_societeFR\}\}/g, data.detenteur?.nom_societeFR || '')
      .replace(/\{\{wilaya\.nom_wilaya\}\}/g, data.wilaya?.nom_wilayaFR || '')
      .replace(/\{\{daira\.nom_daira\}\}/g, data.daira?.nom_dairaFR || '')
      .replace(/\{\{commune\.nom_commune\}\}/g, data.commune?.nom_communeFR || '')
      .replace(/\{\{superficie\}\}/g, data.superficie || '0')
      .replace(/\{\{duree\}\}/g, data.typePermis?.duree_initiale || '0')
      .replace(/\{\{date\}\}/g, new Date().toLocaleDateString('fr-FR'));
  }

  
}