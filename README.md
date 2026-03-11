# 🐆 Pantherium — Atlética de Enfermagem UNEF

Site institucional completo da Pantherium com painel administrativo integrado ao Firebase.

---

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Firebase Auth** — autenticação do admin
- **Firestore** — banco de dados do conteúdo
- **Firebase Storage** — imagens e uploads
- **react-easy-crop** — crop real de imagens antes do upload

---

## Estrutura do Projeto

```
src/
  app/
    layout.tsx           # Layout raiz com AuthProvider
    page.tsx             # Site público
    globals.css          # Estilos globais + utilitários
    admin/
      layout.tsx         # Layout do admin (AdminGuard + Sidebar)
      page.tsx           # Redirect para /admin/dashboard
      login/page.tsx     # Tela de login
      dashboard/page.tsx # Painel principal
      hero/page.tsx      # Edição do hero com crop de logo
      quem-somos/page.tsx
      historia/page.tsx  # CRUD da timeline
      identidade/page.tsx
      diretoria/page.tsx # CRUD de membros com foto
      galeria/page.tsx   # Upload múltiplo de imagens
      contato/page.tsx
  components/
    admin/
      AdminGuard.tsx     # Proteção de rotas autenticadas
      AdminHeader.tsx    # Cabeçalho padronizado das páginas
      AdminSidebar.tsx   # Menu lateral do painel
      CropModal.tsx      # Modal de crop real (react-easy-crop)
      ImageUpload.tsx    # Upload integrado com crop
    public/
      PublicSite.tsx     # Site público completo
  lib/
    firebase.ts          # Inicialização do Firebase
    authContext.tsx      # Contexto de autenticação
    defaults.ts          # Conteúdo padrão (fallback)
  services/
    siteService.ts       # Todas as operações CRUD + upload
  types/
    index.ts             # Tipagem completa
  hooks/
    useAuth.ts           # Hook de autenticação
```

---

## Como rodar localmente

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.local.example .env.local
```

Preencha com as credenciais do seu projeto Firebase:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### 3. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse: `http://localhost:3000`

---

## Configurar Firebase

### 1. Criar projeto

1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. Crie um novo projeto
3. Registre um app Web e copie as credenciais para `.env.local`

### 2. Ativar Authentication

- Firebase Console → Authentication → Sign-in method
- Habilite **E-mail/senha**

### 3. Criar usuário admin

No Firebase Console → Authentication → Users → Add user:
- E-mail: seu e-mail de admin
- Senha: senha segura

Ou via script (crie `scripts/createAdmin.ts`):

```typescript
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const app = initializeApp({ /* sua config */ });
const auth = getAuth(app);

createUserWithEmailAndPassword(auth, "admin@pantherium.com", "suasenha")
  .then(u => console.log("Criado:", u.user.uid))
  .catch(console.error);
```

### 4. Criar Firestore

- Firebase Console → Firestore Database → Create database
- Escolha **Production mode**
- Aplique as regras do arquivo `firestore.rules`:

```bash
firebase deploy --only firestore:rules
```

### 5. Criar Storage

- Firebase Console → Storage → Get started
- Aplique as regras do arquivo `storage.rules`:

```bash
firebase deploy --only storage
```

---

## Estrutura do Firestore

| Coleção/Documento | Conteúdo |
|---|---|
| `siteContent/hero` | Badge, título, subtítulo, tagline, logo |
| `siteContent/about` | Título, texto 1, texto 2 |
| `siteContent/identity` | Pantera, cobra, arte central |
| `siteContent/contact` | Instagram, e-mail, CTA |
| `timeline/{id}` | Itens da linha do tempo |
| `directors/{id}` | Membros da diretoria |
| `gallery/{id}` | Imagens da galeria |

---

## Fluxo de Upload com Crop

O crop está **realmente integrado** ao fluxo de upload:

1. Usuário clica em "Selecionar imagem"
2. Escolhe um arquivo local
3. **Modal de crop abre automaticamente** com a imagem selecionada
4. Usuário ajusta o recorte e o zoom
5. Clica em **"Confirmar Recorte"**
6. A imagem recortada é convertida em Blob via Canvas
7. O Blob é enviado ao Firebase Storage
8. A URL gerada é salva no Firestore
9. O preview é atualizado imediatamente
10. O site público reflete a mudança na próxima visita

---

## Deploy na Vercel

### 1. Instalar Vercel CLI (opcional)

```bash
npm i -g vercel
vercel
```

### 2. Ou conectar via GitHub

1. Faça push para um repositório GitHub
2. Acesse [vercel.com](https://vercel.com) → New Project
3. Importe o repositório

### 3. Configurar variáveis de ambiente na Vercel

No painel do projeto → Settings → Environment Variables:

Adicione todas as variáveis do `.env.local.example`.

### 4. Deploy automático

A Vercel fará deploy a cada push na branch `main`.

---

## Acessar o painel admin

Após o deploy ou em desenvolvimento:

```
/admin/login
```

Use o e-mail e senha do usuário criado no Firebase Authentication.

---

## Rotas

| Rota | Descrição |
|---|---|
| `/` | Site público |
| `/admin` | Redireciona para `/admin/dashboard` |
| `/admin/login` | Login do painel |
| `/admin/dashboard` | Painel principal |
| `/admin/hero` | Editar hero |
| `/admin/quem-somos` | Editar apresentação |
| `/admin/historia` | CRUD da timeline |
| `/admin/identidade` | Editar mascotes |
| `/admin/diretoria` | CRUD da diretoria |
| `/admin/galeria` | Upload de galeria |
| `/admin/contato` | Editar contato |

---

## Fontes

O projeto usa as seguintes fontes do Google Fonts (carregadas automaticamente):

- **Bebas Neue** — títulos grandes (display)
- **Syne** — corpo de texto e UI
- **JetBrains Mono** — badges e elementos técnicos

---

## Identidade Visual

| Elemento | Valor |
|---|---|
| Cor primária (neon) | `#00ff88` |
| Fundo principal | `#0a0a0a` |
| Fundo card | `#111111` |
| Fonte de display | Bebas Neue |
| Fonte de corpo | Syne |

---

Desenvolvido para a **Pantherium — Atlética de Enfermagem UNEF** 🐆🐍
