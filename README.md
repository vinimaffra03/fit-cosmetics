# FitCosmetics - E-commerce de Cosméticos

Um projeto de e-commerce moderno construído com React, TypeScript e Tailwind CSS.

## Tecnologias Utilizadas

- **Vite** - Build tool rápido e moderno
- **TypeScript** - Tipagem estática para JavaScript
- **React 18** - Biblioteca de UI
- **React Router** - Gerenciamento de rotas
- **Tailwind CSS** - Framework de estilização
- **shadcn/ui** - Componentes de UI reutilizáveis
- **React Query** - Gerenciamento de estado de servidor
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de dados

## Como Executar o Projeto

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone <URL_DO_REPOSITORIO>
cd fitcosmetics

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run build:dev` - Build para desenvolvimento
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa o linter
- `npm run test` - Executa os testes
- `npm run test:watch` - Executa os testes em modo watch

## Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis
├── contexts/       # Contextos do React
├── data/          # Dados estáticos
├── hooks/         # Hooks personalizados
├── lib/           # Utilitários
├── pages/         # Páginas da aplicação
├── types/         # Definições de tipos TypeScript
└── test/          # Arquivos de teste
```

## Funcionalidades

- Catálogo de produtos
- Detalhes do produto
- Carrinho de compras
- Navegação por categorias
- Design responsivo

## Deploy

Para fazer o deploy da aplicação:

```bash
# Build para produção
npm run build

# Preview do build
npm run preview
```

A pasta `dist` conterá os arquivos estáticos prontos para deploy.
