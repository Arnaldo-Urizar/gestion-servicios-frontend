import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DashboardOperator from "../../operator/features/dashboard/OperatorDashboard";
import { describe, test, expect,  } from "vitest";

const renderOperator = (initialRoute = "/dashboard/operator/resume") => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <DashboardOperator />
    </MemoryRouter>
  );
};

describe("Test de integración — OperatorDashboard", () => {
  test("renderiza el sidebar con todas las opciones principales", () => {
    renderOperator();

    expect(screen.getByText("Resumen")).toBeInTheDocument();
    expect(screen.getByText("Usuarios")).toBeInTheDocument();
    expect(screen.getByText("Facturas")).toBeInTheDocument();
    expect(screen.getByText("Lecturas")).toBeInTheDocument();
    expect(screen.getByText("Conceptos")).toBeInTheDocument();
    expect(screen.getByText("Medidores")).toBeInTheDocument();
    expect(screen.getByText("Reportes")).toBeInTheDocument();
  });

  test("abre el popover de Facturas al hacer clic", () => {
    renderOperator();

    fireEvent.click(screen.getByText("Facturas"));

    expect(screen.getByText("Consulta")).toBeInTheDocument();
    expect(screen.getByText("Generación Masiva")).toBeInTheDocument();
    expect(screen.getByText("Generación Individual")).toBeInTheDocument();
  });

  test("abre el popover de Lecturas al hacer clic", () => {
    renderOperator();

    fireEvent.click(screen.getByText("Lecturas"));

    expect(screen.getByText("Gestión de Lecturas")).toBeInTheDocument();
    expect(screen.getByText("Tomar Lecturas")).toBeInTheDocument();
  });

  test("marca 'Usuarios' como activo al navegar", () => {
    renderOperator();

    fireEvent.click(screen.getByText("Usuarios"));

    const usersLink = screen.getByText("Usuarios").closest("a");
    expect(usersLink).toHaveClass("active");
  });
});
