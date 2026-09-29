import type { GraduationCertificate } from "@/lib/app-types";

export function generateCertificateHtml(certificate: GraduationCertificate): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Bidyapith_Certificate_${certificate.studentId}_${certificate.studentName.replace(/\s+/g, "_")}</title>
      <meta charset="utf-8" />
      <style>
        @page {
          size: A4 landscape;
          margin: 0;
        }
        body {
          margin: 0;
          padding: 40px;
          background-color: #0A0F24;
          color: #F8FAFC;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          box-sizing: border-box;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .cert-card {
          position: relative;
          width: 100%;
          max-width: 960px;
          padding: 48px;
          border: 4px solid rgba(255, 217, 166, 0.6);
          border-radius: 20px;
          background: linear-gradient(135deg, #121936 0%, #0E152E 50%, #0A0F24 100%);
          text-align: center;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
          box-sizing: border-box;
        }
        .corner {
          position: absolute;
          width: 40px;
          height: 40px;
          border-color: #FFD9A6;
        }
        .tl { top: 12px; left: 12px; border-top: 3px solid; border-left: 3px solid; border-top-left-radius: 8px; }
        .tr { top: 12px; right: 12px; border-top: 3px solid; border-right: 3px solid; border-top-right-radius: 8px; }
        .bl { bottom: 12px; left: 12px; border-bottom: 3px solid; border-left: 3px solid; border-bottom-left-radius: 8px; }
        .br { bottom: 12px; right: 12px; border-bottom: 3px solid; border-right: 3px solid; border-bottom-right-radius: 8px; }
        .uni-crest {
          width: 64px;
          height: 64px;
          margin: 0 auto 12px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FFD9A6, #FFB454, #C98A2C);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0A0F24;
          font-weight: 900;
          font-size: 24px;
          box-shadow: 0 0 20px rgba(255, 217, 166, 0.4);
        }
        .uni-title {
          font-size: 26px;
          font-weight: 800;
          letter-spacing: 3px;
          color: #FFD9A6;
          text-transform: uppercase;
          margin: 0 0 4px;
        }
        .cert-type {
          font-size: 13px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #94A3B8;
          margin-bottom: 24px;
        }
        .cert-body {
          font-size: 15px;
          color: #CBD5E1;
          margin-bottom: 12px;
        }
        .student-name {
          font-size: 32px;
          font-weight: 800;
          color: #FFFFFF;
          margin: 12px 0;
          text-decoration: underline;
          text-decoration-color: #FFD9A6;
          text-underline-offset: 8px;
        }
        .student-id {
          font-size: 14px;
          font-family: monospace;
          color: #38BDF8;
          margin-bottom: 16px;
        }
        .degree-title {
          font-size: 22px;
          font-weight: 700;
          color: #FFD9A6;
          margin: 12px 0 6px;
        }
        .distinction {
          display: inline-block;
          padding: 4px 16px;
          border-radius: 20px;
          background: rgba(255, 217, 166, 0.15);
          border: 1px solid rgba(255, 217, 166, 0.4);
          color: #FFD9A6;
          font-size: 13px;
          font-weight: 600;
          margin: 12px 0 28px;
        }
        .signatures {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-top: 36px;
          padding-top: 24px;
          border-top: 1px dashed rgba(255, 255, 255, 0.15);
        }
        .sig-block {
          text-align: center;
          width: 200px;
        }
        .sig-line {
          width: 140px;
          height: 1px;
          background-color: #94A3B8;
          margin: 0 auto 6px;
        }
        .sig-title {
          font-size: 11px;
          color: #94A3B8;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .sig-name {
          font-size: 13px;
          font-weight: 600;
          color: #F8FAFC;
        }
        .badge-serial {
          font-family: monospace;
          font-size: 10px;
          color: #64748B;
          margin-top: 24px;
        }
      </style>
    </head>
    <body>
      <div class="cert-card">
        <div class="corner tl"></div>
        <div class="corner tr"></div>
        <div class="corner bl"></div>
        <div class="corner br"></div>

        <div class="uni-crest">🎓</div>
        <h1 class="uni-title">Bidyapith Open University</h1>
        <p class="cert-type">Academic Directorate & Board of Trustees</p>

        <p class="cert-body">This is to officially certify that</p>
        <div class="student-name">${certificate.studentName}</div>
        <div class="student-id">Student ID: ${certificate.studentId}</div>

        <p class="cert-body">has satisfactorily fulfilled all academic requirements for the conferment of the degree of</p>
        <div class="degree-title">${certificate.programTitle}</div>
        <p class="cert-body" style="font-size: 13px; margin: 4px 0 8px;">Degree: ${certificate.degreeType}</p>

        <div class="distinction">Conferred with CGPA ${certificate.cgpa.toFixed(2)} (${certificate.honors})</div>

        <div class="signatures">
          <div class="sig-block">
            <div class="sig-line"></div>
            <div class="sig-name">${certificate.registrarName}</div>
            <div class="sig-title">Registrar</div>
          </div>
          <div class="sig-block">
            <div style="font-size: 32px; margin-bottom: -4px;">👑</div>
            <div style="font-size: 11px; color: #FFD9A6; font-weight: bold; letter-spacing: 2px;">OFFICIAL SEAL</div>
            <div style="font-size: 10px; color: #94A3B8;">Conferred: ${certificate.graduationDate}</div>
          </div>
          <div class="sig-block">
            <div class="sig-line"></div>
            <div class="sig-name">${certificate.chancellorName}</div>
            <div class="sig-title">Vice Chancellor</div>
          </div>
        </div>

        <div class="badge-serial">
          Certificate No: ${certificate.certificateNumber} &bull; Verification Hash: ${certificate.verificationHash}
        </div>
      </div>
      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;
}
