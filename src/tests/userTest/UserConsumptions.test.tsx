import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import UserConsumptions from "../../user/features/consumptions/UserConsumptions";
import * as apiService from "../../core/services/apiService";

// Mock del hook useAuth
vi.mock("../../hooks/useAuth", () => ({
  default: () => ({ userId: 1 }),
}));

// Mock de la API con datos simulados
vi.spyOn(apiService, "getData").mockImplementation(async (url: string) => {
  if (url.includes("readings")) {
    return [
      { idReading: 1, periodName: "Enero", reading: 100, date: "2025-01-01" },
      { idReading: 2, periodName: "Febrero", reading: 150, date: "2025-02-01" },
    ];
  }
  return [];
});

describe("Componenete: UserConsumptions ", () => {
  it("Renderiza la tabla de consumo con datos", async () => {
    render(<UserConsumptions />);

    // Espera a que aparezca el título de la página
    const heading = await screen.findByText(/Historial de Consumos/i);
    expect(heading).toBeInTheDocument();

    // Verifica que se rendericen los periodos
    const firstPeriod = await screen.findByText("Enero");
    const secondPeriod = await screen.findByText("Febrero");
    expect(firstPeriod).toBeInTheDocument();
    expect(secondPeriod).toBeInTheDocument();

    // Verifica los consumos reales usando findAllByText
    const allReadings100 = await screen.findAllByText("100"); // hay dos 100, tomamos el último
    expect(allReadings100[allReadings100.length - 1]).toBeInTheDocument(); // consumo real de la primera fila

    const allReadings50 = await screen.findAllByText("50");
    expect(allReadings50[0]).toBeInTheDocument(); // consumo real de la segunda fila
  });
});
