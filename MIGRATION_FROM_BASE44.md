# 🚀 Migração do Base44 para Backend Próprio

## ✅ O Que Foi Feito

Este projeto foi **completamente desvinculado do Base44** e agora usa um backend Node.js próprio com Express.

### **Removido:**
- ❌ `@base44/sdk` - SDK do Base44
- ❌ `@base44/vite-plugin` - Plugin do Vite
- ❌ Dependência de credenciais Base44
- ❌ Necessidade de configurar App ID e Backend URL
- ❌ app-params.js (não é mais necessário)

### **Adicionado:**
- ✅ Backend Node.js/Express próprio (`server/index.js`)
- ✅ API REST completa (CRUD para todas as entidades)
- ✅ Cliente de API próprio (`src/api/apiClient.js`)
- ✅ Banco de dados JSON (arquivo local)
- ✅ Script de seed para backend (`scripts/seedBackend.js`)
- ✅ Proxy do Vite para desenvolvimento

---

## 🏗️ Nova Arquitetura

```
Frontend (React + Vite)
    ↓
API Client (apiClient.js)
    ↓
Backend (Node.js + Express)
    ↓
Database (JSON file)
```

### **Fluxo de Dados:**

1. **Frontend** faz requisição via `api.entities.Contact.list()`
2. **API Client** converte para `fetch('/api/contacts')`
3. **Backend** processa e retorna dados do `database.json`
4. **Frontend** recebe e exibe os dados

---

## 📂 Estrutura de Arquivos

### **Backend:**
```
server/
├── index.js          # Servidor Express com todas as rotas
└── db/
    └── database.json # Banco de dados (criado automaticamente)
```

### **Frontend:**
```
src/api/
├── apiClient.js      # Cliente de API próprio (substitui Base44 SDK)
├── base44Client.js   # Compatibilidade (importa apiClient)
├── mockBase44Client.js # PODE SER REMOVIDO (não é mais necessário)
└── mockData.js       # PODE SER REMOVIDO (usar seedBackend agora)
```

---

## 🚀 Como Usar

### **1. Iniciar o Backend:**

```bash
# Terminal 1 - Backend
npm run dev:backend
```

Você verá:
```
🚀 Backend server running on http://localhost:3000
📦 Database: server/db/database.json
✅ API ready at http://localhost:3000/api
```

### **2. Popular com Dados Mockados:**

```bash
# Terminal 2 - Seed
npm run seed
```

Você verá:
```
🌱 Iniciando seed do backend...
✅ Backend conectado
📊 Gerando dados mockados...
   • 50 contatos
   • 30 conversas
   • 40 tarefas
   • 5 usuários
   • 10 templates
✅ Seed concluído com sucesso!
```

### **3. Iniciar o Frontend:**

```bash
# Terminal 3 - Frontend
npm run dev:frontend
```

**OU iniciar ambos juntos:**

```bash
npm run dev
```

---

## 🔌 Rotas da API

### **Health Check:**
```
GET /api/health
```

### **Contacts:**
```
GET    /api/contacts        # Listar todos
GET    /api/contacts/:id    # Buscar por ID
POST   /api/contacts        # Criar novo
PUT    /api/contacts/:id    # Atualizar
DELETE /api/contacts/:id    # Deletar
```

### **Conversations, Tasks, Users, Templates:**
Mesma estrutura das rotas de contacts

### **Seed:**
```
POST /api/seed
Body: { contacts: [], conversations: [], tasks: [], users: [], templates: [] }
```

---

## 💻 Como o Código Funciona

### **No Frontend (não precisa mudar nada!):**

```javascript
// Antes (com Base44):
import { base44 } from '@/api/base44Client';
const contacts = await base44.entities.Contact.list();

// Depois (sem Base44 - mesmo código!):
import { base44 } from '@/api/base44Client';
const contacts = await base44.entities.Contact.list(); // Funciona igual!
```

O código do frontend **não precisa ser alterado** porque mantivemos a mesma interface!

### **No Backend:**

```javascript
// Exemplo de rota
app.get('/api/contacts', async (req, res) => {
  const db = await readDB();
  res.json(db.contacts);
});
```

---

## 🗄️ Banco de Dados

### **JSON File:**
- Localização: `server/db/database.json`
- Estrutura:
```json
{
  "contacts": [...],
  "conversations": [...],
  "tasks": [...],
  "users": [...],
  "templates": [...]
}
```

### **Migrar para Banco Real (futuro):**

Trocar `readDB()` e `writeDB()` por:
- MongoDB
- PostgreSQL
- MySQL
- Qualquer outro banco

---

## 🌐 Deploy no Vercel

### **Backend:**

1. Crie um projeto separado no Vercel para o backend
2. Configure variável de ambiente:
   ```
   NODE_ENV=production
   ```
3. Deploy da pasta `server/`

### **Frontend:**

1. Configure variável no Vercel:
   ```
   VITE_API_URL=https://seu-backend.vercel.app/api
   ```
2. Deploy normal do frontend

---

## ⚙️ Variáveis de Ambiente

### **Antes (Base44):**
```env
VITE_BASE44_APP_ID=app_123
VITE_BASE44_BACKEND_URL=https://api.base44.com
VITE_BASE44_FUNCTIONS_VERSION=v1
VITE_BASE44_TOKEN=token
```

### **Depois (Backend Próprio):**
```env
VITE_API_URL=http://localhost:3000/api
```

Só isso! 🎉

---

## 📝 Arquivos que PODEM ser Removidos

Após a migração estar 100% funcional:

```bash
# Não são mais necessários:
rm src/api/mockBase44Client.js
rm src/lib/app-params.js
rm VERCEL_SETUP.md          # Documentação antiga do Base44
rm ENV_VARIABLES.md          # Variáveis antigas do Base44

# Opcionalmente:
rm scripts/seed.js           # Usar seedBackend.js agora
```

---

## 🐛 Troubleshooting

### **"Backend não está rodando"**
```bash
npm run dev:backend
```

### **"Sem dados no frontend"**
```bash
npm run seed
```

### **"Erro ao fazer seed"**
1. Verifique se o backend está rodando
2. Delete `server/db/database.json`
3. Rode `npm run seed` novamente

### **"CORS error"**
O backend já tem CORS habilitado. Se ainda ocorrer, verifique se:
1. Backend está na porta 3000
2. Frontend está acessando `http://localhost:3000/api`

---

## ✅ Checklist de Verificação

- [ ] Backend iniciado (`npm run dev:backend`)
- [ ] Seed executado (`npm run seed`)
- [ ] Frontend carrega sem erros
- [ ] Consegue ver 50 contatos na página de Contatos
- [ ] Consegue criar novo contato
- [ ] Consegue editar contato
- [ ] Consegue deletar contato
- [ ] Dashboard mostra dados
- [ ] Pipeline funciona

---

## 🎉 Benefícios da Migração

✅ **Controle Total** - Você controla 100% do backend
✅ **Sem Dependências Externas** - Não depende de serviços terceiros
✅ **Mais Simples** - Menos configuração
✅ **Customizável** - Adicione qualquer funcionalidade
✅ **Gratuito** - Sem custos de API externa
✅ **Deploy Flexível** - Hospede onde quiser

---

## 📖 Próximos Passos

1. ✅ Remover código antigo do Base44
2. 🔄 Migrar de JSON para banco de dados real
3. 🔐 Adicionar autenticação
4. 📱 Criar API mobile
5. 🚀 Deploy em produção

---

**Pronto! Seu CRM agora é 100% independente do Base44** 🎉
