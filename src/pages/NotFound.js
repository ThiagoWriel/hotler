import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="not-found">
      <h2>404 - Página não encontrada</h2>
      <Link to="/">Voltar para a página inicial</Link>
    </div>
  );
};

export default NotFound;
