# Gulp Translator-d (Forked for Heek)
> Almost like string replace but using locales

## Usage

First, install `gulp-translator-d` as a development dependency...

... with shell

```shell
npm install --save "git+https://github.com/heek/gulp-translator.git"
```
... directly in package.json

```javascript
"gulp-translator-d": "git+https://github.com/heek/gulp-translator.git",
```

Then, add it to your `gulpfile.js`:

```javascript
var translate = require('gulp-translator');

gulp.task('translate', function() {
  var translations = ['pl', 'en'];

  translations.forEach(function(translation){
    gulp.src('app/views/**/*.html')
      .pipe(translate('./locales/'+ translation +'.yml'))
      .pipe(gulp.dest('dist/views/' + translation));
  });
});
```

or better, handle errors:
```javascript
gulp.task('translate', function() {
  var translations = ['pl', 'en'];

  translations.forEach(function(translation){
    gulp.src('app/views/**/*.html')
      .pipe(
        gulpTranslateTemplate('./locales/'+ translation +'.yml')
        .on('error', function(){
          console.dir(arguments);
        })
      )
      .pipe(gulp.dest('dist/views/' + translation));
  });
});
```

Config (Heek front):
```javascript
'use strict';

const gulp = require('gulp');
const rename = require('gulp-rename');
const translate = require('gulp-translator-d');
const gutil = require('gulp-util');

gulp.task('translateEn', ['clean:translateEn', 'yamlEn'], () =>
  gulp.src('views/**/*.ejs')
    .pipe(rename((path) => {
      path.extname = '.html';
    }))
    .pipe(
      translate('.tmp/private/locales/yml/en/en.yml')
      .on('error', (error) =>
        gutil.log(error)
      )
    )
    .pipe(rename((path) => {
      path.extname = '.ejs';
    }))
    .pipe(gulp.dest('.tmp/public/views/en'))
);

gulp.task('translateFr', ['clean:translateFr', 'yamlFr'], () =>
  gulp.src('views/**/*.ejs')
    .pipe(rename((path) => {
      path.extname = '.html';
    }))
    .pipe(
      translate('.tmp/private/locales/yml/fr/fr.yml')
      .on('error', (error) =>
        gutil.log(error)
      )
    )
    .pipe(rename((path) => {
      path.extname = '.ejs';
    }))
    .pipe(gulp.dest('.tmp/public/views/fr'))
);

gulp.task('translate', ['translateFr', 'translateEn']);
```

## Usage

I'm using `{{{}}}` to avoid conflict with angular-like syntax

Following examples assume that "title" in locales equals "new TITLE"

Example:
```
{{{ title }}} will be change to "new TITLE"

```
If you'd like to use filters(look at the bottom to check available filters) just pass them after like that:

```
{{{ title | lowercase }}} will be change to "new title"

```

```
{{{ title | uppercase }}} will be change to "NEW TITLE"

```

```
{{{ Author's name | addslashes }}} will be change to "Author\'s name"

```

## API

gulp-translator is called with a string

### translate(string)

#### string
Type: `String`

The string is a path to a nameOfTheFile.yml with your locales. Please look at test/locales for examples.

## Available filters:

  - lowercase
  - uppercase
  - addslashes

## Run test:

```shell
npm install
```
```shell
npm test
```

# License
  MIT
