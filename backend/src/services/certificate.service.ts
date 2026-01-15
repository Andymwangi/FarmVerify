import PDFDocument from "pdfkit";
import { Response } from "express";

interface CertificateData {
  farmerName: string;
  farmSize: number;
  cropType: string;
  issueDate: Date;
  certificateId: string;
  locationAddress?: string;
  latitude?: number;
  longitude?: number;
}

export const generateCertificate = (data: CertificateData, res: Response) => {
  const doc = new PDFDocument({
    layout: "landscape",
    size: "A4",
    margin: 50,
    autoAddPages: false,
  } as any);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=certificate-${data.certificateId}.pdf`
  );

  doc.pipe(res);

  doc.rect(0, 0, doc.page.width, doc.page.height).fill("#f0fdf4");
  doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).strokeColor("#166534").lineWidth(5).stroke();
  doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60).strokeColor("#22c55e").lineWidth(2).stroke();

  doc
    .fontSize(40)
    .font("Helvetica-Bold")
    .fillColor("#14532d")
    .text("CERTIFICATE OF COMPLIANCE", 0, 80, { align: "center" });

  doc
    .moveDown()
    .fontSize(16)
    .font("Helvetica")
    .fillColor("#166534")
    .text("This is to certify that", { align: "center" });

  doc.moveDown(1);

  doc
    .fontSize(32)
    .font("Helvetica-Bold")
    .fillColor("#000000")
    .text(data.farmerName, { align: "center" });

  doc.moveDown(0.5);

  doc
    .fontSize(16)
    .font("Helvetica")
    .fillColor("#166534")
    .text("has successfully met all standards and requirements for", { align: "center" });

  doc.moveDown(1);

  doc
    .fontSize(24)
    .font("Helvetica-Bold")
    .fillColor("#15803d")
    .text("Sustainable Farming Practice", { align: "center" });

  doc.moveDown(1);

  // Farm Details Section
  const leftColX = 150;
  const centerColX = 350;
  const rightColX = 550;
  const statsY = 340;

  doc
    .fontSize(14)
    .font("Helvetica-Bold")
    .fillColor("#000000")
    .text("Farm Size:", leftColX, statsY)
    .text("Crop Type:", centerColX, statsY)
    .text("Location:", rightColX, statsY);

  doc
    .fontSize(14)
    .font("Helvetica")
    .fillColor("#166534")
    .text(`${data.farmSize} Acres`, leftColX, statsY + 18)
    .text(data.cropType, centerColX, statsY + 18);

  // Location Display
  if (data.locationAddress) {
    doc
      .fontSize(12)
      .font("Helvetica")
      .fillColor("#166534")
      .text(data.locationAddress, rightColX, statsY + 18, { width: 180 });
  } else if (data.latitude && data.longitude) {
    doc
      .fontSize(12)
      .font("Helvetica")
      .fillColor("#166534")
      .text(`${data.latitude.toFixed(4)}, ${data.longitude.toFixed(4)}`, rightColX, statsY + 18);
  } else {
    doc
      .fontSize(12)
      .font("Helvetica")
      .fillColor("#666666")
      .text("Not specified", rightColX, statsY + 18);
  }

  // GPS Coordinates (if available)
  if (data.latitude && data.longitude && data.locationAddress) {
    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor("#888888")
      .text(`GPS: ${data.latitude.toFixed(6)}, ${data.longitude.toFixed(6)}`, rightColX, statsY + 50, { width: 180 });
  }

  // Footer Section
  const footerY = 440;
  doc
    .fontSize(12)
    .font("Helvetica")
    .fillColor("#000000")
    .text("Date of Issue:", leftColX, footerY)
    .text("Certificate ID:", centerColX, footerY);

  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text(data.issueDate.toLocaleDateString(), leftColX, footerY + 18)
    .text(data.certificateId, centerColX, footerY + 18);

  // Signature Line
  const sigY = 480;
  const sigCenterX = doc.page.width / 2;
  
  doc
    .moveTo(sigCenterX - 100, sigY)
    .lineTo(sigCenterX + 100, sigY)
    .strokeColor("#000000")
    .lineWidth(1)
    .stroke();

  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor("#666666")
    .text("Authorized Signature", sigCenterX - 50, sigY + 5);

  doc.end();
};
