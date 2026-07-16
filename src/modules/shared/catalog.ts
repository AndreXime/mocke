import { cepDoc } from "../cep/docs.js";
import { companiesDoc } from "../companies/docs.js";
import { moviesDoc } from "../movies/docs.js";
import { newsDoc } from "../news/docs.js";
import { productsDoc } from "../products/docs.js";
import { usersDoc } from "../users/docs.js";
import type { DocProps } from "./DocsPage.js";

export const catalog: DocProps[] = [
	productsDoc,
	cepDoc,
	newsDoc,
	moviesDoc,
	usersDoc,
	companiesDoc,
];
