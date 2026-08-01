# NexaLab Docs
 
This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.
 
### Installation
 
```
npm install
```
 
### Local Development
 
```
npm start
```
 
This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.
 
Note: with i18n, `npm start` only serves the default locale (English). Use `npm run start:fr` for French.
 
### Build
 
```
npm run build
```
 
This command generates static content into the `build` directory and can be served using any static contents hosting service.
 
## i18n
 
English is the default locale, served at `/`. French lives under `i18n/fr/` and is served at `/fr/`.
 
```
npm run start:fr   # dev server, French
npm run build      # builds both locales
npm run write-translations:fr
```
 
## Search
 
Using `@easyops-cn/docusaurus-search-local` (offline, no Algolia). Index is only built on `npm run build`, so search won't return results under `npm start`.