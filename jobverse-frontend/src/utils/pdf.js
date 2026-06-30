import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const downloadPDF = async () => {
  const element = document.getElementById("resume-preview");

  if (!element) {
    console.error("Resume element not found");
    return;
  }

  try {
    // 🔥 HIGH QUALITY CANVAS
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      scrollY: -window.scrollY, // fixes cut issue
    });

    const imgData = canvas.toDataURL("image/png");

    // 📄 A4 PDF
    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 210; // A4 width (mm)
    const pageHeight = 297; // A4 height (mm)

    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // 🔥 FIRST PAGE
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // 🔥 ADD EXTRA PAGES IF NEEDED
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;

      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);

      heightLeft -= pageHeight;
    }

    pdf.save("resume.pdf");
  } catch (error) {
    console.error("PDF generation failed:", error);
  }
};
