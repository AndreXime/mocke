import type { Child } from "hono/jsx";

interface FieldDoc {
	name: string;
	type: string;
	note?: string;
}

interface RouteDoc {
	method: string;
	path: string;
	description: string;
	href: string;
}

interface ExtraTab {
	id: string;
	label: string;
	content: Child;
}

interface ResourcePageProps {
	title: string;
	kicker: string;
	description: string;
	countLabel: string;
	idField: string;
	fields: FieldDoc[];
	routes: RouteDoc[];
	examples: RouteDoc[];
	variant: "products" | "ceps";
	extraTabs?: ExtraTab[];
}

function methodClass(method: string): string {
	return `http-method http-method--${method.toLowerCase()}`;
}

function FieldsSection({ fields }: { fields: FieldDoc[] }) {
	return (
		<section class="doc-block">
			<h2 class="section-title">Tipagem</h2>
			<table class="type-table">
				<thead class="sr-only">
					<tr>
						<th scope="col">Campo</th>
						<th scope="col">Tipo</th>
						<th scope="col">Nota</th>
					</tr>
				</thead>
				<tbody>
					{fields.map((field) => (
						<tr class="type-row">
							<td>
								<code class="type-name">{field.name}</code>
							</td>
							<td class="type-kind">{field.type}</td>
							<td class="type-note">{field.note ?? ""}</td>
						</tr>
					))}
				</tbody>
			</table>
		</section>
	);
}

function RoutesSection({
	title,
	routes,
}: {
	title: string;
	routes: RouteDoc[];
}) {
	return (
		<section class="doc-block">
			<h2 class="section-title">{title}</h2>
			<ul class="opblock-list">
				{routes.map((route) => (
					<li class={`opblock opblock--${route.method.toLowerCase()}`}>
						<a class="opblock-summary" href={route.href}>
							<span class={methodClass(route.method)}>{route.method}</span>
							<code class="opblock-path">{route.path}</code>
						</a>
						<p class="opblock-description">{route.description}</p>
					</li>
				))}
			</ul>
		</section>
	);
}

export function ResourcePage(Props: ResourcePageProps) {
	const {
		title,
		kicker,
		description,
		countLabel,
		idField,
		fields,
		routes,
		examples,
		variant,
		extraTabs = [],
	} = Props;

	return (
		<>
			<header class={`hero hero--${variant}`}>
				<div>
					<p class="kicker">{kicker}</p>
					<h1 class="page-title">{title}</h1>
					<p class="lede">{description}</p>
					<p class="meta">
						{countLabel} · chave <code>{idField}</code>
					</p>
				</div>
				<nav class="nav">
					<a class="ghost" href="/">
						Home
					</a>
					<a href="/docs">OpenAPI</a>
				</nav>
			</header>

			<div class="doc-tabs-shell" x-data="{ section: 'fields' }">
				<div class="doc-tabs" role="tablist" aria-label="Secoes">
					<button
						type="button"
						class="doc-tab"
						role="tab"
						x-on:click="section = 'fields'"
						x-bind:class="{ 'is-active': section === 'fields' }"
						x-bind:aria-selected="section === 'fields'"
					>
						Tipagem
					</button>
					<button
						type="button"
						class="doc-tab"
						role="tab"
						x-on:click="section = 'routes'"
						x-bind:class="{ 'is-active': section === 'routes' }"
						x-bind:aria-selected="section === 'routes'"
					>
						Rotas
					</button>
					<button
						type="button"
						class="doc-tab"
						role="tab"
						x-on:click="section = 'examples'"
						x-bind:class="{ 'is-active': section === 'examples' }"
						x-bind:aria-selected="section === 'examples'"
					>
						Exemplos
					</button>
					{extraTabs.map((tab) => (
						<button
							type="button"
							class="doc-tab"
							role="tab"
							x-on:click={`section = '${tab.id}'`}
							x-bind:class={`{ 'is-active': section === '${tab.id}' }`}
							x-bind:aria-selected={`section === '${tab.id}'`}
						>
							{tab.label}
						</button>
					))}
				</div>

				<div x-show="section === 'fields'" x-cloak>
					<FieldsSection fields={fields} />
				</div>

				<div x-show="section === 'routes'" x-cloak>
					<RoutesSection title="Rotas" routes={routes} />
				</div>

				<div x-show="section === 'examples'" x-cloak>
					<RoutesSection title="Exemplos" routes={examples} />
				</div>

				{extraTabs.map((tab) => (
					<div x-show={`section === '${tab.id}'`} x-cloak>
						{tab.content}
					</div>
				))}
			</div>
		</>
	);
}
