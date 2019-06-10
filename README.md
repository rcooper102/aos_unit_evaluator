# Welcome to the Velocity

The velocity application framework is designed as a structure for the development of a full stack single page application in a single repository using the Osiris Javascript Framework and a PHP/MySQL backend. In an effort to maximize performance Velocity does NOT use Babel to transpile ES6 into ES5. Thus it is important to write ES6 code that is supported by all browsers that are needed to be supported. This also means that applications developed using Velocity cannot support any version of Internet Explorer.

Pro tip: As of writing this read me, Safari does NOT support the ES6 spread operator. eg: { ...myVar }

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

### Application Structure

The velocity framework contains the structure a Javascript driven Single Page Application that uses a PHP/MySQL back end. The backend files are all stored with /application and should be edited therein with the exception of the user interface which is compiled via webpack and stored within /src. By default, the webpack UI files are compiled into the /application directory in project/ui/assets/Application.js and project/ui/assets/Application.css respectively. The names of these files can be adjusted within via webpack config. 

Because the Osiris framework is loaded seperately from its own CDN everything within it is globally accessibly within the scope of the project without the need to import. 

Velocity specific JS files are stored outside the src folder in /velocity. These should not be altered. 

