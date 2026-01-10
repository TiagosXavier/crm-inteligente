# 🎭 Sistema de Dados Mockados

Este projeto inclui um sistema completo de dados mockados para desenvolvimento local sem necessidade de configurar o Base44.

## 🚀 Como Funciona

O sistema detecta automaticamente se as credenciais do Base44 estão configuradas:

- **✅ Com Base44 configurado**: Usa o SDK real do Base44
- **🎭 Sem Base44**: Usa dados mockados armazenados no `localStorage` do navegador

## 📦 Dados Mockados Incluídos

Quando você inicia a aplicação em modo de desenvolvimento sem credenciais do Base44, o sistema gera automaticamente:

### Contatos (50)
- Nome completo brasileiro
- Telefone com DDD (formato: (XX) 9XXXX-XXXX)
- Email válido
- CPF formatado (50% dos contatos)
- Empresa (70% dos contatos)
- Status/Stage: novo, em_atendimento, aguardando, resolvido, escalado
- Tags variadas: VIP, Urgente, Follow-up, etc.
- Notas descritivas (60% dos contatos)
- Datas realistas

### Conversas (30)
- Vinculadas a contatos
- Última mensagem mockada
- Contador de mensagens não lidas
- Status: ativo, arquivado, aguardando

### Tarefas (40)
- Vinculadas a contatos
- Tipos: Ligar, Email, Reunião, Follow-up, Proposta, Demonstração
- Prioridades: baixa, média, alta, urgente
- Algumas tarefas já concluídas (30%)

### Usuários/Team (5)
- Membros da equipe com nomes e emails
- Roles variados
- Status online/offline

### Templates (10)
- Templates de mensagens
- Categorias diversas
- Contador de uso

## 🔧 Uso em Desenvolvimento

### Iniciar com dados mockados

Simplesmente inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Se as variáveis `VITE_BASE44_APP_ID` e `VITE_BASE44_BACKEND_URL` não estiverem configuradas, você verá:

```
⚠️  Base44 credentials not configured - using mock data
💡 To use real Base44, configure VITE_BASE44_APP_ID and VITE_BASE44_BACKEND_URL in .env
🎭 Using Mock Base44 Client (local data)
💡 Data is stored in localStorage
🔧 To clear mock data: localStorage.clear()
```

### Limpar dados mockados

No console do navegador (F12):

```javascript
// Limpar todos os dados
localStorage.clear()

// Ou apenas os dados mockados
localStorage.removeItem('mock_contacts')
localStorage.removeItem('mock_conversations')
localStorage.removeItem('mock_tasks')
localStorage.removeItem('mock_users')
localStorage.removeItem('mock_templates')
localStorage.removeItem('crm_mock_data_initialized')
```

### Forçar regeneração dos dados

No console do navegador:

```javascript
// Importar a função
import { initializeMockData } from '@/lib/mockData'

// Regenerar dados
initializeMockData(true) // force = true

// Recarregar a página
location.reload()
```

## 🔄 Operações CRUD

O mock client suporta todas as operações do Base44 SDK:

```javascript
// Listar
await base44.entities.Contact.list('-created_date')

// Buscar por ID
await base44.entities.Contact.get(id)

// Criar
await base44.entities.Contact.create({ name: 'João', phone: '(11) 99999-9999' })

// Atualizar
await base44.entities.Contact.update(id, { name: 'João Silva' })

// Deletar
await base44.entities.Contact.delete(id)

// Query com filtros
await base44.entities.Contact.query({ status: 'novo' })
```

## 🌐 Configurar Base44 Real

Para usar o Base44 real em vez de dados mockados, crie/edite o arquivo `.env`:

```env
VITE_BASE44_APP_ID=seu-app-id-aqui
VITE_BASE44_BACKEND_URL=https://sua-url.base44.com
VITE_BASE44_FUNCTIONS_VERSION=v1
VITE_BASE44_TOKEN=opcional
```

## 📁 Arquivos do Sistema

- `src/lib/mockData.js` - Geração de dados mockados
- `src/api/mockBase44Client.js` - Cliente mock que simula Base44 SDK
- `src/api/base44Client.js` - Cliente que escolhe entre real/mock automaticamente

## 💡 Vantagens

✅ **Desenvolvimento offline** - Não precisa de internet ou credenciais
✅ **Dados consistentes** - Seed fixo garante mesmos dados sempre
✅ **CRUD completo** - Todas operações funcionam como no Base44 real
✅ **Sem configuração** - Funciona out-of-the-box
✅ **Dados brasileiros** - CPF, telefones e nomes realistas
✅ **Transição suave** - Só configurar .env para usar Base44 real

## 🐛 Troubleshooting

### "Não vejo dados na interface"

1. Abra o console (F12) e veja se há mensagens de erro
2. Verifique se vê a mensagem "Using Mock Base44 Client"
3. Limpe o localStorage e recarregue a página
4. Verifique se o dev server está rodando

### "Quero dados diferentes"

Edite `src/lib/mockData.js` e altere:
- `faker.seed(123)` para outro número (dados aleatórios diferentes)
- Quantidade de registros nas funções `generate*`
- Campos e valores dos objetos mockados

### "Erro ao criar/editar dados"

Os dados são salvos no `localStorage`. Se estiver cheio:
```javascript
localStorage.clear()
location.reload()
```
