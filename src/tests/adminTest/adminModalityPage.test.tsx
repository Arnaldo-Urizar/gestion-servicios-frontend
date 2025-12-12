// src/tests/adminTest/ModalityPage.test.tsx
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ModalityPage from "../../admin/features/modality/ModalityPage";
import { vi, describe, it, expect } from "vitest";
import { getData, updateData } from "../../core/services/apiService";


// Mock de servicios API
vi.mock("../../core/services/apiService");

// Mock de toast para que no rompa
vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() }
}));

describe("Componente: ModalityPage (Admin)", () => {
  
  it("renderiza la tabla con modalidades simuladas", async () => {
    
    //Datos simulados
    const mockData = [
      { idModality: 1, name: "Manual", active: true },
      { idModality: 2, name: "Automática", active: false }
    ];

    (getData as unknown as vi.Mock).mockResolvedValue(mockData);

    render(<ModalityPage />);

    // Espera a que se llame a la API
    await waitFor(() => {
      expect(getData).toHaveBeenCalledWith("/admin/modalities");
    });

    // Verificar que se renderizan los textos de la tabla
    expect(screen.getByText("Manual")).toBeInTheDocument();
    expect(screen.getByText("Automática")).toBeInTheDocument();
  });

  it("llama updateData cuando se confirma el cambio de estado", async () => {
    const mockData = [{ idModality: 1, name: "Manual", active: true }];

    (getData as unknown as vi.Mock).mockResolvedValue(mockData);
    (updateData as unknown as vi.Mock).mockResolvedValue({});

    render(<ModalityPage />);
    
    // Esperar renderizado
    await waitFor(() => {
      expect(screen.getByText("Manual")).toBeInTheDocument();
    });

    // Obtener el switch (input checkbox)
    const switchElement = screen.getByRole("checkbox");
    fireEvent.click(switchElement);

    expect(screen.getByText("Confirmar Cambio de Estado")).toBeInTheDocument();

    // Click para abrir modal
    fireEvent.click(screen.getByText("Confirmar"));

    await waitFor(() => {
      expect(updateData).toHaveBeenCalledWith(
        "/admin/change-modality",
        1,
        {}
      );
    });
  });

});
