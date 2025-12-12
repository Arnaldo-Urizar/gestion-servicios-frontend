import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import UserReadingsModal from "../../operator/features/reading/reading-management/UserReadingModal";
import { getData } from "../../core/services/apiService";


vi.mock("../../core/services/apiService", () => ({
  getData: vi.fn(),
  updateData: vi.fn(),
}));


describe("Componente: UserReadingsModal", () => {
  it("muestra lecturas simuladas cuando el modal se abre", async () => {
    // Mock de datos simulados
    (getData as unknown as vi.Mock).mockResolvedValue([
      {
        idReading: 1,
        date: "2024-01-10",
        reading: 150,
      },
      {
        idReading: 2,
        date: "2024-01-12",
        reading: 200,
      },
    ]);

    render(
      <UserReadingsModal
        show={true}
        onHide={() => {}}
        userName="Juan Pérez"
        userId={1}
      />
    );

    // Esperar que se carguen las filas
    expect(await screen.findByText("2024-01-10")).toBeInTheDocument();
    expect(screen.getByText("150")).toBeInTheDocument();

    expect(screen.getByText("2024-01-12")).toBeInTheDocument();
    expect(screen.getByText("200")).toBeInTheDocument();
  });
});