import type { Child } from "hono/jsx";

interface LayoutProps {
	title?: string;
	children: Child;
}

export function Layout({
	title = "Mockê · API pública de mocks",
	children,
}: LayoutProps) {
	return (
		<html lang="pt-BR">
			<head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>{title}</title>
				<link rel="stylesheet" href="/assets/css/index.css" />
			</head>
			<body>
				<div class="wrap docs-shell">{children}</div>
				<script defer src="/assets/js/alpine.min.js"></script>
			</body>
		</html>
	);
}
