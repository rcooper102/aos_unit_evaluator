### Install

```
npm install
```

### Run Webpack Dev Server

Note: The dev server is ONLY used to serve rendered versions of the application.css and application.js files. The SPA itself will NOT function within the webpack dev server. In order to map the files onto either a localhost LAMP or web based LAMP server use a tool such as Requestly or Fiddler to redirect requests.

```
npm start
```

### Build Dev Files

Builds the css and js files into an uncompressed state

```
npm run build-dev
```

### Build Production Files

Builds the css and js files into an compressed state

```
npm run build
```
