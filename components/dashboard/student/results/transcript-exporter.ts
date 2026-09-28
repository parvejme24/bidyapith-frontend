import { toast } from "sonner";
import type { SemesterResultRecord } from "./results-types";

export interface OfficialTranscriptData {
  transcriptNumber: string;
  studentName: string;
  studentId: string;
  studentEmail: string;
  programTitle: string;
  department: string;
  degreeType: string;
  mediumOfInstruction: string;
  dateOfAdmission: string;
  issueDate: string;
  cgpa: number;
  creditsCompleted: number;
  totalDegreeCredits: number;
  academicStanding: string;
  terms: SemesterResultRecord[];
  verificationHash: string;
}

export const GRADING_SCALE_LEGEND = [
  { range: "80% - 100%", grade: "A+", point: "4.00", desc: "Outstanding" },
  { range: "75% - 79%", grade: "A", point: "3.75", desc: "Excellent" },
  { range: "70% - 74%", grade: "A-", point: "3.50", desc: "Very Good" },
  { range: "65% - 69%", grade: "B+", point: "3.25", desc: "Good" },
  { range: "60% - 64%", grade: "B", point: "3.00", desc: "Satisfactory" },
  { range: "55% - 59%", grade: "B-", point: "2.75", desc: "Above Average" },
  { range: "50% - 54%", grade: "C+", point: "2.50", desc: "Average" },
  { range: "45% - 49%", grade: "C", point: "2.25", desc: "Pass" },
  { range: "40% - 44%", grade: "D", point: "2.00", desc: "Conditional" },
  { range: "00% - 39%", grade: "F", point: "0.00", desc: "Fail" },
];

/**
 * Generates an official, print-ready PDF Academic Transcript
 */
export function exportTranscriptAsPdf(data: OfficialTranscriptData) {
  try {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Please allow popups to download your official transcript PDF.");
      return;
    }

    const completedTerms = data.terms.filter((t) => t.status === "completed" || t.status === "current");

    const termsHtml = completedTerms
      .map(
        (term) => `
        <div style="margin-bottom: 18px; page-break-inside: avoid;">
          <div style="background: #F1F5F9; border: 1px solid #CBD5E1; padding: 6px 10px; display: flex; justify-content: space-between; align-items: center; border-radius: 4px 4px 0 0;">
            <div>
              <b style="font-size: 11px; text-transform: uppercase; color: #0F172A;">${term.semesterTitle}</b>
              <span style="font-size: 10px; color: #64748B; margin-left: 8px;">(${term.totalCredits} Credits Registered)</span>
            </div>
            <div>
              <span style="font-size: 10px; font-weight: bold; font-family: monospace; color: #0F766E;">
                ${term.status === "completed" ? `Term GPA: ${term.gpa.toFixed(2)}` : `Active Continuous Assessment`}
              </span>
            </div>
          </div>
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #CBD5E1; border-top: 0; font-size: 10px;">
            <thead>
              <tr style="background: #F8FAFC; border-bottom: 1px solid #E2E8F0; text-transform: uppercase; color: #475569; font-size: 9px;">
                <th style="padding: 5px 8px; text-align: left; width: 80px;">Course Code</th>
                <th style="padding: 5px 8px; text-align: left;">Course Title</th>
                <th style="padding: 5px 8px; text-align: center; width: 50px;">Credits</th>
                <th style="padding: 5px 8px; text-align: center; width: 70px;">Letter Grade</th>
                <th style="padding: 5px 8px; text-align: right; width: 70px;">Grade Point</th>
              </tr>
            </thead>
            <tbody>
              ${term.courses
                .map(
                  (c, idx) => `
                <tr style="background: ${idx % 2 === 0 ? "#FFFFFF" : "#FAFAFA"}; border-bottom: 1px solid #E2E8F0;">
                  <td style="padding: 5px 8px; font-family: monospace; font-weight: bold; color: #0F766E;">${c.code}</td>
                  <td style="padding: 5px 8px;">${c.title}</td>
                  <td style="padding: 5px 8px; text-align: center;">${c.credits}</td>
                  <td style="padding: 5px 8px; text-align: center; font-weight: bold;">
                    ${c.status === "SCHEDULED" ? "—" : c.grade}
                  </td>
                  <td style="padding: 5px 8px; text-align: right; font-family: monospace; font-weight: bold;">
                    ${c.status === "SCHEDULED" ? "—" : c.point.toFixed(2)}
                  </td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      `
      )
      .join("");

    const legendHtml = GRADING_SCALE_LEGEND.map(
      (l) => `
      <div style="font-size: 8.5px; color: #475569; border-bottom: 1px solid #F1F5F9; padding: 2px 4px; display: flex; justify-content: space-between;">
        <span><b>${l.grade}</b> (${l.point})</span>
        <span>${l.range}</span>
      </div>
    `
    ).join("");

    const transcriptHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Academic_Transcript_${data.studentId}_${data.studentName.replace(/\s+/g, "_")}</title>
        <meta charset="utf-8" />
        <style>
          @page { size: A4 portrait; margin: 12mm; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            color: #0F172A;
            margin: 0;
            padding: 16px;
            background: #FFFFFF;
            font-size: 11px;
            line-height: 1.4;
          }
          .header-box {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 3px double #0F766E;
            padding-bottom: 12px;
          }
          .uni-name {
            font-size: 24px;
            font-weight: 900;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            color: #0F172A;
          }
          .uni-sub {
            font-size: 10px;
            font-weight: 700;
            color: #0F766E;
            text-transform: uppercase;
            letter-spacing: 1.5px;
          }
          .transcript-badge {
            background: #0F766E;
            color: #FFFFFF;
            font-weight: 800;
            font-size: 10px;
            padding: 3px 10px;
            border-radius: 4px;
            text-transform: uppercase;
            display: inline-block;
          }
          .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin: 14px 0;
          }
          .card {
            background: #F8FAFC;
            border: 1px solid #E2E8F0;
            border-radius: 4px;
            padding: 8px 12px;
          }
          .card h4 {
            margin: 0 0 4px 0;
            font-size: 9.5px;
            text-transform: uppercase;
            color: #64748B;
            letter-spacing: 0.5px;
            font-weight: 800;
          }
          .row {
            display: flex;
            justify-content: space-between;
            margin: 2px 0;
            font-size: 10.5px;
          }
          .row .lbl { color: #64748B; }
          .row .val { font-weight: 600; color: #0F172A; }
          .summary-band {
            background: #F1F5F9;
            border: 1px solid #CBD5E1;
            padding: 10px 14px;
            border-radius: 4px;
            margin: 14px 0;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
            text-align: center;
          }
          .summary-band .s-lbl {
            font-size: 9px;
            text-transform: uppercase;
            color: #64748B;
            font-weight: 700;
          }
          .summary-band .s-val {
            font-size: 15px;
            font-weight: 800;
            font-family: monospace;
            color: #0F172A;
            margin-top: 2px;
          }
          .legend-box {
            background: #FFFFFF;
            border: 1px solid #E2E8F0;
            border-radius: 4px;
            padding: 8px 10px;
            margin: 12px 0;
          }
          .legend-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 6px;
          }
          .footer-section {
            margin-top: 32px;
            border-top: 1px dashed #CBD5E1;
            padding-top: 14px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .sign-col {
            text-align: center;
            width: 170px;
          }
          .sign-line {
            border-top: 1px solid #94A3B8;
            margin-top: 36px;
            padding-top: 4px;
            font-size: 9.5px;
            font-weight: bold;
            color: #334155;
          }
        </style>
      </head>
      <body>
        <div class="header-box">
          <div>
            <div class="uni-name">Bidyapith University</div>
            <div class="uni-sub">Office of the Registrar & Controller of Examinations</div>
            <div style="font-size: 10px; color: #475569; margin-top: 2px;">
              Purbachal Academic Enclave, Dhaka 1229 · registrar@bidyapith.edu
            </div>
          </div>
          <div style="text-align: right;">
            <div class="transcript-badge">OFFICIAL ACADEMIC TRANSCRIPT</div>
            <h3 style="margin: 4px 0 2px; font-size: 13px; text-transform: uppercase;">Transcript of Record</h3>
            <div style="font-size: 9.5px; font-family: monospace; color: #64748B;">Transcript Ref: ${data.transcriptNumber}</div>
          </div>
        </div>

        <div class="grid-2">
          <div class="card">
            <h4>Student Identification</h4>
            <div class="row"><span class="lbl">Student Name:</span> <span class="val">${data.studentName}</span></div>
            <div class="row"><span class="lbl">Student ID:</span> <span class="val" style="font-family: monospace; color: #0F766E;">${data.studentId}</span></div>
            <div class="row"><span class="lbl">Program of Study:</span> <span class="val">${data.programTitle}</span></div>
            <div class="row"><span class="lbl">Department:</span> <span class="val">${data.department}</span></div>
          </div>
          <div class="card">
            <h4>Academic Record Audit</h4>
            <div class="row"><span class="lbl">Degree Awarded:</span> <span class="val">${data.degreeType}</span></div>
            <div class="row"><span class="lbl">Medium of Instruction:</span> <span class="val">${data.mediumOfInstruction}</span></div>
            <div class="row"><span class="lbl">Date of Issue:</span> <span class="val">${data.issueDate}</span></div>
            <div class="row"><span class="lbl">Verification Hash:</span> <span class="val" style="font-family: monospace; font-size: 9px;">${data.verificationHash}</span></div>
          </div>
        </div>

        <div class="summary-band">
          <div>
            <div class="s-lbl">Cumulative CGPA</div>
            <div class="s-val" style="color: #0F766E;">${data.cgpa.toFixed(2)}</div>
          </div>
          <div>
            <div class="s-lbl">Credits Completed</div>
            <div class="s-val">${data.creditsCompleted} / ${data.totalDegreeCredits}</div>
          </div>
          <div>
            <div class="s-lbl">Academic Standing</div>
            <div class="s-val" style="font-size: 11px; color: #0F766E;">${data.academicStanding}</div>
          </div>
          <div>
            <div class="s-lbl">Completed Semesters</div>
            <div class="s-val">${data.terms.filter((t) => t.status === "completed").length}</div>
          </div>
        </div>

        <!-- Term by Term Grade Tables -->
        ${termsHtml}

        <!-- Grading Legend -->
        <div class="legend-box">
          <div style="font-size: 9px; font-weight: bold; text-transform: uppercase; color: #475569; margin-bottom: 4px;">
            Standard Academic Grading Scale (UGC Accredited 4.00 Scale)
          </div>
          <div class="legend-grid">
            ${legendHtml}
          </div>
        </div>

        <!-- Signatures -->
        <div class="footer-section">
          <div class="sign-col">
            <div class="sign-line">Prepared & Verified By</div>
          </div>
          <div class="sign-col">
            <div style="font-size: 9px; font-weight: bold; color: #0F766E;">OFFICIAL UNIVERSITY SEAL</div>
            <div class="sign-line">Deputy Controller of Examinations</div>
          </div>
          <div class="sign-col">
            <div class="sign-line">Controller of Examinations</div>
          </div>
        </div>

        <div style="margin-top: 16px; font-size: 8.5px; color: #94A3B8; text-align: center; font-family: monospace;">
          This official document is generated directly from the Bidyapith Academic Records System. Tampering is a punishable offense. Digital Record Hash: ${data.verificationHash}
        </div>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(transcriptHtml);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 400);

    toast.success("Official Academic Transcript PDF opened for printing/download.");
  } catch {
    toast.error("Failed to generate transcript PDF.");
  }
}

/**
 * Generates and downloads a high-resolution PNG image of the Academic Transcript
 */
export function exportTranscriptAsPng(data: OfficialTranscriptData) {
  try {
    const canvas = document.createElement("canvas");
    const width = 1200;
    const height = 1600;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      toast.error("Canvas rendering failed on this browser.");
      return;
    }

    // Background
    ctx.fillStyle = "#0A111E";
    ctx.fillRect(0, 0, width, height);

    // Decorative Borders
    ctx.strokeStyle = "rgba(46, 211, 167, 0.4)";
    ctx.lineWidth = 3;
    ctx.strokeRect(30, 30, width - 60, height - 60);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    // Header Background Accent
    ctx.fillStyle = "rgba(46, 211, 167, 0.07)";
    ctx.fillRect(40, 40, width - 80, 150);

    // University Title
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText("BIDYAPITH UNIVERSITY", 65, 90);

    ctx.fillStyle = "#2ED3A7";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("OFFICE OF THE REGISTRAR & CONTROLLER OF EXAMINATIONS", 65, 120);

    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.font = "12px monospace";
    ctx.fillText(`Official Academic Transcript · Ref: ${data.transcriptNumber} · Date: ${data.issueDate}`, 65, 150);

    // Right Badge
    ctx.fillStyle = "#2ED3A7";
    ctx.fillRect(width - 280, 65, 210, 36);
    ctx.fillStyle = "#0A101D";
    ctx.font = "bold 12px sans-serif";
    ctx.fillText("OFFICIAL TRANSCRIPT", width - 260, 88);

    // Student Info Box
    ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
    ctx.fillRect(60, 215, width - 120, 120);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.strokeRect(60, 215, width - 120, 120);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 15px sans-serif";
    ctx.fillText(`Student: ${data.studentName} (${data.studentId})`, 85, 250);
    ctx.fillText(`Program: ${data.programTitle}`, 85, 280);
    ctx.fillText(`Department: ${data.department}`, 85, 310);

    ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
    ctx.font = "13px monospace";
    ctx.fillText(`Cumulative CGPA: ${data.cgpa.toFixed(2)}`, width - 380, 250);
    ctx.fillText(`Credits Completed: ${data.creditsCompleted} / ${data.totalDegreeCredits}`, width - 380, 280);
    ctx.fillText(`Standing: ${data.academicStanding}`, width - 380, 310);

    // Render Completed Semesters
    let currentY = 360;
    const completedTerms = data.terms.filter((t) => t.status === "completed");

    completedTerms.slice(0, 4).forEach((term) => {
      // Semester Header Banner
      ctx.fillStyle = "rgba(46, 211, 167, 0.15)";
      ctx.fillRect(60, currentY, width - 120, 32);

      ctx.fillStyle = "#2ED3A7";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText(term.semesterTitle.toUpperCase(), 80, currentY + 21);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 12px monospace";
      ctx.fillText(`Term GPA: ${term.gpa.toFixed(2)} (${term.totalCredits} Credits)`, width - 280, currentY + 21);

      currentY += 32;

      // Table Row Header
      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
      ctx.fillRect(60, currentY, width - 120, 24);

      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.font = "10px monospace";
      ctx.fillText("CODE", 80, currentY + 16);
      ctx.fillText("COURSE TITLE", 220, currentY + 16);
      ctx.fillText("CREDITS", 750, currentY + 16);
      ctx.fillText("GRADE", 880, currentY + 16);
      ctx.fillText("POINTS", 1020, currentY + 16);

      currentY += 24;

      // Courses
      term.courses.forEach((c, idx) => {
        ctx.fillStyle = idx % 2 === 0 ? "rgba(255, 255, 255, 0.015)" : "rgba(255, 255, 255, 0.035)";
        ctx.fillRect(60, currentY, width - 120, 32);

        ctx.fillStyle = "#2ED3A7";
        ctx.font = "bold 12px monospace";
        ctx.fillText(c.code, 80, currentY + 21);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "12px sans-serif";
        ctx.fillText(c.title.length > 40 ? `${c.title.substring(0, 38)}...` : c.title, 220, currentY + 21);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "12px monospace";
        ctx.fillText(String(c.credits), 765, currentY + 21);

        ctx.fillStyle = "#2ED3A7";
        ctx.font = "bold 12px monospace";
        ctx.fillText(c.grade, 895, currentY + 21);

        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(c.point.toFixed(2), 1030, currentY + 21);

        currentY += 32;
      });

      currentY += 16;
    });

    // Signatures
    currentY = Math.max(currentY + 20, 1420);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.lineWidth = 1;

    // Prepared By
    ctx.beginPath();
    ctx.moveTo(120, currentY + 30);
    ctx.lineTo(300, currentY + 30);
    ctx.stroke();
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.font = "11px sans-serif";
    ctx.fillText("Prepared & Verified By", 150, currentY + 48);

    // University Seal
    ctx.beginPath();
    ctx.moveTo(width / 2 - 90, currentY + 30);
    ctx.lineTo(width / 2 + 90, currentY + 30);
    ctx.stroke();
    ctx.fillStyle = "#2ED3A7";
    ctx.fillText("✓ SEAL CERTIFIED", width / 2 - 50, currentY + 48);

    // Controller
    ctx.beginPath();
    ctx.moveTo(width - 300, currentY + 30);
    ctx.lineTo(width - 120, currentY + 30);
    ctx.stroke();
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.fillText("Controller of Examinations", width - 290, currentY + 48);

    // Download PNG
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `Official_Academic_Transcript_${data.studentId}_${data.studentName.replace(/\s+/g, "_")}.png`;
    link.href = dataUrl;
    link.click();

    toast.success("Official Academic Transcript PNG downloaded successfully!");
  } catch {
    toast.error("Failed to generate transcript PNG.");
  }
}
