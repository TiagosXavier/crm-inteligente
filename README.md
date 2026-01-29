# CRM Smart

Sistema de CRM (Customer Relationship Management) inteligente construído com React, Vite e Node.js.

## Funcionalidades

- **Dashboard** - Visão geral com métricas, gráficos e KPIs
- **Contatos** - Gerenciamento completo de contatos com filtros e tags
- **Pipeline** - Kanban para acompanhamento de leads por estágio
- **Conversas** - Histórico de conversas com contatos
- **Templates** - Modelos de mensagens por categoria
- **Equipe** - Gerenciamento de usuários e permissões
- **Configurações** - Configurações do sistema e IA

## Tecnologias

### Frontend
- React 18
- Vite
- TailwindCSS
- Radix UI (componentes)
- React Query (gerenciamento de estado)
- React Router DOM
- Recharts (gráficos)

### Backend
- Node.js
- Express
- JSON File Database (desenvolvimento)

## Instalação

```bash
# Clonar o repositório
git clone https://github.com/TiagosXavier/crm-inteligente.git
cd crm-inteligente

# Instalar dependências
npm install
```

## Executando o Projeto

### Desenvolvimento

```bash
# Inicia frontend (porta 5173) e backend (porta 3000) simultaneamente
npm run dev
```

Ou separadamente:

```bash
# Apenas frontend
npm run dev:frontend

# Apenas backend
npm run dev:backend
```

### Build de Produção

```bash
npm run build
npm run preview
```

## Estrutura do Projeto

```
crm-inteligente/
├── server/                 # Backend Node.js
│   ├── index.js           # Servidor Express
│   └── db/                # Database JSON
├── src/
│   ├── api/               # Cliente API e integrações
│   ├── components/        # Componentes React
│   │   ├── ui/           # Componentes base (shadcn/ui)
│   │   ├── layout/       # Header, Sidebar, etc.
│   │   └── dashboard/    # Componentes do dashboard
│   ├── lib/              # Utilitários e contextos
│   ├── pages/            # Páginas da aplicação
│   └── utils/            # Funções auxiliares
├── scripts/              # Scripts de automação
└── public/               # Assets estáticos
```

## API Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/health` | Health check |
| GET | `/api/contacts` | Listar contatos |
| POST | `/api/contacts` | Criar contato |
| PUT | `/api/contacts/:id` | Atualizar contato |
| DELETE | `/api/contacts/:id` | Deletar contato |
| GET | `/api/users` | Listar usuários |
| GET | `/api/templates` | Listar templates |
| GET | `/api/auth/me` | Usuário atual |
| POST | `/api/auth/login` | Login |
| POST | `/api/seed` | Popular banco com dados de teste |

## Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia frontend e backend |
| `npm run dev:frontend` | Inicia apenas o frontend |
| `npm run dev:backend` | Inicia apenas o backend |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build |
| `npm run seed` | Popula o banco com dados fake |
| `npm run lint` | Verifica código com ESLint |

## Populando Dados de Teste

Com o backend rodando, execute:

```bash
npm run seed
```

Isso criará:
- 50 contatos
- 4 usuários
- 5 templates
- 30 conversas
- 40 tarefas

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz:

```env
# URL da API (padrão: http://localhost:3000/api)
VITE_API_URL=http://localhost:3000/api
```

## Licença

Este projeto é privado.
