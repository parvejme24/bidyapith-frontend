import type { GraduationCertificate } from "@/lib/app-types";

export async function downloadCertificatePng(certificate: GraduationCertificate): Promise<void> {
  const width = 1920;
  const height = 1200;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, "#121936");
  bgGrad.addColorStop(0.5, "#0E152E");
  bgGrad.addColorStop(1, "#0A0F24");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Outer decorative border
  ctx.strokeStyle = "rgba(255, 217, 166, 0.7)";
  ctx.lineWidth = 8;
  ctx.strokeRect(40, 40, width - 80, height - 80);

  // Inner thin border
  ctx.strokeStyle = "rgba(255, 217, 166, 0.3)";
  ctx.lineWidth = 2;
  ctx.strokeRect(55, 55, width - 110, height - 110);

  // Corner brackets
  const cornerSize = 50;
  ctx.strokeStyle = "#FFD9A6";
  ctx.lineWidth = 5;

  // Top-Left
  ctx.beginPath();
  ctx.moveTo(35, 35 + cornerSize);
  ctx.lineTo(35, 35);
  ctx.lineTo(35 + cornerSize, 35);
  ctx.stroke();

  // Top-Right
  ctx.beginPath();
  ctx.moveTo(width - 35 - cornerSize, 35);
  ctx.lineTo(width - 35, 35);
  ctx.lineTo(width - 35, 35 + cornerSize);
  ctx.stroke();

  // Bottom-Left
  ctx.beginPath();
  ctx.moveTo(35, height - 35 - cornerSize);
  ctx.lineTo(35, height - 35);
  ctx.lineTo(35 + cornerSize, height - 35);
  ctx.stroke();

  // Bottom-Right
  ctx.beginPath();
  ctx.moveTo(width - 35 - cornerSize, height - 35);
  ctx.lineTo(width - 35, height - 35);
  ctx.lineTo(width - 35, height - 35 - cornerSize);
  ctx.stroke();

  // Center crest icon & University header
  ctx.textAlign = "center";

  // University Crest circle
  const crestX = width / 2;
  const crestY = 140;
  const crestGrad = ctx.createLinearGradient(crestX - 40, crestY - 40, crestX + 40, crestY + 40);
  crestGrad.addColorStop(0, "#FFD9A6");
  crestGrad.addColorStop(0.5, "#FFB454");
  crestGrad.addColorStop(1, "#C98A2C");
  ctx.fillStyle = crestGrad;
  ctx.beginPath();
  ctx.arc(crestX, crestY, 42, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#0A0F24";
  ctx.beginPath();
  ctx.arc(crestX, crestY, 36, 0, Math.PI * 2);
  ctx.fill();

  // Crest Symbol
  ctx.fillStyle = "#FFD9A6";
  ctx.font = "bold 36px sans-serif";
  ctx.fillText("🎓", crestX, crestY + 12);

  // University Name
  ctx.fillStyle = "#F8FAFC";
  ctx.font = "bold 44px sans-serif";
  ctx.fillText("BIDYAPITH OPEN UNIVERSITY", width / 2, 235);

  ctx.fillStyle = "#FFD9A6";
  ctx.font = "600 18px sans-serif";
  ctx.fillText("DHAKA, BANGLADESH · ESTABLISHED 1998", width / 2, 270);

  // Decorative divider line
  const lineGrad = ctx.createLinearGradient(width / 2 - 200, 0, width / 2 + 200, 0);
  lineGrad.addColorStop(0, "transparent");
  lineGrad.addColorStop(0.5, "#FFD9A6");
  lineGrad.addColorStop(1, "transparent");
  ctx.strokeStyle = lineGrad;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 200, 290);
  ctx.lineTo(width / 2 + 200, 290);
  ctx.stroke();

  // Preamble
  ctx.fillStyle = "#94A3B8";
  ctx.font = "italic 20px serif";
  ctx.fillText("On the recommendation of the Academic Council and by the authority of the Board of Trustees,", width / 2, 350);
  ctx.fillText("is pleased to officially confer upon", width / 2, 385);

  // Student Name
  ctx.fillStyle = "#2ED3A7";
  ctx.font = "bold 58px sans-serif";
  ctx.fillText(certificate.studentName, width / 2, 470);

  // Underline for Student Name
  const nameWidth = ctx.measureText(certificate.studentName).width;
  ctx.strokeStyle = "#FFD9A6";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(width / 2 - nameWidth / 2 - 20, 485);
  ctx.lineTo(width / 2 + nameWidth / 2 + 20, 485);
  ctx.stroke();

  // Student ID
  ctx.fillStyle = "#94A3B8";
  ctx.font = "600 20px monospace";
  ctx.fillText(`Student ID: ${certificate.studentId}`, width / 2, 525);

  ctx.fillStyle = "#94A3B8";
  ctx.font = "italic 20px serif";
  ctx.fillText("the degree of", width / 2, 575);

  // Program / Degree Title
  ctx.fillStyle = "#FFD9A6";
  ctx.font = "bold 40px sans-serif";
  ctx.fillText(certificate.programTitle, width / 2, 635);

  // Honors & CGPA badge
  ctx.fillStyle = "#38BDF8";
  ctx.font = "bold 22px sans-serif";
  ctx.fillText(`with ${certificate.honors} (Cumulative CGPA: ${certificate.cgpa.toFixed(2)})`, width / 2, 680);

  // Curriculum completion summary
  ctx.fillStyle = "#CBD5E1";
  ctx.font = "18px sans-serif";
  ctx.fillText(
    `Having successfully completed all prescribed curricula, laboratory practica, examinations, and academic requirements comprising ${certificate.creditsCompleted} semester credits.`,
    width / 2,
    740
  );

  // Signatures Line
  const sigY = 930;

  // Registrar Signature (Left)
  ctx.fillStyle = "#E2E8F0";
  ctx.font = "italic 24px serif";
  ctx.fillText(certificate.registrarName, 320, sigY);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(200, sigY + 12);
  ctx.lineTo(440, sigY + 12);
  ctx.stroke();
  ctx.fillStyle = "#94A3B8";
  ctx.font = "bold 16px sans-serif";
  ctx.fillText("REGISTRAR", 320, sigY + 36);

  // Official Gold Seal (Center)
  const sealX = width / 2;
  const sealY = sigY + 10;
  ctx.fillStyle = "rgba(255, 217, 166, 0.15)";
  ctx.strokeStyle = "#FFD9A6";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(sealX, sealY, 55, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#FFD9A6";
  ctx.font = "32px sans-serif";
  ctx.fillText("👑", sealX, sealY - 10);
  ctx.font = "bold 13px sans-serif";
  ctx.fillText("OFFICIAL SEAL", sealX, sealY + 16);
  ctx.fillStyle = "#94A3B8";
  ctx.font = "12px monospace";
  ctx.fillText(certificate.graduationDate, sealX, sealY + 34);

  // Vice Chancellor Signature (Right)
  ctx.fillStyle = "#E2E8F0";
  ctx.font = "italic 24px serif";
  ctx.fillText(certificate.chancellorName, width - 320, sigY);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(width - 440, sigY + 12);
  ctx.lineTo(width - 200, sigY + 12);
  ctx.stroke();
  ctx.fillStyle = "#94A3B8";
  ctx.font = "bold 16px sans-serif";
  ctx.fillText("VICE CHANCELLOR", width - 320, sigY + 36);

  // Verification Strip at Bottom
  ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
  ctx.fillRect(80, height - 110, width - 160, 45);

  ctx.fillStyle = "#64748B";
  ctx.font = "14px monospace";
  ctx.textAlign = "left";
  ctx.fillText(`Certificate No: ${certificate.certificateNumber}`, 100, height - 82);

  ctx.textAlign = "center";
  ctx.fillText(`Digital Signature: ${certificate.verificationHash.slice(0, 32)}...`, width / 2, height - 82);

  ctx.textAlign = "right";
  ctx.fillText(`Verify: bidyapith.edu/verify/${certificate.certificateNumber}`, width - 100, height - 82);

  // Convert to PNG and download
  const dataUrl = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = `Bidyapith_Certificate_${certificate.studentId}_${certificate.studentName.replace(/\s+/g, "_")}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
