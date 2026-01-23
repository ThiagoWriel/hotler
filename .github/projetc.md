# Hotler 🏨

**Hotler** é um sistema de gerenciamento hoteleiro (PMS - Property Management System) moderno, desenvolvido para simplificar a administração de pousadas e hotéis. O sistema foca em uma interface intuitiva, estética refinada e eficiência operacional.

## 🚀 Funcionalidades Principais

O sistema é dividido em módulos essenciais para a operação hoteleira:

### 🛏️ Gestão de Quartos

- **Controle Total (CRUD)**: Cadastre, edite e remova quartos.
- **Status em Tempo Real**: Visualize se o quarto está limpo, sujo ou em manutenção.
- **Monitoramento de Ocupação**: Identifique rapidamente quartos ocupados e disponíveis.

### 👥 Gestão de Clientes

- **Cadastro Detalhado**: Registro completo de hóspedes com histórico.
- **Busca e Filtros**: Localize clientes rapidamente pelo nome ou documento.

### 📅 Reservas (Check-in / Check-out)

- **Fluxo de Reservas**: Gerencie entradas e saídas de forma simplificada.
- **Integração**: Conectado ao cadastro de clientes e status dos quartos.

### 💰 Financeiro

- **Visão Geral**: Acompanhamento de receitas e despesas.

### 📊 Dashboard

- **Indicadores**: Visão macro da operação do hotel.

---

## 🛠️ Stack Tecnológico

O projeto utiliza tecnologias modernas para garantir performance e escalabilidade:

- **Frontend**: [Next.js](https://nextjs.org/) (App Router) - Framework React para produção.
- **Backend & Database**: [Supabase](https://supabase.com/) - Banco de dados PostgreSQL com API em tempo real e Autenticação.
- **Estilização**: CSS Moderno (Vanilla com CSS Variables) - Design System personalizado com foco em UX/UI premium.
- **Hospedagem**: Vercel (Recomendado para Next.js).

## 📂 Estrutura do Projeto

Principais diretórios e sua finalidade:

- `src/app`: Rotas e páginas da aplicação (Next.js App Router).
  - `/quartos`: Página de gestão de quartos.
  - `/clientes`: Página de gestão de hóspedes.
  - `/reservas`: Página de reservas.
- `src/components`: Componentes de UI reutilizáveis (Cards, Modais, Botões).
- `src/config`: Configurações globais (ex: Cliente Supabase).
- `.github`: Documentação e workflows do projeto.
