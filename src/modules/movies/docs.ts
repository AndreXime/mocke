import { ResourcePage } from "../shared/ResourcePage.js";

export function MoviesPage() {
	return ResourcePage({
		kicker: "Cinema",
		title: "Movies",
		description:
			"Filmes do TMDB 5000 com generos, elenco, diretores e metadados de producao. Bom para catalogos, filtros por genero e buscas por ator ou diretor.",
		fields: [
			{ name: "id", type: "string", note: "chave primaria (TMDB)" },
			{ name: "title", type: "string" },
			{ name: "original_title", type: "string" },
			{ name: "original_language", type: "string", note: "ex.: en, fr, ja" },
			{ name: "overview", type: "string", note: "sinopse" },
			{ name: "tagline", type: "string" },
			{ name: "status", type: "string", note: "ex.: Released" },
			{ name: "release_date", type: "string", note: "YYYY-MM-DD" },
			{ name: "runtime", type: "string", note: "minutos" },
			{ name: "budget", type: "string" },
			{ name: "revenue", type: "string" },
			{ name: "popularity", type: "string" },
			{ name: "vote_average", type: "string" },
			{ name: "vote_count", type: "string" },
			{ name: "homepage", type: "string" },
			{
				name: "genres",
				type: "string",
				note: "lista separada por virgula; filtro encontra item na lista",
			},
			{ name: "keywords", type: "string" },
			{ name: "production_companies", type: "string" },
			{ name: "production_countries", type: "string" },
			{ name: "spoken_languages", type: "string" },
			{
				name: "cast",
				type: "string",
				note: "ate 20 nomes principais",
			},
			{ name: "directors", type: "string" },
		],
		routes: [
			{
				method: "GET",
				path: "/api/movies",
				href: "/api/movies?limit=5",
				description:
					"Lista paginada. Query: page, limit e qualquer campo do filme.",
			},
			{
				method: "GET",
				path: "/api/movies/{id}",
				href: "/api/movies/19995",
				description: "Busca um filme pelo id TMDB.",
			},
		],
		examples: [
			{
				method: "GET",
				path: "/api/movies?limit=5",
				href: "/api/movies?limit=5",
				description: "Primeiros 5 filmes.",
			},
			{
				method: "GET",
				path: "/api/movies/19995",
				href: "/api/movies/19995",
				description: "Avatar (id 19995).",
			},
			{
				method: "GET",
				path: "/api/movies?genres=Action&limit=5",
				href: "/api/movies?genres=Action&limit=5",
				description: "Filtrar por genero Action.",
			},
			{
				method: "GET",
				path: "/api/movies?directors=James%20Cameron&limit=5",
				href: "/api/movies?directors=James%20Cameron&limit=5",
				description: "Filmes dirigidos por James Cameron.",
			},
		],
	});
}
