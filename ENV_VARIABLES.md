# 🔐 Variáveis de Ambiente - Referência Completa

## 📋 Lista Completa de Variáveis

### **Base44 SDK - Obrigatórias**

```env
# ID da aplicação Base44 (obrigatório para produção)
VITE_BASE44_APP_ID=your-app-id-here

# URL do backend Base44 (obrigatório para produção)
VITE_BASE44_BACKEND_URL=https://your-backend-url.base44.com
```

### **Base44 SDK - Opcionais**

```env
# Versão das functions do Base44 (padrão: v1)
VITE_BASE44_FUNCTIONS_VERSION=v1

# Token de acesso opcional
VITE_BASE44_TOKEN=optional-token

# URL base local para desenvolvimento
VITE_BASE44_APP_BASE_URL=http://localhost:3000
```

### **Build - Opcionais**

```env
# Habilitar importações legadas do SDK (padrão: false)
BASE44_LEGACY_SDK_IMPORTS=false

# Detectado automaticamente no Vercel
VERCEL=1
```

---

## 🔍 Onde São Usadas

### **VITE_BASE44_APP_ID**

**Arquivo:** `src/lib/app-params.js:43`

```javascript
appId: getAppParamValue("app_id", {
  defaultValue: import.meta.env.VITE_BASE44_APP_ID
})
```

**Usado para:**
- Identificar sua aplicação no Base44
- Criar o cliente do SDK
- Autenticar requisições

**⚠️ Se undefined:** Retorna `null` → Causa URLs com 'null' → Erro 405

---

### **VITE_BASE44_BACKEND_URL**

**Arquivo:** `src/lib/app-params.js:44`

```javascript
serverUrl: getAppParamValue("server_url", {
  defaultValue: import.meta.env.VITE_BASE44_BACKEND_URL
})
```

**Usado para:**
- URL base para requisições da API
- Endpoint do backend Base44
- WebSocket connections (se aplicável)

**⚠️ Se undefined:** Retorna `null` → Requisições falham → Erro 405/404

---

### **VITE_BASE44_FUNCTIONS_VERSION**

**Arquivo:** `src/lib/app-params.js:47`

```javascript
functionsVersion: getAppParamValue("functions_version")
```

**Usado para:**
- Versionamento de Cloud Functions
- Compatibilidade com diferentes versões da API

**⚠️ Se undefined:** Usa valor padrão `v1` ou pode causar incompatibilidade

---

### **import.meta.env.DEV**

**Arquivo:** `src/api/base44Client.js:12`

```javascript
if (!isBase44Configured && import.meta.env.DEV) {
  // Usa mock client
}
```

**Usado para:**
- Detectar ambiente de desenvolvimento
- Ativar modo mock automaticamente
- Variável interna do Vite

**Valor:** `true` em dev, `false` em produção

---

### **process.env.VERCEL**

**Arquivo:** `vite.config.js:7`

```javascript
const isVercel = process.env.VERCEL === '1';
const base = command === 'build' && !isVercel ? '/crm-inteligente/' : '/';
```

**Usado para:**
- Detectar deploy no Vercel
- Ajustar base path do Vite
- Vercel define automaticamente como `'1'`

**Valor:** `'1'` no Vercel, `undefined` local

---

## 🎯 Comportamento por Ambiente

### **Desenvolvimento Local (npm run dev)**

```env
# .env vazio ou sem VITE_BASE44_*
```

**Comportamento:**
- ✅ Detecta ausência de credenciais
- ✅ Ativa modo mock automaticamente
- ✅ Dados no localStorage
- ✅ Console mostra: "using mock data"

---

### **Produção (Vercel)**

```env
# Vercel Dashboard > Environment Variables
VITE_BASE44_APP_ID=app_abc123
VITE_BASE44_BACKEND_URL=https://api.base44.com
```

**Comportamento:**
- ✅ Usa Base44 SDK real
- ✅ Dados persistentes no banco
- ✅ APIs funcionam
- ❌ **SEM variáveis:** Tela preta + Erro 405

---

## 🔧 Como o Sistema Detecta o Modo

```javascript
// src/api/base44Client.js
const isBase44Configured = appId && appId !== 'null' && serverUrl && serverUrl !== 'null';

if (!isBase44Configured && import.meta.env.DEV) {
  // Modo MOCK - Desenvolvimento
  console.log('⚠️  Base44 credentials not configured - using mock data');
  base44Client = mockModule.base44;
} else {
  // Modo REAL - Produção
  base44Client = createClient({ appId, serverUrl, ... });
}
```

---

## ⚠️ Problemas Comuns

### **1. URLs com 'null'**

```
https://null/api/entities/Contact/list
```

**Causa:**
- `VITE_BASE44_BACKEND_URL` não definida
- Retorna `null` de `app-params.js`

**Solução:**
- Definir variável no Vercel
- Redeploy

---

### **2. Erro 405 - Method Not Allowed**

```
POST https://null/api/... 405 (Method Not Allowed)
```

**Causa:**
- API tentando fazer requisição para URL inválida
- `appId` ou `serverUrl` são `null`

**Solução:**
- Configurar `VITE_BASE44_APP_ID`
- Configurar `VITE_BASE44_BACKEND_URL`

---

### **3. Tela Preta no Deploy**

**Causa:**
- Erro fatal ao inicializar Base44 SDK
- Credenciais inválidas ou ausentes

**Solução:**
- Abrir console (F12) e ver erro
- Verificar variáveis no Vercel
- Verificar se Backend URL está acessível

---

### **4. Mock Data em Produção**

**Causa:**
- Variáveis não foram aplicadas
- Deploy não foi refeito após adicionar variáveis

**Solução:**
- Verificar variáveis no Vercel Dashboard
- Fazer redeploy
- Limpar cache do navegador

---

## 📝 Template Completo

### **Para Desenvolvimento (.env local)**

```env
# Deixe vazio para usar mock data
# Ou configure para usar Base44 real:

VITE_BASE44_APP_ID=app_dev_123
VITE_BASE44_BACKEND_URL=https://dev.base44.com
VITE_BASE44_FUNCTIONS_VERSION=v1
VITE_BASE44_APP_BASE_URL=http://localhost:3000
```

### **Para Produção (Vercel Dashboard)**

```env
VITE_BASE44_APP_ID=app_prod_456
VITE_BASE44_BACKEND_URL=https://api.base44.com
VITE_BASE44_FUNCTIONS_VERSION=v1
```

---

## 🚨 Importante

1. **Todas variáveis com `VITE_`** são expostas no client-side
2. **Não coloque secrets** em variáveis `VITE_*`
3. **Prefixo `VITE_`** é obrigatório para Vite expor a variável
4. **Redeploy** é necessário após adicionar variáveis no Vercel
5. **Limpe cache** após redeploy

---

## 📖 Referências

- [Vite Env Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Base44 SDK Documentation](https://docs.base44.com)
