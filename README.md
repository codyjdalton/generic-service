[![Build Status](https://travis-ci.org/codyjdalton/narrative-service.svg?branch=master)](https://travis-ci.org/codyjdalton/narrative-service) [![Coverage Status](https://coveralls.io/repos/github/codyjdalton/narrative-service/badge.svg?branch=master)](https://coveralls.io/github/codyjdalton/narrative-service?branch=master)

# Narrative Service

## About

A RESTful HTTP service to support managing branching storylines. Ideal consumer would be a story management tool.

## Getting Started

Clone this repo
```
> git clone https://github.com/codyjdalton/narrative-service
> cd narrative-service
```
Create a `.env` file at the project root `/`. Copy the contents from `.env.example` into `.env` and replace them with your own values.

```
DATASOURCE=mongodb://localhost/project
DATASOURCE_INTEG=mongodb://localhost/project-test
```

If you need help setting up a database, [MLab currently allows](https://mlab.com/) creating a free cloud MongoDB instance.

```
> npm install
```
Start the application
```
> npm start
```
Run tests
```
> npm test
```

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/codyjdalton/super-injector/tags). 

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
