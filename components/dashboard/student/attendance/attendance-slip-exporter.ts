import { toast } from "sonner";

export interface AttendanceSlipCourse {
  code: string;
  title: string;
  type: string;
  credits: number;
  instructor: string;
  room: string;
  held: number;
  present: number;
  late: number;
  absent: number;
  pct: number;
  isEligible: boolean;
  monthlyBreakdown: { monthName: string; pct: number; held: number; present: number }[];
}

export interface AttendanceSlipData {
  slipNumber: string;
  studentName: string;
  studentId: string;
  studentEmail: string;
  programTitle: string;
  department: string;
  semesterTitle: string;
  termName: string;
  issueDate: string;
  totalHeld: number;
  totalPresent: number;
  totalLate: number;
  totalAbsent: number;
  overallPct: number;
  isFullyEligible: boolean;
  courses: AttendanceSlipCourse[];
  verificationHash: string;
}

/**
 * Generates an official, print-ready PDF document for the Attendance Record Slip
 */
export function exportAttendanceSlipAsPdf(data: AttendanceSlipData) {
  try {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Please allow popups to download your official PDF slip.");
      return;
    }

    const courseRows = data.courses
      .map(
        (c, idx) => `
        <tr style="background: ${idx % 2 === 0 ? "#FFFFFF" : "#F8FAFC"};">
          <td style="padding: 9px 12px; border-bottom: 1px solid #E2E8F0; font-family: monospace; font-weight: bold; color: #0F766E;">
            ${c.code}
          </td>
          <td style="padding: 9px 12px; border-bottom: 1px solid #E2E8F0;">
            <b style="color: #0F172A; font-size: 12px;">${c.title}</b>
            <div style="color: #64748B; font-size: 10px; margin-top: 2px;">${c.instructor} · Room: ${c.room} (${c.credits} Cr)</div>
          </td>
          <td style="padding: 9px 12px; border-bottom: 1px solid #E2E8F0; text-align: center; font-family: monospace;">${c.held}</td>
          <td style="padding: 9px 12px; border-bottom: 1px solid #E2E8F0; text-align: center; font-family: monospace; color: #15803D; font-weight: bold;">${c.present}</td>
          <td style="padding: 9px 12px; border-bottom: 1px solid #E2E8F0; text-align: center; font-family: monospace; color: #D97706;">${c.late}</td>
          <td style="padding: 9px 12px; border-bottom: 1px solid #E2E8F0; text-align: center; font-family: monospace; color: #DC2626;">${c.absent}</td>
          <td style="padding: 9px 12px; border-bottom: 1px solid #E2E8F0; text-align: right; font-family: monospace; font-weight: 800; color: ${c.pct >= 75 ? "#0F766E" : "#DC2626"};">
            ${c.pct}%
          </td>
          <td style="padding: 9px 12px; border-bottom: 1px solid #E2E8F0; text-align: center;">
            <span style="display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 10px; font-weight: 700; ${
              c.isEligible
                ? "background: #DCFCE7; color: #166534; border: 1px solid #BBF7D0;"
                : "background: #FEE2E2; color: #991B1B; border: 1px solid #FECACA;"
            }">
              ${c.isEligible ? "CLEARED" : "BARRED"}
            </span>
          </td>
        </tr>
      `
      )
      .join("");

    const slipHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Attendance_Slip_${data.studentId}_${data.semesterTitle.replace(/\s+/g, "_")}</title>
        <meta charset="utf-8" />
        <style>
          @page { size: A4 portrait; margin: 12mm; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            color: #0F172A;
            margin: 0;
            padding: 24px;
            background: #FFFFFF;
            font-size: 12px;
            line-height: 1.45;
          }
          .header-box {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 3px double #0D9488;
            padding-bottom: 14px;
          }
          .brand-title {
            font-size: 22px;
            font-weight: 900;
            letter-spacing: 0.5px;
            color: #0F172A;
            text-transform: uppercase;
          }
          .brand-sub {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #0D9488;
            font-weight: 700;
          }
          .slip-badge {
            display: inline-block;
            background: ${data.isFullyEligible ? "#0D9488" : "#E11D48"};
            color: #FFFFFF;
            font-size: 11px;
            font-weight: 800;
            padding: 4px 12px;
            border-radius: 4px;
            letter-spacing: 0.5px;
            text-transform: uppercase;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin: 18px 0;
          }
          .info-card {
            background: #F8FAFC;
            border: 1px solid #E2E8F0;
            border-radius: 6px;
            padding: 10px 14px;
          }
          .info-card h4 {
            margin: 0 0 6px 0;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #64748B;
            font-weight: 800;
          }
          .info-item {
            margin: 3px 0;
            display: flex;
            justify-content: space-between;
          }
          .info-item span:first-child {
            color: #64748B;
          }
          .info-item span:last-child {
            font-weight: 600;
            color: #0F172A;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 14px 0;
            border: 1px solid #E2E8F0;
            border-radius: 6px;
            overflow: hidden;
          }
          th {
            background: #0F172A;
            color: #F8FAFC;
            padding: 8px 12px;
            text-align: left;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .summary-bar {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin: 16px 0;
          }
          .summary-stat {
            background: #F1F5F9;
            border: 1px solid #CBD5E1;
            border-radius: 6px;
            padding: 8px 12px;
            text-align: center;
          }
          .summary-stat .label {
            font-size: 9px;
            text-transform: uppercase;
            color: #64748B;
            font-weight: 700;
          }
          .summary-stat .val {
            font-size: 16px;
            font-weight: 800;
            font-family: monospace;
            margin-top: 2px;
            color: #0F172A;
          }
          .footer-section {
            margin-top: 36px;
            border-top: 1px dashed #CBD5E1;
            padding-top: 16px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .sign-col {
            text-align: center;
            width: 180px;
          }
          .sign-line {
            border-top: 1px solid #94A3B8;
            margin-top: 40px;
            padding-top: 4px;
            font-size: 10px;
            font-weight: bold;
            color: #334155;
          }
          .watermark {
            margin-top: 20px;
            font-size: 9px;
            color: #94A3B8;
            text-align: center;
            font-family: monospace;
          }
        </style>
      </head>
      <body>
        <div class="header-box">
          <div>
            <div class="brand-title">Bidyapith University</div>
            <div class="brand-sub">Controller of Examinations · Academic Attendance Division</div>
            <div style="font-size: 11px; color: #475569; margin-top: 2px;">
              Purbachal Academic Enclave, Dhaka 1229 · attendance@bidyapith.edu
            </div>
          </div>
          <div style="text-align: right;">
            <div class="slip-badge">${data.isFullyEligible ? "EXAM CLEARED (75%+)" : "EXAM AT RISK"}</div>
            <h3 style="margin: 6px 0 2px; font-size: 14px; text-transform: uppercase;">Official Attendance Record</h3>
            <div style="font-size: 10px; font-family: monospace; color: #64748B;">Slip Ref: ${data.slipNumber}</div>
          </div>
        </div>

        <div class="info-grid">
          <div class="info-card">
            <h4>Student & Academic Profile</h4>
            <div class="info-item"><span>Student Name:</span> <span>${data.studentName}</span></div>
            <div class="info-item"><span>Student ID:</span> <span>${data.studentId}</span></div>
            <div class="info-item"><span>Program:</span> <span>${data.programTitle}</span></div>
            <div class="info-item"><span>Department:</span> <span>${data.department}</span></div>
          </div>
          <div class="info-card">
            <h4>Attendance Audit Details</h4>
            <div class="info-item"><span>Academic Term:</span> <span>${data.termName}</span></div>
            <div class="info-item"><span>Semester:</span> <span>${data.semesterTitle}</span></div>
            <div class="info-item"><span>Issued On:</span> <span>${data.issueDate}</span></div>
            <div class="info-item"><span>Verification Hash:</span> <span style="font-family: monospace; font-size: 10px;">${data.verificationHash}</span></div>
          </div>
        </div>

        <div class="summary-bar">
          <div class="summary-stat">
            <div class="label">Overall Rate</div>
            <div class="val" style="color: ${data.overallPct >= 75 ? "#0F766E" : "#DC2626"};">${data.overallPct}%</div>
          </div>
          <div class="summary-stat">
            <div class="label">Classes Held</div>
            <div class="val">${data.totalHeld}</div>
          </div>
          <div class="summary-stat">
            <div class="label">Present / Late</div>
            <div class="val" style="color: #0F766E;">${data.totalPresent} / ${data.totalLate}</div>
          </div>
          <div class="summary-stat">
            <div class="label">Finals Eligibility</div>
            <div class="val" style="font-size: 12px; color: ${data.isFullyEligible ? "#15803D" : "#DC2626"};">
              ${data.isFullyEligible ? "CLEARED TO SIT" : "UNDER 75% BAR"}
            </div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 90px;">Course Code</th>
              <th>Course Title & Faculty</th>
              <th style="text-align: center; width: 55px;">Held</th>
              <th style="text-align: center; width: 55px;">Present</th>
              <th style="text-align: center; width: 50px;">Late</th>
              <th style="text-align: center; width: 50px;">Absent</th>
              <th style="text-align: right; width: 75px;">Rate (%)</th>
              <th style="text-align: center; width: 85px;">Finals Status</th>
            </tr>
          </thead>
          <tbody>
            ${courseRows}
          </tbody>
        </table>

        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 10px 14px; border-radius: 6px; font-size: 10px; color: #475569; margin-top: 12px;">
          <b>Academic Ordinance Note:</b> As per University Academic Ordinance (Clause 4.2), a minimum of 75% attendance is mandatory in each enrolled course to be qualified for the Semester Final Examinations. Students below 75% must obtain Dean's special approval before the admit card issuance deadline.
        </div>

        <div class="footer-section">
          <div class="sign-col">
            <div class="sign-line">Student Signature</div>
          </div>
          <div class="sign-col">
            <div style="font-size: 10px; font-weight: bold; color: #0D9488;">SEAL VERIFIED</div>
            <div class="sign-line">Head of Department</div>
          </div>
          <div class="sign-col">
            <div class="sign-line">Controller of Examinations</div>
          </div>
        </div>

        <div class="watermark">
          Generated automatically via Bidyapith Academic ERP Portal · Digitally Certified Record · Ref: ${data.verificationHash}
        </div>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(slipHtml);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 400);

    toast.success("Attendance Slip PDF opened for downloading/printing.");
  } catch {
    toast.error("Failed to generate PDF. Please try again.");
  }
}

/**
 * Generates and downloads a high-resolution PNG image of the Official Attendance Slip
 */
export function exportAttendanceSlipAsPng(data: AttendanceSlipData) {
  try {
    const canvas = document.createElement("canvas");
    const width = 1200;
    const height = 1500;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      toast.error("Canvas rendering failed on this browser.");
      return;
    }

    // Background
    ctx.fillStyle = "#0B1320";
    ctx.fillRect(0, 0, width, height);

    // Decorative Borders
    ctx.strokeStyle = "rgba(46, 211, 167, 0.35)";
    ctx.lineWidth = 3;
    ctx.strokeRect(30, 30, width - 60, height - 60);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    // Header Background Accent
    ctx.fillStyle = "rgba(46, 211, 167, 0.06)";
    ctx.fillRect(40, 40, width - 80, 160);

    // University Title
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 34px sans-serif";
    ctx.fillText("BIDYAPITH UNIVERSITY", 65, 95);

    ctx.fillStyle = "#2ED3A7";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("OFFICIAL SEMESTER ATTENDANCE & EXAMINATION CLEARANCE SLIP", 65, 125);

    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.font = "13px monospace";
    ctx.fillText(`Slip Ref: ${data.slipNumber} · Issued: ${data.issueDate}`, 65, 155);

    // Right Badge
    ctx.fillStyle = data.isFullyEligible ? "#2ED3A7" : "#FF5370";
    ctx.fillRect(width - 290, 70, 220, 38);
    ctx.fillStyle = "#0A101D";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText(data.isFullyEligible ? "EXAM CLEARED (75%+)" : "EXAMINATION AT RISK", width - 275, 94);

    // Student Info Box
    ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
    ctx.fillRect(60, 230, width - 120, 130);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.strokeRect(60, 230, width - 120, 130);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText(`Student: ${data.studentName} (${data.studentId})`, 85, 270);
    ctx.fillText(`Program: ${data.programTitle}`, 85, 305);
    ctx.fillText(`Term: ${data.semesterTitle} (${data.termName})`, 85, 338);

    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.font = "14px monospace";
    ctx.fillText(`Overall Rate: ${data.overallPct}% (${data.totalPresent}/${data.totalHeld} Held)`, width - 420, 270);
    ctx.fillText(`Absences: ${data.totalAbsent} · Late: ${data.totalLate}`, width - 420, 305);
    ctx.fillText(`Dept: ${data.department}`, width - 420, 338);

    // Table Header
    const tableTop = 400;
    ctx.fillStyle = "rgba(46, 211, 167, 0.15)";
    ctx.fillRect(60, tableTop, width - 120, 44);

    ctx.fillStyle = "#2ED3A7";
    ctx.font = "bold 13px monospace";
    ctx.fillText("COURSE CODE", 85, tableTop + 28);
    ctx.fillText("COURSE TITLE & FACULTY", 250, tableTop + 28);
    ctx.fillText("HELD", 680, tableTop + 28);
    ctx.fillText("PRESENT", 760, tableTop + 28);
    ctx.fillText("LATE", 850, tableTop + 28);
    ctx.fillText("ABSENT", 920, tableTop + 28);
    ctx.fillText("RATE", 1000, tableTop + 28);
    ctx.fillText("STATUS", 1070, tableTop + 28);

    // Table Rows
    let currentY = tableTop + 44;
    data.courses.forEach((c, idx) => {
      ctx.fillStyle = idx % 2 === 0 ? "rgba(255, 255, 255, 0.02)" : "rgba(255, 255, 255, 0.04)";
      ctx.fillRect(60, currentY, width - 120, 52);

      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.strokeRect(60, currentY, width - 120, 52);

      ctx.fillStyle = "#2ED3A7";
      ctx.font = "bold 14px monospace";
      ctx.fillText(c.code, 85, currentY + 32);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "13px sans-serif";
      ctx.fillText(c.title.length > 34 ? `${c.title.substring(0, 32)}...` : c.title, 250, currentY + 24);

      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.font = "11px sans-serif";
      ctx.fillText(`${c.instructor} · ${c.room}`, 250, currentY + 42);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "14px monospace";
      ctx.fillText(String(c.held), 690, currentY + 32);

      ctx.fillStyle = "#2ED3A7";
      ctx.fillText(String(c.present), 780, currentY + 32);

      ctx.fillStyle = "#FFB454";
      ctx.fillText(String(c.late), 860, currentY + 32);

      ctx.fillStyle = "#FF5370";
      ctx.fillText(String(c.absent), 935, currentY + 32);

      ctx.fillStyle = c.pct >= 75 ? "#2ED3A7" : "#FF5370";
      ctx.font = "bold 14px monospace";
      ctx.fillText(`${c.pct}%`, 1000, currentY + 32);

      // Status pill
      ctx.fillStyle = c.isEligible ? "rgba(46, 211, 167, 0.2)" : "rgba(255, 83, 112, 0.2)";
      ctx.fillRect(1065, currentY + 14, 55, 24);
      ctx.fillStyle = c.isEligible ? "#2ED3A7" : "#FF5370";
      ctx.font = "bold 10px sans-serif";
      ctx.fillText(c.isEligible ? "CLEARED" : "BARRED", 1070, currentY + 30);

      currentY += 52;
    });

    // Ordinance note box
    currentY += 30;
    ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
    ctx.fillRect(60, currentY, width - 120, 60);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.strokeRect(60, currentY, width - 120, 60);

    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.font = "11px sans-serif";
    ctx.fillText("Academic Ordinance Note: Minimum 75% attendance is mandatory for semester examination clearance.", 85, currentY + 28);
    ctx.fillText("Verification Hash: " + data.verificationHash, 85, currentY + 46);

    // Signatures
    currentY += 120;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.lineWidth = 1;

    // Student Sign
    ctx.beginPath();
    ctx.moveTo(120, currentY + 40);
    ctx.lineTo(300, currentY + 40);
    ctx.stroke();
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.font = "12px sans-serif";
    ctx.fillText("Student Signature", 155, currentY + 60);

    // Dept Head Sign
    ctx.beginPath();
    ctx.moveTo(width / 2 - 90, currentY + 40);
    ctx.lineTo(width / 2 + 90, currentY + 40);
    ctx.stroke();
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.fillText("Head of Department", width / 2 - 60, currentY + 60);

    // Controller Sign
    ctx.beginPath();
    ctx.moveTo(width - 300, currentY + 40);
    ctx.lineTo(width - 120, currentY + 40);
    ctx.stroke();
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.fillText("Controller of Examinations", width - 290, currentY + 60);

    // Trigger image download
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `Official_Attendance_Slip_${data.studentId}_${data.semesterTitle.replace(/\s+/g, "_")}.png`;
    link.href = dataUrl;
    link.click();

    toast.success("Attendance Slip PNG downloaded successfully!");
  } catch {
    toast.error("Failed to generate PNG slip.");
  }
}
