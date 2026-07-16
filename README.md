# Mockê

API pública de mocks para prototipar frontends sem backend real. Sobe rápido, responde JSON paginado e deixa filtrar por qualquer campo do dataset.

## Features

- **Datasets prontos**: produtos de e-commerce, notícias e CEPs com coordenadas
- **Paginação** com `page` e `limit`
- **Filtros por campo**: igualdade simples; vários valores separados por vírgula fazem OR
- **Docs interativas**: Swagger em `/docs` e páginas HTML por recurso (`/products`, `/news`, `/cep`)
- **OpenAPI** em `/openapi.json`
- **CORS aberto** para consumo direto do browser
- **Cache local em SQLite**: reinícios sem releitura dos CSVs quando `data/` não mudou

## Como rodar

```bash
bun install
bun run dev
```

Acesse `http://localhost:3000`.

## Exemplos

```bash
curl "http://localhost:3000/api/products?limit=5&inStock=True"
curl "http://localhost:3000/api/news?subject=politicsNews&limit=5"
curl "http://localhost:3000/api/code_cep_coordinates/01310"
```

## Scripts

| Comando | Uso |
|---------|-----|
| `bun run dev` | Desenvolvimento com watch |
| `bun run build` | Build de produção |
| `bun run start` | Sobe o build |
| `bun run lint` | Lint + typecheck |
