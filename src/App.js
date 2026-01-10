import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

// pages
import Dashboard from "./pages/Dashboard";
import Quartos from "./pages/Quartos";
import Clientes from "./pages/Clientes";
import Reservas from "./pages/Reservas";
import Financeiro from "./pages/Financeiro";
import NotFound from "./pages/NotFound";

import {
  UpdateQuarto,
  UpdateCliente,
  UpdateReserva,
} from "./components/Update";
import { CriarQuarto, CriarCliente, CriarReserva } from "./components/Create";

function App() {
  return (
    <BrowserRouter>
      <div className="main-layout">
        <aside className="sidebar">
          <div className="principal-title">
            <h1>Hotler</h1>
          </div>
          <div className="links">
            <nav>
              <Link to="/">Dashboard</Link>
              <Link to="/quartos">Quartos</Link>
              <Link to="/clientes">Clientes</Link>
              <Link to="/reservas">Reservas</Link>
              <Link to="/financeiro">Financeiro</Link>
            </nav>
          </div>
        </aside>

        <main className="main-content">
          <div className="page">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/quartos" element={<Quartos />} />
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/reservas" element={<Reservas />} />
              <Route path="/financeiro" element={<Financeiro />} />
              <Route path="/quartos/create" element={<CriarQuarto />} />
              <Route path="/clientes/create" element={<CriarCliente />} />
              <Route path="/reservas/create" element={<CriarReserva />} />
              <Route path="/update-quarto/:id" element={<UpdateQuarto />} />
              <Route path="/update-cliente/:id" element={<UpdateCliente />} />
              <Route path="/update-reserva/:id" element={<UpdateReserva />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
