import { Layout } from "./Layout.js";

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

interface ExtraTabItem {
	href: string;
	label: string;
	value: string;
}

interface ExtraTab {
	id: string;
	label: string;
	title: string;
	description: string;
	items: ExtraTabItem[];
}

export interface DocProps {
	title: string;
	kicker: string;
	description: string;
	fields: FieldDoc[];
	routes: RouteDoc[];
	examples: RouteDoc[];
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

function ExtraTabSection({
	title,
	description,
	items,
}: {
	title: string;
	description: string;
	items: ExtraTabItem[];
}) {
	return (
		<section class="doc-block">
			<h2 class="section-title">{title}</h2>
			<p class="lede">{description}</p>
			<ul class="shortcut-list">
				{items.map((item) => (
					<li>
						<a href={item.href}>
							<strong>{item.label}</strong>
							<span>{item.value}</span>
						</a>
					</li>
				))}
			</ul>
		</section>
	);
}

function TryItSection({ defaultUrl }: { defaultUrl: string }) {
	const alpineData = `{
		url: ${JSON.stringify(defaultUrl)},
		loading: false,
		status: null,
		body: '',
		error: '',
		async execute() {
			this.loading = true;
			this.error = '';
			this.status = null;
			this.body = '';
			try {
				const res = await fetch(this.url);
				this.status = res.status + ' ' + res.statusText;
				const text = await res.text();
				try {
					this.body = JSON.stringify(JSON.parse(text), null, 2);
				} catch (_) {
					this.body = text;
				}
			} catch (e) {
				this.error = e && e.message ? e.message : String(e);
			} finally {
				this.loading = false;
			}
		}
	}`;

	return (
		<section class="doc-block try-it" x-data={alpineData}>
			<h2 class="section-title">Experimente</h2>
			<form class="try-it-form" {...{ "x-on:submit.prevent": "execute()" }}>
				<label class="try-it-label" for="try-it-url">
					URL da requisição
				</label>
				<div class="try-it-row">
					<span class="http-method http-method--get">GET</span>
					<input
						id="try-it-url"
						class="try-it-input"
						type="text"
						name="url"
						autocomplete="off"
						spellcheck={false}
						x-model="url"
					/>
					<button
						type="submit"
						class="try-it-execute"
						x-bind:disabled="loading"
					>
						<span x-text="loading ? 'Enviando…' : 'Executar'" />
					</button>
				</div>
			</form>

			<div class="try-it-response" x-show="status || error || body" x-cloak>
				<p class="try-it-status" x-show="status" x-text="status" />
				<p class="try-it-error" x-show="error" x-text="error" />
				<pre class="try-it-body" x-show="body" x-text="body" />
			</div>
		</section>
	);
}

function DocPage(Props: DocProps) {
	const {
		title,
		kicker,
		description,
		fields,
		routes,
		examples,
		extraTabs = [],
	} = Props;

	return (
		<Layout title={`${title} · Mockê`}>
			<header class="hero">
				<div>
					<p class="kicker">{kicker}</p>
					<h1 class="page-title">{title}</h1>
					<p class="lede">{description}</p>
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
					{examples[0] ? <TryItSection defaultUrl={examples[0].href} /> : null}
					<RoutesSection title="Exemplos" routes={examples} />
				</div>

				{extraTabs.map((tab) => (
					<div x-show={`section === '${tab.id}'`} x-cloak>
						<ExtraTabSection
							title={tab.title}
							description={tab.description}
							items={tab.items}
						/>
					</div>
				))}
			</div>
		</Layout>
	);
}

export const generateDocPage = (props: DocProps) => DocPage(props);
