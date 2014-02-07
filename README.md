# Jakobs JavaScript Project Seed

This repository contains a basic project setup, which I use to quickly setup
new prototype projects for myself. Maybe this templates do help others as
well.

## Used Features

The current seed utilizes the following features/projects:

- [Grunt](http://gruntjs.com)
- [require.js](http://requirejs.org/)
- [almond](https://github.com/jrburke/almond)
- [karma-runner](http://karma-runner.github.io/)
- [jshint](http://www.jshint.com/)
- [npm](http://npmjs.org)

## Initialization

To initialize a new project from the seed the following basic steps are
required:

1. Copy a recent checkout to your new projects directory
2. Remove the `.git` folder
3. Replace the `name` and `description` inside the `package.json` with
   information about your new project
4. Run `npm install`
5. Run `grunt symlink:www`

## Development

The following basic rules apply during development:

- JavaScript sourcecode is stored under `src`
- All other *web* content (html, css, images, ...) is stored under `assets`
- `grunt symlink:www` takes care of creating a `www` directory which contains
  all the needed file structures linked for dynamic loading during development
    - `www/index_dev.html` may be opened to test the app during development. It
      automatically bootstraps the application using the `main.js` module stored
      under `src`. All dependencies are loaded dynamically
- `grunt build` creates a combined and minified build, which is stored under
  `dist`. 
    - Opening `index.html` inside the `dist` folder loads the combined
      application
- `src/require.config.js` handles all the *require.js* configuration for
  development and production builds
- Tests are stored under `specs`
    - They are named `*.spec.js`
    - The used framework is Jasmine
    - Tests are supposed to be require-modules as well
- Test fixtures are stored under `fixtures`
    - They are automatically loaded and made available under
      `window.__html__["fixtures/YOUR_FIXTURE_NAME.html"]`

Run `grunt tasks` to show a list of all available *grunt* tasks
