import html2canvas from "html2canvas";

export const downloadImage = async (id) => {
  const element = document.getElementById(id);

  if (!element) return;

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
  });

  const link = document.createElement("a");
  link.download = "resume.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
};
