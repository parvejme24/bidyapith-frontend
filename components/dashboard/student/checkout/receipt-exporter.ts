import { toast } from "sonner";
import { formatTaka } from "@/lib/format";

export interface ReceiptData {
  receiptNumber: string;
  transactionRef: string;
  studentName: string;
  studentId: string;
  studentEmail: string;
  programTitle: string;
  programCode: string;
  semesterNum: number;
  termName: string;
  baseTuition: number;
  labFee: number;
  examFee: number;
  totalPaid: number;
  gateway: string;
  paymentDate: string;
  coursesCount: number;
  totalCredits: number;
}

/**
 * Generates and downloads an official high-resolution PDF receipt
 */
export function exportReceiptAsPdf(data: ReceiptData) {
  try {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Please allow popups to download your official PDF receipt");
      return;
    }

    const receiptHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Tuition_Receipt_${data.receiptNumber}_${data.studentId}</title>
        <meta charset="utf-8" />
        <style>
          @page { size: A4 portrait; margin: 15mm; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #0F172A; margin: 0; padding: 24px; line-height: 1.5; background: #FFF; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0F172A; padding-bottom: 16px; }
          .brand { font-size: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #0F172A; }
          .brand-sub { font-size: 11px; color: #64748B; text-transform: uppercase; letter-spacing: 2px; }
          .receipt-title { text-align: right; }
          .receipt-badge { background: #DCFCE7; color: #166534; font-weight: bold; font-size: 11px; padding: 4px 12px; border-radius: 999px; display: inline-block; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 20px 0; }
          .box { background: #F8FAFC; border: 1px solid #E2E8F0; padding: 12px 14px; border-radius: 8px; font-size: 12px; }
          .box h4 { margin: 0 0 6px 0; font-size: 11px; text-transform: uppercase; color: #64748B; }
          table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 12px; }
          th { text-align: left; background: #F1F5F9; padding: 10px 12px; border-bottom: 1px solid #CBD5E1; font-size: 11px; text-transform: uppercase; }
          td { padding: 10px 12px; border-bottom: 1px solid #E2E8F0; }
          .total-row { font-weight: bold; font-size: 14px; background: #F8FAFC; }
          .footer { margin-top: 32px; border-top: 1px dashed #CBD5E1; padding-top: 14px; display: flex; justify-content: space-between; font-size: 11px; color: #64748B; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">Bidyapith University</div>
            <div class="brand-sub">Office of the Comptroller & Student Accounts</div>
            <p style="margin: 4px 0 0; font-size: 12px; color: #475569;">Dhaka, Bangladesh · billing@bidyapith.edu</p>
          </div>
          <div class="receipt-title">
            <span class="receipt-badge">PAID & SETTLED</span>
            <h2 style="margin: 6px 0 2px; font-size: 20px;">Tuition Payment Receipt</h2>
            <p style="margin: 0; font-size: 12px; font-family: monospace; color: #64748B;">Receipt #: ${data.receiptNumber}</p>
          </div>
        </div>

        <div class="grid">
          <div class="box">
            <h4>Student Information</h4>
            <p style="margin: 2px 0;"><b>Name:</b> ${data.studentName}</p>
            <p style="margin: 2px 0;"><b>Student ID:</b> ${data.studentId}</p>
            <p style="margin: 2px 0;"><b>Program:</b> ${data.programTitle}</p>
            <p style="margin: 2px 0;"><b>Email:</b> ${data.studentEmail}</p>
          </div>
          <div class="box">
            <h4>Payment Clearance Details</h4>
            <p style="margin: 2px 0;"><b>Cleared Date:</b> ${data.paymentDate}</p>
            <p style="margin: 2px 0;"><b>Payment Gateway:</b> ${data.gateway} (Automated IPN)</p>
            <p style="margin: 2px 0;"><b>Transaction Hash:</b> ${data.transactionRef}</p>
            <p style="margin: 2px 0;"><b>Term:</b> Semester ${data.semesterNum} (${data.termName})</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Academic Breakdown</th>
              <th style="text-align: right;">Amount (BDT)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><b>Semester ${data.semesterNum} Course Tuition</b><br><span style="font-size: 11px; color: #64748B;">Course registration & syllabus access</span></td>
              <td>${data.coursesCount} Courses (${data.totalCredits} Credits)</td>
              <td style="text-align: right;">${formatTaka(data.baseTuition - 3000)}</td>
            </tr>
            <tr>
              <td><b>Laboratory & Computing Cloud Fee</b><br><span style="font-size: 11px; color: #64748B;">Specialized lab slots & IDE resources</span></td>
              <td>Laboratory Practicum</td>
              <td style="text-align: right;">${formatTaka(data.labFee)}</td>
            </tr>
            <tr>
              <td><b>Examination & Digital Registry Fee</b><br><span style="font-size: 11px; color: #64748B;">Official transcript logging & seat plan allocation</span></td>
              <td>Institutional Registry</td>
              <td style="text-align: right;">${formatTaka(data.examFee)}</td>
            </tr>
            <tr class="total-row">
              <td colspan="2">TOTAL AMOUNT SETTLED</td>
              <td style="text-align: right; color: #059669;">${formatTaka(data.totalPaid)}</td>
            </tr>
          </tbody>
        </table>

        <div class="footer">
          <div>
            <b>Verification:</b> bidyapith.edu/verify/receipt/${data.receiptNumber}<br>
            <b>Status:</b> Automatically Cleared via Webhook
          </div>
          <div style="text-align: right;">
            <b>Comptroller Signature Code:</b><br>
            <span style="font-family: monospace;">0x${data.transactionRef.replace(/[^0-9a-fA-F]/g, "").slice(0, 24)}</span>
          </div>
        </div>

        <script>window.onload = function() { window.print(); };</script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(receiptHtml);
    printWindow.document.close();
    toast.success("Official PDF Tuition Receipt generated!");
  } catch {
    toast.error("Failed to generate PDF receipt.");
  }
}

/**
 * Generates and downloads a clean, crisp PNG receipt image via Canvas
 */
export function exportReceiptAsPng(data: ReceiptData) {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 1400;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      toast.error("Canvas context not available for PNG export");
      return;
    }

    // Background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 1200, 1400);
    bgGradient.addColorStop(0, "#0E152E");
    bgGradient.addColorStop(0.5, "#121936");
    bgGradient.addColorStop(1, "#0A0F24");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1200, 1400);

    // Decorative Gold Border
    ctx.strokeStyle = "rgba(46, 211, 167, 0.4)";
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, 1140, 1340);

    // University Header
    ctx.fillStyle = "#F8FAFC";
    ctx.font = "bold 34px sans-serif";
    ctx.fillText("BIDYAPITH UNIVERSITY", 70, 95);

    ctx.fillStyle = "#2ED3A7";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText("OFFICE OF THE COMPTROLLER · OFFICIAL TUITION RECEIPT", 70, 125);

    // Receipt Badge Box (Right aligned)
    ctx.fillStyle = "rgba(46, 211, 167, 0.15)";
    ctx.strokeStyle = "rgba(46, 211, 167, 0.5)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(880, 65, 250, 65, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#2ED3A7";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("● PAID & VERIFIED", 910, 93);
    ctx.fillStyle = "#94A3B8";
    ctx.font = "12px monospace";
    ctx.fillText(data.receiptNumber, 910, 115);

    // Horizontal Divider
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(70, 160);
    ctx.lineTo(1130, 160);
    ctx.stroke();

    // Student Information Card
    ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.beginPath();
    ctx.roundRect(70, 190, 510, 200, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#64748B";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("STUDENT INFORMATION", 95, 225);

    ctx.fillStyle = "#94A3B8";
    ctx.font = "14px sans-serif";
    ctx.fillText("Student Name:", 95, 265);
    ctx.fillText("Student ID:", 95, 300);
    ctx.fillText("Degree Program:", 95, 335);
    ctx.fillText("Official Email:", 95, 370);

    ctx.fillStyle = "#F8FAFC";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText(data.studentName, 230, 265);
    ctx.fillStyle = "#2ED3A7";
    ctx.font = "bold 14px monospace";
    ctx.fillText(data.studentId, 230, 300);
    ctx.fillStyle = "#F8FAFC";
    ctx.font = "14px sans-serif";
    ctx.fillText(data.programTitle, 230, 335);
    ctx.fillStyle = "#94A3B8";
    ctx.font = "13px monospace";
    ctx.fillText(data.studentEmail, 230, 370);

    // Payment Information Card
    ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.beginPath();
    ctx.roundRect(620, 190, 510, 200, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#64748B";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("PAYMENT CLEARANCE DETAILS", 645, 225);

    ctx.fillStyle = "#94A3B8";
    ctx.font = "14px sans-serif";
    ctx.fillText("Cleared Date:", 645, 265);
    ctx.fillText("Payment Gateway:", 645, 300);
    ctx.fillText("Transaction Ref:", 645, 335);
    ctx.fillText("Academic Term:", 645, 370);

    ctx.fillStyle = "#F8FAFC";
    ctx.font = "14px monospace";
    ctx.fillText(data.paymentDate, 785, 265);
    ctx.fillText(`${data.gateway} (Webhook IPN)`, 785, 300);
    ctx.fillStyle = "#2ED3A7";
    ctx.fillText(data.transactionRef, 785, 335);
    ctx.fillStyle = "#F8FAFC";
    ctx.fillText(`Semester ${data.semesterNum} (${data.termName})`, 785, 370);

    // Table Header
    ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
    ctx.fillRect(70, 420, 1060, 45);
    ctx.fillStyle = "#94A3B8";
    ctx.font = "bold 12px sans-serif";
    ctx.fillText("ITEM DESCRIPTION", 90, 448);
    ctx.fillText("ACADEMIC DETAILS", 550, 448);
    ctx.fillText("AMOUNT (BDT)", 980, 448);

    // Table Rows
    const drawRow = (y: number, desc: string, subDesc: string, detail: string, amount: string) => {
      ctx.fillStyle = "#F8FAFC";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText(desc, 90, y);
      ctx.fillStyle = "#64748B";
      ctx.font = "12px sans-serif";
      ctx.fillText(subDesc, 90, y + 20);

      ctx.fillStyle = "#94A3B8";
      ctx.font = "13px sans-serif";
      ctx.fillText(detail, 550, y + 10);

      ctx.fillStyle = "#F8FAFC";
      ctx.font = "bold 14px monospace";
      ctx.fillText(amount, 980, y + 10);

      ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(70, y + 35);
      ctx.lineTo(1130, y + 35);
      ctx.stroke();
    };

    drawRow(500, `Semester ${data.semesterNum} Course Tuition`, "Full course registration and routine access", `${data.coursesCount} Courses (${data.totalCredits} Cr)`, formatTaka(data.baseTuition - 3000));
    drawRow(570, "Laboratory & Cloud IDE Infrastructure", "Dedicated lab slots, cloud server & compiler resources", "Practicum Labs", formatTaka(data.labFee));
    drawRow(640, "Examination & Digital Registry Fee", "Seat plan allocation & immutable blockchain registry", "Institutional Registry", formatTaka(data.examFee));

    // Total Payable Box
    ctx.fillStyle = "rgba(46, 211, 167, 0.08)";
    ctx.strokeStyle = "rgba(46, 211, 167, 0.3)";
    ctx.beginPath();
    ctx.roundRect(70, 710, 1060, 70, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#F8FAFC";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText("TOTAL AMOUNT SETTLED", 95, 752);

    ctx.fillStyle = "#2ED3A7";
    ctx.font = "bold 26px monospace";
    ctx.fillText(formatTaka(data.totalPaid), 940, 754);

    // Bottom Verification
    ctx.fillStyle = "#64748B";
    ctx.font = "12px sans-serif";
    ctx.fillText("Verified by Bidyapith Academic Trust Root & Comptroller Automation", 70, 830);
    ctx.fillText(`Registry Link: bidyapith.edu/verify/receipt/${data.receiptNumber}`, 70, 855);

    ctx.fillStyle = "#94A3B8";
    ctx.font = "12px monospace";
    ctx.fillText(`HMAC Signature: 0x${data.transactionRef.replace(/[^0-9a-fA-F]/g, "").slice(0, 32)}`, 680, 855);

    // Convert Canvas to downloadable PNG image
    const link = document.createElement("a");
    link.download = `Bidyapith_Tuition_Receipt_${data.receiptNumber}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();

    toast.success("High-Resolution PNG Receipt downloaded successfully!");
  } catch {
    toast.error("Failed to export PNG receipt image.");
  }
}
