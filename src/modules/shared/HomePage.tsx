import { catalog } from "./catalog.js";
import { Layout } from "./Layout.js";

export const HomePage = (
	<Layout title="Mockê · API pública de mocks">
		<header class="hero">
			<div>
				<p class="brand">Mockê</p>
				<p class="lede">
					API pública de mocks para prototipar frontends e testes. Dados reais
					de produtos, CEPs, notícias, filmes e usuários, com paginação, busca,
					ordenação, mutações fake, auth mock e OpenAPI.
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
				{catalog.map((resource) => (
					<a class="page-link" href={resource.href}>
						<span class="kicker">{resource.kicker}</span>
						<strong>{resource.title}</strong>
						<span class="blurb">{resource.description}</span>
					</a>
				))}
			</nav>
		</section>
	</Layout>
);
