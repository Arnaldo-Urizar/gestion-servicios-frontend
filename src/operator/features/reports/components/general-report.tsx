import { Card, Row, Col, Badge, Spinner } from "react-bootstrap";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  PeopleFill,
  Water,
  CurrencyDollar,
  FileCheck,
} from "react-bootstrap-icons";
import { useEffect, useState } from "react";
import { getData } from "../../../../core/services/apiService";
import { UserDto } from "../../../../core/models/dto/UserDto";
import { FeeDto } from "../../../../core/models/dto/FeeDto";

// --- DATOS ESTÁTICOS DE EJEMPLO ---

const COLORS = ["#0088FE", "#FF8042"];

/**
 * Componente que muestra el Reporte General del Sistema para el Operario.
 * Incluye KPIs, Gráficos y Tablas.
 */
const ReporteGeneral = () => {
  const [fees, setFees] = useState<FeeDto[]>([]);
  const [user, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [, setError] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState<UserDto[]>([]);

  // Función para obtener el resumen de los datos
  useEffect(() => {
    fetchData();
  }, []);

  // Obtener datos de la api
  const fetchData = async () => {
    setLoading(true);
    try {
      // Obtener usuarios
      const users = await getData<UserDto[]>("/operator/users");
      setUsers(users);
      setFilteredData(users);
      // Obtener tarifas
      const feeData = await getData<FeeDto[]>("/operator/fee");
      setFees(feeData);
    } catch (error) {
      console.error(error);
      setError("Error al cargar la información principal");
    } finally {
      setLoading(false);
    }
  };

  const kpiData = [
    {
      label: "Total de Medidores",
      value: user.length,
      icon: Water,
      variant: "primary",
    },
    {
      label: "% Facturas Pagadas",
      value: "89.5%",
      icon: CurrencyDollar,
      variant: "success",
    },
    {
      label: "Usuarios Activos",
      value: user.length,
      icon: PeopleFill,
      variant: "info",
    },
    {
      label: "Monto Adeudado ($)",
      value: "1,250,000",
      icon: FileCheck,
      variant: "danger",
    },
  ];

  const dataTarifa = fees.map((fee) => ({
    name: fee.name,
    consumo:
      fee.consumptionMax *
      filteredData.filter(
        (user) => Number(user.residenceDto.idFee) === fee.idFee
      ).length, // Usando los valores de la API, si son relevantes
    count: filteredData.filter(
      (user) => Number(user.residenceDto.idFee) === fee.idFee
    ).length,
  }));

  const estadoCobranza = [
    { name: "Pagado", value: 9500000 },
    { name: "Pendiente", value: 1250000 },
  ];

  const monthsOrder = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];

  // Agrupar usuarios por el nombre del mes de registro
  const usersByMonth = user.reduce((acc, user) => {
    if (user.dateRegister) {
      try {
        // Crear objeto Date a partir de la cadena "YYYY-MM-DDT..."
        const date = new Date(user.dateRegister);

        // Obtener el nombre del mes (Ene, Feb, etc.)
        const monthIndex = date.getMonth();
        const monthName = monthsOrder[monthIndex];

        if (monthName) {
          acc[monthName] = (acc[monthName] || 0) + 1;
        }
      } catch (e) {
        console.error("Error parsing dateRegister:", user.dateRegister, e);
      }
    }
    return acc;
  }, {} as Record<string, number>);

  // Mapear al DTO final (CrecimientoUsuarioDTO) y ordenar cronológicamente
  const userGrowth = Object.keys(usersByMonth)
    // Ordenar los meses usando el array de referencia (monthsOrder)
    .sort((a, b) => monthsOrder.indexOf(a) - monthsOrder.indexOf(b))
    .map((monthName) => ({
      mes: monthName,
      usuarios: usersByMonth[monthName],
    }));

  {
    if (loading) {
      return (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "400px" }}
        >
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </div>
      );
    }
  }
  return (
    // Contenedor principal para que html2pdf.js lo capture

    <div
      id="contenedor-reporte"
      className="p-4"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <div className="text-center mb-5">
        <h1>Reporte General del Sistema</h1>
        <p className="lead">
          Visión Operativa y Financiera (Generado:{" "}
          {new Date().toLocaleDateString("es-ES")})
        </p>
      </div>

      {/* 1. SECCIÓN DE INDICADORES CLAVE (KPIs) */}
      <h2 className="mb-4 text-primary">📈 Resumen Ejecutivo</h2>
      <Row className="mb-5 g-4">
        {kpiData.map((kpi, index) => (
          <Col md={3} key={index}>
            <Card className={`shadow-sm border-${kpi.variant}`}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <Card.Title
                      className="text-muted text-uppercase"
                      style={{ fontSize: "0.8rem" }}
                    >
                      {kpi.label}
                    </Card.Title>
                    <Card.Text as="h3" className={`text-${kpi.variant}`}>
                      {kpi.value}
                    </Card.Text>
                  </div>
                  <kpi.icon size={30} className={`text-${kpi.variant}`} />
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 2. SECCIÓN DE GRÁFICOS OPERATIVOS Y FINANCIEROS */}
      <h2 className="mb-4 text-primary">📊 Análisis Detallado</h2>
      <Row className="g-4">
        {/* GRÁFICO 1: Consumo por Tarifa */}
        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title>Consumo Promedio por Plan Tarifario</Card.Title>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={dataTarifa}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis
                    label={{
                      value: "Consumo (m³)",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip
                    formatter={(value) => `${value.toLocaleString()} m³`}
                  />
                  <Legend />
                  <Bar dataKey="consumo" fill="#8884d8" name="Consumo Total" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        {/* GRÁFICO 2: Estado de Cobranza */}
        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title>
                Distribución del Estado de Cobranza (Total)
              </Card.Title>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={estadoCobranza}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    fill="#82ca9d"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(1)}%`
                    }
                  >
                    {estadoCobranza.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        {/* GRÁFICO 3: Crecimiento de Usuarios */}
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>
                Crecimiento Mensual de Usuarios Registrados
              </Card.Title>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={userGrowth}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis
                    label={{
                      value: "Nuevos Usuarios",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="usuarios"
                    stroke="#82ca9d"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ESPACIO PARA TABLAS Y DATOS DE Soporte (opcional) */}
      <h2 className="mt-5 mb-4 text-primary">📑 Datos Administrativos</h2>
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title>Distribución de Medidores por Tarifa</Card.Title>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Tarifa</th>
                <th>Cantidad de Medidores</th>
              </tr>
            </thead>
            <tbody>
              {dataTarifa.map((item, index) => (
                <tr key={index}>
                  <td>
                    <Badge bg="secondary">{item.name}</Badge>
                  </td>
                  <td>{item.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ReporteGeneral;
