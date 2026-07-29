# Mockê

API pública de mocks para prototipar frontends sem backend real. Sobe rápido, responde JSON paginado e deixa filtrar por qualquer campo do dataset.

Licença: [MIT](LICENSE).

## Features

- **Datasets prontos**: produtos, notícias, CEPs, filmes (TMDB), usuários e empresas
- **Paginação** com `page` e `limit`
- **Filtros por campo**: igualdade simples; vários valores separados por vírgula fazem OR
- **Busca textual** com `q` ou `search` (LIKE); `searchFields` restringe os campos
- **Ordenação** com `sort` e `order` (`asc`/`desc`)
- **Projeção de campos** com `fields=id,title,price`
- **Mutações fake** (`POST`/`PUT`/`PATCH`/`DELETE`) sem persistir; `fail=0..1` para 500 probabilístico
- **Auth mock**: `POST /api/auth/login` e `GET /api/auth/me` (Bearer)
- **Docs interativas**: Swagger em `/docs` e páginas HTML por recurso (`/products`, `/news`, `/cep`, `/movies`, `/users`, `/companies`, `/auth`)
- **OpenAPI** em `/openapi.json`
- **CORS aberto** para consumo direto do browser
- **Cache local em SQLite**: reinícios sem releitura dos CSVs quando `data/` não mudou
- **Rate limit** por IP (padrão 20 req/min)
- **Health checks** em `/health` e `/ready`

## Como rodar

```bash
bun install
bun run dev
```

Acesse `http://localhost:3000`.

### Docker

```bash
docker build -t mocke .
docker run --rm -p 3000:3000 mocke
```

Atrás de um proxy reverso, passe `TRUST_PROXY=true`:

```bash
docker run --rm -p 3000:3000 -e TRUST_PROXY=true mocke
```

O volume opcional `.cache` evita reimportar os CSVs a cada restart:

```bash
docker run --rm -p 3000:3000 -v mocke-cache:/app/.cache mocke
```

## Rate limit

Por padrão, cada IP pode fazer **20 requisições por minuto** (janela fixa). Ao exceder, a API responde `429` com:

| Header | Significado |
|--------|-------------|
| `X-RateLimit-Limit` | Limite da janela |
| `X-RateLimit-Remaining` | Restantes na janela |
| `X-RateLimit-Reset` | Unix timestamp (s) do fim da janela |
| `Retry-After` | Segundos até poder tentar de novo (só no 429) |

`OPTIONS`, `/health` e `/ready` não consomem o limite.

O IP vem do socket da conexão. Só use `TRUST_PROXY=true` atrás de um proxy reverso que define `X-Forwarded-For` de forma confiável; caso contrário o header pode ser spoofado.

## Health checks

```bash
curl "http://localhost:3000/health"   # processo vivo
curl "http://localhost:3000/ready"    # SQLite + datasets carregados
```

`/ready` retorna `503` se o banco ou algum dataset esperado estiver indisponível.

## Variáveis de ambiente

| Variável | Default | Descrição |
|----------|---------|-----------|
| `PORT` | `3000` | Porta HTTP |
| `RATE_LIMIT_MAX` | `20` | Máximo de requisições por janela |
| `RATE_LIMIT_WINDOW_MS` | `60000` | Duração da janela em ms |
| `TRUST_PROXY` | `false` | Se `true`, usa o primeiro hop de `X-Forwarded-For` |

## Exemplos

```bash
curl "http://localhost:3000/api/products?limit=5&inStock=True"
curl "http://localhost:3000/api/products?q=shoes&searchFields=title&sort=price&order=desc&fields=id,title,price&limit=5"
curl "http://localhost:3000/api/news?subject=politicsNews&limit=5"
curl "http://localhost:3000/api/code_cep_coordinates/01310"
curl "http://localhost:3000/api/movies?genres=Action&limit=5"
curl "http://localhost:3000/api/users?gender=female&limit=5"
curl "http://localhost:3000/api/companies?industry=banking&limit=5"
curl -X POST "http://localhost:3000/api/products?fail=0"
curl -X POST "http://localhost:3000/api/auth/login"
curl -H "Authorization: Bearer mock-token" "http://localhost:3000/api/auth/me"
```

## Como adicionar um módulo novo

O nome do dataset vem do arquivo em `data/` (ex.: `data/books.csv` → dataset `books`). Prefira CSV com header em `snake_case` e uma coluna `id` explícita.

1. **Coloque o arquivo de dados** em `data/` (`books.csv` ou `books.json`).
2. **Crie o módulo** em `src/modules/books/`, espelhando `users` ou `companies`:
   - `api/list-books.ts` — schema Zod (`BookSchema`), rota `GET /api/books`, usa `listPage("books", …)`
   - `api/get-book.ts` — rota `GET /api/books/{id}`, usa `getRecord("books", id)`
   - `docs.ts` — `DocProps` (campos, rotas, exemplos) + `generateDocPage`
   - `index.ts` — `registerBooks(app)` com a página HTML `/books`, rotas GET e `registerMockMutations(app, { name: "books", tag: "Books" })`
3. **Registre no app** em `src/app.ts`: importe e chame `registerBooks(app)`.
4. **Inclua no catálogo** em `src/modules/shared/catalog.ts`:
   - adicione `booksDoc` em `catalog`
   - adicione `books: BookSchema` em `datasetSchemas`
5. **Suba de novo** (`bun run dev`). O SQLite reimporta `data/` automaticamente se o arquivo mudou; a validação de contratos em boot confirma que o schema bate com os dados.

Referência rápida: `src/modules/companies/`.

## Scripts

| Comando | Uso |
|---------|-----|
| `bun run dev` | Desenvolvimento com watch |
| `bun run build` | Build de produção |
| `bun run start` | Sobe o build |
| `bun run lint` | Lint + typecheck |
