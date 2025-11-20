import html2pdf from "html2pdf.js";

export const exportarAPDF = () => {
  const element = document.getElementById("contenedor-reporte");

  if (!element) {
    console.error(
      "No se encontró el contenedor del reporte (ID: contenedor-reporte)."
    );
    return;
  }

  const opt = {
    margin: 0.5,
    filename: `Reporte_General_Consorcio_${new Date()
      .toISOString()
      .slice(0, 10)}.pdf`,
    image: {
      type: "jpeg" as const,
      quality: 0.95,
    },
    html2canvas: {
      scale: 2,
      logging: true,
      letterRendering: true,
    },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" as const },
  };

  html2pdf().set(opt).from(element).save();
};
