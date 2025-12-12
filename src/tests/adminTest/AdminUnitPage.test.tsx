import { render, screen } from "@testing-library/react";
import UnitPage from "../../admin/features/services-units/UnitPage";
import { vi, describe, it, expect } from "vitest";
import { getData } from "../../core/services/apiService";

// Mock de la API 
vi.mock("../../core/services/apiService", () => ({
  getData: vi.fn()
}));

// Mock de useNavigate (para que no navegue realmente)
vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn()
}));

// Mock de componentes externos para evitar renderizados complejos
vi.mock("../../shared/components/table/ReusableTable", () => ({
  __esModule: true,
  default: ({ data }: any) => (
    <div data-testid="mocked-table">
      {data.map((u: any) => (
        <div key={u.idUnit}>{u.name}</div>
      ))}
    </div>
  )
}));

vi.mock("./AddEditUnitModal", () => ({
  __esModule: true,
  default: () => <div data-testid="addedit-modal"></div>
}));

vi.mock("../../shared/components/confirm/ConfirmModal", () => ({
  __esModule: true,
  default: () => <div data-testid="confirm-modal"></div>
}));


describe("Componente: UnitPage", () => {
  it("renderiza la tabla con unidades simuladas", async () => {
    // Simulación de datos
    const fakeUnits = [
      { idUnit: 1, name: "Metro", symbol: "m" },
      { idUnit: 2, name: "Litro", symbol: "L" }
    ];

    // Mock de respuesta de la API
    (getData as unknown as vi.Mock).mockResolvedValue(fakeUnits);

    // Render del componente
    render(<UnitPage />);

    // Se llama a la API una  vez
    expect(getData).toHaveBeenCalledTimes(1);
    expect(getData).toHaveBeenCalledWith("/admin/unities");

    //Espera a que aparezcan los nombres de las unidades
    expect(await screen.findByText("Metro")).toBeInTheDocument();
    expect(await screen.findByText("Litro")).toBeInTheDocument();

    //Verifica que se haya renderizado la tabla mockeada
    expect(screen.getByTestId("mocked-table")).toBeInTheDocument();
  });
});
