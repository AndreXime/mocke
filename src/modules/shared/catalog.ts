import { CepCoordinateSchema } from "../cep/api/list-ceps.js";
import { cepDoc } from "../cep/docs.js";
import { CompanySchema } from "../companies/api/list-companies.js";
import { companiesDoc } from "../companies/docs.js";
import { MovieSchema } from "../movies/api/list-movies.js";
import { moviesDoc } from "../movies/docs.js";
import { NewsArticleSchema } from "../news/api/list-news.js";
import { newsDoc } from "../news/docs.js";
import { ProductSchema } from "../products/api/list-products.js";
import { productsDoc } from "../products/docs.js";
import { UserSchema } from "../users/api/list-users.js";
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

export const datasetSchemas = {
	products: ProductSchema,
	code_cep_coordinates: CepCoordinateSchema,
	news: NewsArticleSchema,
	movies: MovieSchema,
	users: UserSchema,
	companies: CompanySchema,
};
