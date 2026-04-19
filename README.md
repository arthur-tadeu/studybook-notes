# ✒️ Escrita Sem Limites

> **O refúgio digital onde o pensamento encontra ordem, projetado com uma estética Gótica Brutalista e Arquitetura Serverless.**

![Status](https://img.shields.io/badge/Status-Beta-black)
![Architecture](https://img.shields.io/badge/Architecture-3--Layer--Pattern-blue)
![Security](https://img.shields.io/badge/Security-OWASP_Compliant-success)

## 📌 Visão Geral

"Escrita Sem Limites" não é apenas um simples bloco de notas. É uma demonstração de **arquitetura de interface centrada no foco absoluto**. Fugindo do design "SaaS Clichê", a aplicação adota o **Brutalismo Tipográfico** (Monomorfismo, alto contraste, zero border-radius), forçando o usuário a se concentrar estritamente na criação de conteúdo.

Por trás do design polarizador, existe uma arquitetura tecnológica robusta e escalável gerenciada via **Firebase**, tornando a experiência performática e persistente.

---

## 🏗️ Arquitetura e Tech Stack

O projeto segue princípios de engenharia limpa, dividindo claramente o estado, os hooks, os serviços e os componentes visuais.

- **Core:** React 18, TypeScript (Strict Mode).
- **Styling:** CSS Modular Vanilla & Styled Components Inline via Context.
- **Backend & Auth:** Google Firebase (Auth + Cloud Firestore).
- **Deployment:** Vercel (com pipelines CI/CD).
- **Tooling:** Vite, ESLint, Antigravity Agent Kit (para testes contínuos de Sec & UX).

## 🛡️ Segurança e Hardening (Pronto para Produção)

Este projeto foi auditado buscando as 10 principais vulnerabilidades do OWASP e está blindado usando `vercel.json` e lógica TypeScript estrita.

- **Security Headers:** Strict-Transport-Security (HSTS), X-Frame-Options (DENY, contra Clickjacking), X-Content-Type-Options (nosniff) implementados.
- **Escapamento Automático:** Interações do Firebase são higienizadas para evitar vetores XSS via React e renderizações expostas.
- **Ambiente Blindado:** Chaves protegidas por Vercel Secret Environment Variables (o arquivo `.env` não é persistido).

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js 18+ instalado.
- Conta e um projeto no [Firebase Console](https://console.firebase.google.com/).

### Setup

1. **Clone o repositório e instale pacotes:**
   \`\`\`bash
   git clone https://github.com/seu-user/escrita-sem-limites.git
   cd escrita-sem-limites
   npm install
   \`\`\`

2. **Configuração de Variáveis:**
   Crie um arquivo `.env` na raiz seguindo o modelo `.env.example`:
   \`\`\`env
   VITE_FIREBASE_API_KEY="SUA_CHAVE_AQUI"
   VITE_FIREBASE_AUTH_DOMAIN="SEU_DOMINIO"
   VITE_FIREBASE_PROJECT_ID="SEU_ID"
   ...
   \`\`\`

3. **Iniciando:**
   \`\`\`bash
   npm run dev
   \`\`\`

## 🧠 Easter Eggs & Features Secretas

> *"Todo código tem uma alma, se você souber onde procurá-la."*

A aplicação contém caminhos ocultos implementados para ilustrar conceitos de controle de versão reversa e roteamento protegido ("Leyley Protocol"). As chaves e dados dessas rotas são mantidos isolados e estão injetados sob `src/lib/secrets.ts` que estão protegidos via `.gitignore`. 

---
_Criado por paixão à engenharia de software e web design sem convenções._
