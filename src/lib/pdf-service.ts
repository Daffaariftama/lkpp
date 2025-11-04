// lib/pdf-service.ts
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export class PdfService {
  static async generateConsultationPDF(data: any, elementId: string = 'pdf-template') {
    return new Promise<jsPDF>(async (resolve, reject) => {
      try {
        console.log('Starting PDF generation...');
        
        const element = document.getElementById(elementId);
        if (!element) {
          reject(new Error('Element not found for PDF generation'));
          return;
        }

        // Simpan original styles
        const originalStyles = {
          background: element.style.background,
          overflow: element.style.overflow,
          position: element.style.position,
          top: element.style.top,
          left: element.style.left
        };

        // Apply PDF-optimized styles
        Object.assign(element.style, {
          background: '#ffffff',
          overflow: 'visible',
          position: 'static',
          top: 'auto',
          left: 'auto'
        });

        // Hide action buttons
        const actionButtons = element.querySelector('.print\\:hidden');
        if (actionButtons) {
          (actionButtons as HTMLElement).style.display = 'none';
        }

        // Remove all complex styles from children elements
        const removeComplexStyles = (el: Element) => {
          if (el instanceof HTMLElement) {
            // Remove problematic styles
            const stylesToRemove = [
              'backdropFilter',
              'backgroundImage',
              'boxShadow',
              'filter',
              'transform',
              'transition',
              'animation'
            ];
            
            stylesToRemove.forEach(style => {
              if (el.style[style as any]) {
                el.style[style as any] = '';
              }
            });

            // Ensure solid background
            if (!el.style.backgroundColor || el.style.backgroundColor.includes('gradient')) {
              el.style.backgroundColor = '#ffffff';
            }

            // Remove any complex classes that might cause issues
            if (el.className) {
              el.className = el.className.replace(/bg-\[.*?\]|from-|to-|via-/g, '');
            }
          }

          // Process children
          Array.from(el.children).forEach(removeComplexStyles);
        };

        removeComplexStyles(element);

        // Use very simple html2canvas options
        const canvas = await html2canvas(element, {
          useCORS: true,
          logging: false,
          background: '#ffffff',
          allowTaint: false,
        });

        // Restore original styles
        Object.assign(element.style, originalStyles);
        if (actionButtons) {
          (actionButtons as HTMLElement).style.display = 'flex';
        }

        console.log('Canvas created, generating PDF...');

        const imgData = canvas.toDataURL('image/png', 0.8); // Lower quality for smaller file
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
          compress: true
        });

        const imgWidth = 190; // Slightly smaller than A4 for margins
        const pageHeight = 277; // A4 height - margins
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Add first page
        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
        
        console.log('PDF generated successfully');
        resolve(pdf);

      } catch (error) {
        console.error('Error in generateConsultationPDF:', error);
        reject(error);
      }
    });
  }

  static async downloadPDF(data: any, filename: string = 'form-konsultasi.pdf') {
    try {
      console.log('Starting PDF download process...');
      
      // Wait for DOM to be ready
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const pdf = await this.generateConsultationPDF(data);
      console.log('PDF generated, starting download...');
      
      pdf.save(filename);
      console.log('PDF download completed');
      
      return true;
    } catch (error) {
      console.error('Error in downloadPDF:', error);
      
      // Simple fallback - create basic PDF without html2canvas
      try {
        console.log('Trying simple PDF fallback...');
        await this.createSimplePDF(data, filename);
        return true;
      } catch (fallbackError) {
        console.error('Simple PDF fallback also failed:', fallbackError);
        
        // Show helpful error message
        const errorMessage = `
PDF generation failed. This is usually due to:

1. Browser compatibility issues
2. Complex CSS styles that can't be rendered

Solutions:
• Use Chrome or Firefox latest version
• Try the "Print Langsung" button (Ctrl+P)
• Contact support if problem persists

Error details: ${error instanceof Error ? error.message : 'Unknown error'}
        `.trim();
        
        alert(errorMessage);
        throw new Error('PDF generation failed');
      }
    }
  }

  // Simple PDF fallback without html2canvas
  static async createSimplePDF(data: any, filename: string) {
    const pdf = new jsPDF();
    
    // Add simple text content
    pdf.setFontSize(16);
    pdf.text('FORMULIR KONSULTASI TATAP MUKA', 20, 20);
    pdf.setFontSize(12);
    pdf.text('DIREKTORAT PENANGANAN PEMASALAHAN HUKUM', 20, 30);
    
    pdf.setFontSize(10);
    let yPosition = 50;
    
    // Add basic data
    const fields = [
      `Tanggal: ${data.tanggal}`,
      `Waktu: ${data.waktu}`,
      `Nama: ${data.nama}`,
      `Instansi: ${data.instansi}`,
      `Jabatan: ${data.jabatan}`,
      `Alamat: ${data.alamat}`,
      `No. Telp: ${data.noTelp}`,
      `Jumlah Tamu: ${data.jumlahTamu}`,
      `Jenis Permasalahan: ${data.jenisPermasalahan}`,
    ];
    
    fields.forEach(field => {
      if (yPosition > 270) {
        pdf.addPage();
        yPosition = 20;
      }
      pdf.text(field, 20, yPosition);
      yPosition += 10;
    });
    
    pdf.save(filename);
  }

  static async openPDFInNewWindow(data: any) {
    try {
      const pdf = await this.generateConsultationPDF(data);
      const pdfBlob = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      window.open(pdfUrl, '_blank');
      
      // Clean up
      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
      }, 10000);
      
      return true;
    } catch (error) {
      console.error('Error opening PDF:', error);
      throw error;
    }
  }
}