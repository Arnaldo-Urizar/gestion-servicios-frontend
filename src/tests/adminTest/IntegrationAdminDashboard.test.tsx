import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AdminDashboard from "../../admin/features/dashboard/AdminDashboard";
import { describe, it, expect,  } from "vitest";

//renderiza el dashboard con una ruta inicial
const renderAdmin = (initialRoute: string) => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/dashboard/admin/*" element={<AdminDashboard />} />
      </Routes>
    </MemoryRouter>
  );
};

describe("Test de integración — AdminDashboard", () => {

  it("muestra el popover al hacer clic en Web", () => {
    renderAdmin("/dashboard/admin/workers");

    // El popover no está visible inicialmente
    expect(screen.queryByText("Preguntas frecuentes")).not.toBeInTheDocument();

    // Click en Web
    fireEvent.click(screen.getByText("Web"));

    //aparece el menú
    expect(screen.getByText("Preguntas frecuentes")).toBeInTheDocument();
    expect(screen.getByText("Funcionalidades")).toBeInTheDocument();
  });

  it("navega al hacer clic en una opción del popover Web", () => {
    renderAdmin("/dashboard/admin/workers");

    // Abrime el popover
    fireEvent.click(screen.getByText("Web"));

    // Asegura que la opción esté visible
    expect(screen.getByText("Funcionalidades")).toBeInTheDocument();

    // Click en una opción del menú
    fireEvent.click(screen.getByText("Funcionalidades"));

    // Valida que la navegación se marcó como activa
    const option = screen.getAllByText("Funcionalidades")[0]; // el primero es el del sidebar
    const link = option.closest("a");

    expect(link).toHaveClass("active");
  });

});