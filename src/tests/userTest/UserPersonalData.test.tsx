import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import UserResume from "../../user/features/resume/UserResume";
import * as apiService from "../../core/services/apiService";

// Mock del hook useAuth
vi.mock("../../hooks/useAuth", () => ({
  default: () => ({ userId: 1 }),
}));

// Mock de la API
vi.spyOn(apiService, "getData").mockImplementation(async (url: string) => {
  if (url.includes("summary")) {
    return {
      userName: "Juan",
      userLastName: "Pérez",
      billsPaid: 5,
      unpaidBills: 2,
      activeModality: "Mensual",
      activePeriod: "2025-12-01T00:00:00",
      activeUnitService: "Unidad 1",
      statusUser: 1,
    };
  }
  if (url.includes("readings")) {
    return [
      { idReading: 1, periodName: "Enero", reading: 100, date: "2025-01-01" },
      { idReading: 2, periodName: "Febrero", reading: 150, date: "2025-02-01" },
    ];
  }
  return [];
});

describe("Componente: UserResume ", () => {
  it("Verifica el estado de carga", () => {
    render(<UserResume />);
    expect(screen.getByText(/CARGANDO/i)).toBeInTheDocument();
  });

  it("Devuelve datos de resumen de usuario despues del fetch", async () => {
    render(<UserResume />);
    
    // Espera que aparezca el nombre completo del usuario
    const heading = await screen.findByText(/Resumen de Juan Pérez/i);
    expect(heading).toBeInTheDocument();

    // Verifica algunas tarjetas
    expect(screen.getByText("Facturas Pagas")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("Facturas Impagas")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("Verifica que el título del gráfico se renderice", async () => {
    render(<UserResume />);
    const chartTitle = await screen.findByText("Historial de Consumo");
    expect(chartTitle).toBeInTheDocument();
  });
});
