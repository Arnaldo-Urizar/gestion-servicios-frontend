import { describe, test, expect,  } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";


import UserDashboard from "../../user/features/dashboard/UserDashboard";
import { AuthProvider } from "../../context/AuthContext";

// renderiza todo el entorno real
const renderIntegration = (initialRoute = "/dashboard/user/resume") => {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[initialRoute]}>
        <UserDashboard />
      </MemoryRouter>
    </AuthProvider>
  );
};

describe("Test de integración — UserDashboard", () => {
  test("renderiza el sidebar con todas las opciones del menú", () => {
    renderIntegration();

    expect(screen.getByText("Resumen")).toBeInTheDocument();
    expect(screen.getByText("Facturas")).toBeInTheDocument();
    expect(screen.getByText("Consumos")).toBeInTheDocument();
    expect(screen.getByText("Mis Datos")).toBeInTheDocument();
  });

  test("activa correctamente la sección 'Facturas' al hacer clic", () => {
    renderIntegration();

    fireEvent.click(screen.getByText("Facturas"));

    const facturasLink = screen.getByText("Facturas").closest("a");
    expect(facturasLink).toHaveClass("active");
  });

  test("activa correctamente la sección 'Consumos'", () => {
    renderIntegration();

    fireEvent.click(screen.getByText("Consumos"));

    const consumosLink = screen.getByText("Consumos").closest("a");
    expect(consumosLink).toHaveClass("active");
  });

  test("activa correctamente la sección 'Mis Datos'", () => {
    renderIntegration();

    fireEvent.click(screen.getByText("Mis Datos"));

    const datosLink = screen.getByText("Mis Datos").closest("a");
    expect(datosLink).toHaveClass("active");
  });
});