import { Layout } from "../shared/Layout.js";

const resources = [
	{
		href: "/products",
		kicker: "E-commerce",
		title: "Products",
		blurb: "Catalogo de produtos com filtros por categoria e estoque.",
	},
	{
		href: "/cep",
		kicker: "Geo Brasil",
		title: "CEP",
		blurb: "POSTCODE com longitude e latitude.",
	},
	{
		href: "/news",
		kicker: "Conteúdo",
		title: "News",
		blurb: "Artigos com subject, data e texto completo.",
	},
	{
		href: "/movies",
		kicker: "Cinema",
		title: "Movies",
		blurb: "Filmes TMDB com generos, elenco e diretores.",
	},
	{
		href: "/users",
		kicker: "Pessoas",
		title: "Users",
		blurb: "Perfis fake com contato, endereco e foto.",
	},
];

export const HomePage = (
	<Layout title="Mockê · API pública de mocks">
		<header class="hero">
			<div>
				<p class="brand">Mockê</p>
				<p class="lede">
					API pública de mocks para prototipar frontends e testes. Dados reais
					de produtos, CEPs, notícias, filmes e usuários, com paginação, filtros
					por campo e OpenAPI.
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
				{resources.map((resource) => (
					<a class="page-link" href={resource.href}>
						<span class="kicker">{resource.kicker}</span>
						<strong>{resource.title}</strong>
						<span class="blurb">{resource.blurb}</span>
					</a>
				))}
			</nav>
		</section>
	</Layout>
);
