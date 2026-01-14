import PDFDocument from "pdfkit";
import { Response } from "express";

interface CertificateData {
  farmerName: string;
  farmSize: number;
  cropType: string;
  issueDate: Date;
  certificateId: string;
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
    .text("CERTIFICATE OF COMPLIANCE", 0, 100, { align: "center" });

  doc
    .moveDown()
    .fontSize(16)
    .font("Helvetica")
    .fillColor("#166534")
    .text("This is to certify that", { align: "center" });

  doc.moveDown(1.5);

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

  doc.moveDown(1.5);

  doc
    .fontSize(24)
    .font("Helvetica-Bold")
    .fillColor("#15803d")
    .text("Sustainable Farming Practice", { align: "center" });

  doc.moveDown(1.5);

  const leftColX = 200;
  const rightColX = 500;
  const statsY = 380;

  doc
    .fontSize(14)
    .font("Helvetica-Bold")
    .fillColor("#000000")
    .text("Farm Size:", leftColX, statsY)
    .text("Crop Type:", rightColX, statsY);

  doc
    .fontSize(14)
    .font("Helvetica")
    .fillColor("#166534")
    .text(`${data.farmSize} Acres`, leftColX, statsY + 20)
    .text(data.cropType, rightColX, statsY + 20);

  const footerY = 480;
  doc
    .fontSize(12)
    .font("Helvetica")
    .fillColor("#000000")
    .text("Date of Issue:", leftColX, footerY)
    .text("Certificate ID:", rightColX, footerY);

  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text(data.issueDate.toLocaleDateString(), leftColX, footerY + 20)
    .text(data.certificateId, rightColX, footerY + 20);

  const sigY = 450;
  const centerX = doc.page.width / 2;
  
  doc
    .moveTo(centerX - 100, sigY + 90)
    .lineTo(centerX + 100, sigY + 90)
    .strokeColor("#000000")
    .lineWidth(1)
    .stroke();


  doc.end();
};
