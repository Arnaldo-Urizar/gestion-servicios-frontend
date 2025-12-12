import { render, screen, waitFor } from "@testing-library/react";
import Resume from "../../operator/features/resume/Resume";
import { vi, describe, it, expect } from "vitest";
import { getData } from "../../core/services/apiService";

// Mock del servicio API
vi.mock("../../core/services/apiService");

describe("Componente: Resume (Operador)", () => {
  it("muestra las tarjetas con datos simulados", async () => {
    // Datos simulados
    const mockResume = {
      activeUsers: 10,
      inactiveUsers: 2,
      billsPaid: 5,
      unpaidBills: 3,
      fullReadings: 20,
      incompleteReadings: 4,
      activeModality: "Manual",
      dateActivePeriod: "2025-05-12",
      activeUnitService: "m³ por unidad",
      usersForFee: [
        { fee: "A", count: 12 },
        { fee: "B", count: 7 },
      ],
    };

    // Mock de getData
    (getData as unknown as vi.Mock).mockResolvedValue(mockResume);

    render(<Resume />);

    // Espera a que se rendericen las tarjetas con los datos simulados
    await waitFor(() => {
      expect(screen.getByText("Usuarios Activos")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();

      expect(screen.getByText("Usuarios Inactivos")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();

      expect(screen.getByText("Facturas Pagas")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();

      expect(screen.getByText("Facturas Impagas")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();

      expect(screen.getByText("Total de Lecturas")).toBeInTheDocument();
      expect(screen.getByText("20")).toBeInTheDocument();
    });
  });

  it("llama correctamente a la API al montar el componente", async () => {
    (getData as unknown as vi.Mock).mockResolvedValue({
      activeUsers: 1,
      inactiveUsers: 0,
    });

    render(<Resume />);

    await waitFor(() => {
      expect(getData).toHaveBeenCalledTimes(1);
      expect(getData).toHaveBeenCalledWith("/operator/resume-supplier");
    });
  });
});