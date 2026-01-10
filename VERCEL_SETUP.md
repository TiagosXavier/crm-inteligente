# 🚀 Configuração do Vercel - Variáveis de Ambiente

## ⚠️ Problema Identificado

Se você está vendo:
- **Tela preta** no deploy
- **Erro 405** (Method Not Allowed)
- **URLs com 'null'** nas requisições da API
- Console mostrando: `https://null/api/...`

**Causa:** As variáveis de ambiente do Base44 não estão configuradas no Vercel.

---

## 📋 Variáveis de Ambiente Necessárias

### **Obrigatórias para Produção:**

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `VITE_BASE44_APP_ID` | ID da sua aplicação Base44 | `app_abc123xyz` |
| `VITE_BASE44_BACKEND_URL` | URL do backend Base44 | `https://seu-app.base44.com` |

### **Opcionais:**

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `VITE_BASE44_FUNCTIONS_VERSION` | Versão das functions | `v1` |
| `VITE_BASE44_TOKEN` | Token de acesso (se necessário) | - |
| `BASE44_LEGACY_SDK_IMPORTS` | Importações legadas do SDK | `false` |

---

## 🔧 Como Configurar no Vercel

### **Passo 1: Acesse o Dashboard do Vercel**

1. Vá para [vercel.com](https://vercel.com)
2. Selecione seu projeto `crm-inteligente`
3. Clique em **Settings**

### **Passo 2: Adicione as Variáveis de Ambiente**

1. No menu lateral, clique em **Environment Variables**
2. Adicione cada variável:

#### **VITE_BASE44_APP_ID**
```
Name: VITE_BASE44_APP_ID
Value: [SEU-APP-ID-AQUI]
Environment: Production, Preview, Development ✓
```

#### **VITE_BASE44_BACKEND_URL**
```
Name: VITE_BASE44_BACKEND_URL
Value: https://seu-backend.base44.com
Environment: Production, Preview, Development ✓
```

#### **VITE_BASE44_FUNCTIONS_VERSION** (opcional)
```
Name: VITE_BASE44_FUNCTIONS_VERSION
Value: v1
Environment: Production, Preview, Development ✓
```

3. Clique em **Save** em cada variável

### **Passo 3: Redeploy**

Após adicionar as variáveis:

1. Vá para a aba **Deployments**
2. Clique nos **3 pontinhos (...)** do último deploy
3. Selecione **Redeploy**
4. Confirme e aguarde o novo deploy

---

## 🧪 Como Obter as Credenciais do Base44

### **Opção 1: Usar Mock Data (Desenvolvimento)**

Se você **não tem** credenciais do Base44 ainda:

```env
# Não configure nada - o sistema usará dados mockados automaticamente
```

O sistema detectará a ausência de credenciais e usará dados mockados no localStorage.

### **Opção 2: Credenciais Reais do Base44**

1. Acesse seu painel do [Base44](https://base44.com)
2. Vá em **Settings** ou **API Keys**
3. Copie:
   - **App ID** (geralmente começa com `app_`)
   - **Backend URL** (URL da sua aplicação)
4. Cole no Vercel conforme instruções acima

---

## 🔍 Verificação de Problemas

### **Como Verificar se as Variáveis Foram Aplicadas**

Após o redeploy, abra o console do navegador (F12):

#### ✅ **Com Variáveis Configuradas:**
```
Base44 client configured successfully
```

#### ❌ **Sem Variáveis (usando mock):**
```
⚠️  Base44 credentials not configured - using mock data
🎭 Using Mock Base44 Client (local data)
```

### **Se ainda ver 'null' nas URLs:**

1. **Verifique se redeployou** após adicionar as variáveis
2. **Limpe o cache** do navegador (Ctrl+Shift+R ou Cmd+Shift+R)
3. **Verifique os nomes** das variáveis (devem ter o prefixo `VITE_`)
4. **Verifique se marcou** todos os ambientes (Production, Preview, Development)

---

## 📱 Modo Mock vs Produção

### **Modo Mock (Desenvolvimento sem Base44)**
- ✅ Dados armazenados no localStorage
- ✅ 50 contatos mockados
- ✅ CRUD funciona localmente
- ❌ Dados não persistem entre dispositivos
- ❌ Não funciona em produção

### **Modo Produção (Com Base44)**
- ✅ Dados persistentes no banco
- ✅ Sincronização entre dispositivos
- ✅ Backup e segurança
- ✅ Múltiplos usuários
- ✅ APIs e integrações funcionam

---

## 🐛 Troubleshooting

### **Erro 405 - Method Not Allowed**

**Causa:** API Base44 está recebendo `null` como URL

**Solução:**
1. Configure `VITE_BASE44_APP_ID` e `VITE_BASE44_BACKEND_URL`
2. Redeploy
3. Limpe cache

### **Tela Preta**

**Causa:** Erro fatal ao inicializar Base44 SDK

**Solução:**
1. Abra o console (F12) e veja o erro específico
2. Verifique se as variáveis estão corretas
3. Verifique se o Backend URL está acessível
4. Teste a URL manualmente no navegador

### **Dados Mockados Aparecendo em Produção**

**Causa:** Variáveis não foram aplicadas ou deploy não foi feito

**Solução:**
1. Verifique no Vercel Dashboard se as variáveis existem
2. Faça um novo deploy
3. Verifique no console se ainda mostra "using mock data"

---

## 📞 Onde Buscar Ajuda

1. **Console do Navegador (F12)** - Sempre verifique primeiro
2. **Logs do Vercel** - Dashboard > Deployments > [seu deploy] > Logs
3. **Documentação Base44** - [docs.base44.com](https://docs.base44.com)
4. **GitHub Issues** - Abra uma issue no repositório

---

## ✅ Checklist Final

Antes de fazer deploy em produção:

- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] `VITE_BASE44_APP_ID` definido
- [ ] `VITE_BASE44_BACKEND_URL` definido
- [ ] Redeploy feito após adicionar variáveis
- [ ] Console não mostra "using mock data"
- [ ] URLs não contêm 'null'
- [ ] Aplicação carrega sem tela preta
- [ ] Consegue criar/editar contatos
- [ ] Backend Base44 está acessível

---

## 🎯 Resumo Rápido

```bash
# No Vercel Dashboard:
VITE_BASE44_APP_ID=seu-app-id
VITE_BASE44_BACKEND_URL=https://seu-backend.base44.com

# Depois: Redeploy
# Depois: Limpar cache (Ctrl+Shift+R)
# Pronto! 🎉
```
