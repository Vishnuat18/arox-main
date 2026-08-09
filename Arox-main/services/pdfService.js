const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { formatDate, formatCurrency } = require('../utils/helpers');
const { generateQRDataURL } = require('../utils/qrGenerator');
const logger = require('../utils/logger');

class PDFService {
  /**
   * Generate an Offer Letter PDF
   */
  async generateOfferLetter(student, registration, course) {
    return new Promise(async (resolve, reject) => {
      try {
        const dir = path.join(__dirname, '..', 'public', 'uploads', 'documents');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        const filename = `offer-letter-${registration.registration_id}.pdf`;
        const filePath = path.join(dir, filename);
        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        const stream = fs.createWriteStream(filePath);

        doc.pipe(stream);

        const orgName = process.env.ORG_NAME || 'AROX Tech Pvt. Ltd.';
        const orgAddress = process.env.ORG_ADDRESS || 'Chennai, Tamil Nadu, India';

        // Header with gradient-like background
        doc.rect(0, 0, doc.page.width, 120).fill('#4F46E5');
        doc.fontSize(28).fillColor('#FFFFFF').font('Helvetica-Bold')
          .text(orgName, 50, 35, { align: 'center' });
        doc.fontSize(12).fillColor('#C7D2FE')
          .text('Internship & Training Management', 50, 70, { align: 'center' });

        // Title
        doc.moveDown(3);
        doc.fontSize(22).fillColor('#1E293B').font('Helvetica-Bold')
          .text('OFFER LETTER', { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(10).fillColor('#64748B').font('Helvetica')
          .text(`Date: ${formatDate(new Date(), 'long')}`, { align: 'center' });
        doc.text(`Ref: ${registration.registration_id}`, { align: 'center' });

        // Horizontal line
        doc.moveDown(1);
        doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke('#E2E8F0');

        // Body
        doc.moveDown(1);
        doc.fontSize(12).fillColor('#1E293B').font('Helvetica');
        doc.text(`Dear ${student.first_name} ${student.last_name},`, { continued: false });
        doc.moveDown(0.5);
        doc.fontSize(11).fillColor('#334155').font('Helvetica');
        doc.text(
          `We are pleased to inform you that you have been selected for the ${course.title} program at ${orgName}. ` +
          `This letter serves as your official offer of enrollment.`,
          { lineGap: 4 }
        );

        // Details box
        doc.moveDown(1);
        const boxY = doc.y;
        doc.rect(50, boxY, doc.page.width - 100, 200).fill('#F8FAFC').stroke('#E2E8F0');

        doc.fontSize(13).fillColor('#4F46E5').font('Helvetica-Bold')
          .text('Program Details', 70, boxY + 15);

        doc.fontSize(11).fillColor('#334155').font('Helvetica');
        const leftCol = 70;
        const rightCol = 250;
        let detailY = boxY + 40;
        const lineHeight = 22;

        const details = [
          ['Student ID', student.student_id],
          ['Program', course.title],
          ['Duration', course.duration || 'N/A'],
          ['Mode', (registration.mode || course.mode || 'Online').charAt(0).toUpperCase() + (registration.mode || course.mode || 'online').slice(1)],
          ['Batch', registration.batch_name || course.batch_name || 'N/A'],
          ['Start Date', registration.start_date ? formatDate(registration.start_date) : 'TBD'],
          ['End Date', registration.end_date ? formatDate(registration.end_date) : 'TBD'],
        ];

        details.forEach(([label, value]) => {
          doc.font('Helvetica-Bold').text(label + ':', leftCol, detailY);
          doc.font('Helvetica').text(value, rightCol, detailY);
          detailY += lineHeight;
        });

        // Terms
        doc.y = boxY + 215;
        doc.moveDown(0.5);
        doc.fontSize(13).fillColor('#4F46E5').font('Helvetica-Bold')
          .text('Terms & Conditions');
        doc.moveDown(0.3);
        doc.fontSize(10).fillColor('#475569').font('Helvetica');
        const terms = [
          'You must maintain a minimum attendance of 75% throughout the program.',
          'All assignments and projects must be submitted before the deadline.',
          'The fee is non-refundable once the program has commenced.',
          'A completion certificate will be issued upon successful completion of the program.',
          'This offer is valid for the specified batch only.'
        ];
        terms.forEach((term, i) => {
          doc.text(`${i + 1}. ${term}`, { lineGap: 3 });
        });

        // Signature
        doc.moveDown(2);
        doc.fontSize(11).fillColor('#1E293B').font('Helvetica');
        doc.text('Warm Regards,');
        doc.moveDown(1);
        doc.font('Helvetica-Bold').text('Program Director');
        doc.font('Helvetica').text(orgName);
        doc.text(orgAddress);

        // Footer
        doc.fontSize(8).fillColor('#94A3B8')
          .text(
            `This is a computer-generated document. | ${orgName} | ${orgAddress}`,
            50, doc.page.height - 50,
            { align: 'center', width: doc.page.width - 100 }
          );

        doc.end();

        stream.on('finish', () => {
          logger.info(`📄 Offer letter generated: ${filename}`);
          resolve({
            filename,
            filePath,
            relativePath: `/uploads/documents/${filename}`
          });
        });

        stream.on('error', reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Generate a Payment Invoice PDF
   */
  async generateInvoice(payment, student, registration, course) {
    return new Promise((resolve, reject) => {
      try {
        const dir = path.join(__dirname, '..', 'public', 'uploads', 'documents');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        const filename = `invoice-${payment.invoice_number}.pdf`;
        const filePath = path.join(dir, filename);
        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        const stream = fs.createWriteStream(filePath);

        doc.pipe(stream);

        const orgName = process.env.ORG_NAME || 'AROX Tech Pvt. Ltd.';

        // Header
        doc.rect(0, 0, doc.page.width, 100).fill('#4F46E5');
        doc.fontSize(24).fillColor('#FFFFFF').font('Helvetica-Bold')
          .text('INVOICE', 50, 35, { align: 'center' });
        doc.fontSize(12).fillColor('#C7D2FE')
          .text(orgName, 50, 65, { align: 'center' });

        // Invoice details
        doc.moveDown(3);
        doc.fontSize(11).fillColor('#334155').font('Helvetica');
        doc.text(`Invoice No: ${payment.invoice_number}`);
        doc.text(`Date: ${formatDate(payment.paid_at || new Date())}`);
        doc.text(`Payment ID: ${payment.payment_id}`);
        
        doc.moveDown(1);
        doc.font('Helvetica-Bold').text('Bill To:');
        doc.font('Helvetica').text(`${student.first_name} ${student.last_name}`);
        doc.text(student.email);

        // Table
        doc.moveDown(1);
        const tableTop = doc.y;
        doc.rect(50, tableTop, doc.page.width - 100, 25).fill('#F1F5F9');
        doc.fontSize(10).fillColor('#1E293B').font('Helvetica-Bold');
        doc.text('Description', 60, tableTop + 7);
        doc.text('Amount', 400, tableTop + 7, { width: 100, align: 'right' });

        doc.font('Helvetica').fillColor('#334155');
        doc.text(course.title, 60, tableTop + 35);
        doc.text(formatCurrency(payment.amount), 400, tableTop + 35, { width: 100, align: 'right' });

        const subtotalY = tableTop + 65;
        doc.moveTo(50, subtotalY).lineTo(doc.page.width - 50, subtotalY).stroke('#E2E8F0');
        
        doc.text('Subtotal:', 300, subtotalY + 10);
        doc.text(formatCurrency(payment.amount), 400, subtotalY + 10, { width: 100, align: 'right' });
        doc.text('GST (18%):', 300, subtotalY + 28);
        doc.text(formatCurrency(payment.gst_amount), 400, subtotalY + 28, { width: 100, align: 'right' });
        
        doc.moveTo(300, subtotalY + 48).lineTo(doc.page.width - 50, subtotalY + 48).stroke('#E2E8F0');
        doc.font('Helvetica-Bold').fillColor('#4F46E5');
        doc.text('Total:', 300, subtotalY + 55);
        doc.text(formatCurrency(payment.total_amount), 400, subtotalY + 55, { width: 100, align: 'right' });

        // Status
        doc.moveDown(4);
        const statusColor = payment.status === 'completed' ? '#22C55E' : '#F59E0B';
        doc.fontSize(14).fillColor(statusColor).font('Helvetica-Bold')
          .text(`Status: ${payment.status.toUpperCase()}`, { align: 'center' });

        doc.end();

        stream.on('finish', () => {
          logger.info(`📄 Invoice generated: ${filename}`);
          resolve({
            filename,
            filePath,
            relativePath: `/uploads/documents/${filename}`
          });
        });

        stream.on('error', reject);
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = new PDFService();
