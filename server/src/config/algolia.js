import { algoliasearch } from "algoliasearch";
const client = algoliasearch(
   "TUMZPSLJFU",
    "61cdb2992b1bc9605c6a970b8ad7a9f0"
);

export const productIndexName =
    process.env.ALGOLIA_INDEX_NAME || "products";

export default client;