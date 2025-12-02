import { useState } from "react";
import { Container, Row, Col, Spinner, Card, Button } from "react-bootstrap";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { getData } from "../../../core/services/apiService";
import {
  PeopleFill,
  Cash,
  FileEarmarkText,
  Activity,
  FileEarmarkPdfFill
} from "react-bootstrap-icons";
import "./ReportPage.css";
import { processReportData } from "../../../core/utils/flattenObject";
import { exportarAPDF } from "./components/utils";
import ReporteGeneral from "./components/general-report";

// Tipos
interface ReportConfig {
  id: string;
  title: string;
  Icon: any;
  endpoint: string;
  variant: string;
  exclude?: string[];
  rename?: Record<string, string>;
}

const ReportPage = () => {
  // Estados
  const [loadingReport, setLoadingReport] = useState<string | null>(null);

  // Reportes
  const REPORTS: ReportConfig[] = [
    {
      id: "users",
      title: "Reporte de Usuarios",
      Icon: PeopleFill,
      endpoint: "/operator/users-actives",
      variant: "primary",
      exclude: [
        "password",
        "residenceDto_idLocation",
        "residenceDto_idResidence",
      ],
      rename: {
        idUser: "ID Usuario",
        username: "Usuario",
        firstName: "Nombre",
        lastName: "Apellido",
        phone: "Teléfono",
        status: "Estado",
        dateRegister: "Registro",
        digitalInvoiceAdhered: "Factura digital",
        residenceDto_district: "Distrito",
        residenceDto_street: "Calle",
        residenceDto_number: "Número",
        residenceDto_serialNumber: "Número Serie",
        residenceDto_numberMeter: "Número Medidor",
        residenceDto_idFee: "Tarifa",
      },
    },
    {
      id: "bills",
      title: "Reporte de Facturas",
      Icon: FileEarmarkText,
      endpoint: "/operator/billing-parameter/active",
      variant: "success",
      rename: {
        idBillingParameter: "Id",
        name: "Parámetro",
        description: "Descripción",
        value: "Valor",
        status: "Estado",
        applyCondition: "Condición",
      },
    },
    {
      id: "payments",
      title: "Tarifas Existentes",
      Icon: Cash,
      endpoint: "/operator/fee",
      variant: "warning",
      exclude: ["user_password"],
      rename: {
        idFee: "Id Tarifa",
        name: "Nombre",
        description: "Descripción",
        price: "Precio",
        consumptionMax: " Consumo Máximo",
        surplusChargePerUnit: "Cargo adicional",
      },
    },
    {
      id: "activity",
      title: "Información del Sistema",
      Icon: Activity,
      endpoint: "/info/footer",
      variant: "danger",
      rename: {
        name: "Nombre",
        slogan: "Eslogan",
        province: "Provincia",
        location: "Ubicacion",
        district: "Distrito",
        street: "Calle",
        facebookUrl: "Facebook",
        whatsappUrl: "Whatsapp",
        instagramUrl: "Instagram",
      },
    },
  ];

  // // Funcion para manejar la generación de reportes
  const handleGenerateReport = async (report: ReportConfig) => {
    setLoadingReport(report.id);

    try {
      const data = await getData<any[]>(report.endpoint);
      const processedData = processReportData(data, {
        exclude: report.exclude,
        rename: report.rename,
      });

      // Crea libro y hoja
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(report.title);

      // Configura columnas dinámicamente
      worksheet.columns = Object.keys(processedData[0] || {}).map((key) => ({
        header: key,
        key,
        width: Math.max(key.length + 5, 15),
      }));

      // Estilos del encabezado
      const headerRow = worksheet.getRow(1);
      headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 12 };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "4472C4" },
        };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
          top: { style: "thin", color: { argb: "CCCCCC" } },
          left: { style: "thin", color: { argb: "CCCCCC" } },
          bottom: { style: "thin", color: { argb: "CCCCCC" } },
          right: { style: "thin", color: { argb: "CCCCCC" } },
        };
      });

      //Argega los datos
      processedData.forEach((rowData) => {
        const row = worksheet.addRow(rowData);
        row.eachCell((cell) => {
          cell.alignment = { horizontal: "center", vertical: "middle" };
          cell.border = {
            top: { style: "thin", color: { argb: "DDDDDD" } },
            left: { style: "thin", color: { argb: "DDDDDD" } },
            bottom: { style: "thin", color: { argb: "DDDDDD" } },
            right: { style: "thin", color: { argb: "DDDDDD" } },
          };
        });
      });

      headerRow.height = 22;

      // Descargar archivo
      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(
        new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        `${report.title}_${new Date().toISOString().split("T")[0]}.xlsx`
      );
    } catch (error) {
      console.error("Error generando reporte:", error);
      alert(`Error al generar ${report.title}`);
    } finally {
      setLoadingReport(null);
    }
  };

  // Render
  return (
    <div className="report-page">
      {/* <h1 className="text-center mb-5">Gestión de Reportes</h1> */}
      <Container>        
        <ReporteGeneral />
        <div className="text-center mb-5">
          <Button
            onClick={exportarAPDF}
            variant="danger"
            size="sm"
            className="me-2"
          >
            <FileEarmarkPdfFill className="me-2" />
            Exportar a PDF
          </Button>
        </div>
        
        <Row className="g-4" xs={1} md={2} lg={4} style={{ backgroundColor: "#f8f9fa", padding: "20px" }}>
          {REPORTS.map((report) => (
            <Col key={report.id}>
              <Card
                onClick={() => handleGenerateReport(report)}
                className={`report-card ${report.variant}`}
                data-testid={`report-card-${report.id}`}
              >
                <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                  <report.Icon className="report-icon" />
                  <h3 className="report-title mt-3 text-center">
                    {report.title}
                  </h3>
                  {loadingReport === report.id ? (
                    <Spinner
                      animation="border"
                      variant="light"
                      className="mt-2"
                    />
                  ) : (
                    <span className="report-subtitle mt-2">
                      Descargar Excel
                    </span>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default ReportPage;
