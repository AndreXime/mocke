import { Layout } from "../shared/Layout.js";

export function HomePage() {
	return (
		<Layout title="Mockê · API pública de mocks">
			<header class="hero">
				<div>
					<p class="brand">Mockê</p>
					<p class="lede">
						API pública de mocks para prototipar frontends e testes. Dados reais
						de produtos, CEPs, notícias e filmes, com paginação, filtros por
						campo e OpenAPI.
					</p>
				</div>
				<nav class="nav">
					<a href="/docs">OpenAPI</a>
					<a class="ghost" href="/openapi.json">
						openapi.json
					</a>
				</nav>
			</header>

			<section class="intro">
				<nav class="page-links">
					<a class="page-link page-link--products" href="/products">
						<span class="kicker">E-commerce</span>
						<strong>Products</strong>
						<span class="blurb">
							Catalogo de produtos com filtros por categoria e estoque.
						</span>
					</a>
					<a class="page-link page-link--ceps" href="/cep">
						<span class="kicker">Geo Brasil</span>
						<strong>CEP</strong>
						<span class="blurb">POSTCODE com longitude e latitude.</span>
					</a>
					<a class="page-link page-link--news" href="/news">
						<span class="kicker">Conteúdo</span>
						<strong>News</strong>
						<span class="blurb">
							Artigos com subject, data e texto completo.
						</span>
					</a>
					<a class="page-link page-link--movies" href="/movies">
						<span class="kicker">Cinema</span>
						<strong>Movies</strong>
						<span class="blurb">
							Filmes TMDB com generos, elenco e diretores.
						</span>
					</a>
				</nav>
			</section>
		</Layout>
	);
}
