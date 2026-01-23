import Link from "next/link";

export default function NotFound() {
  return (
    <div className="not-found">
      <h2>Página não encontrada</h2>
      <p>A página que você está procurando não existe.</p>
      <Link href="/">Voltar para a Dashboard</Link>
    </div>
  );
}
