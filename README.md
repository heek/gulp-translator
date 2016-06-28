# Gulp Translator-d
> Almost like string replace but using locales

## Usage

First, install `gulp-translator-d` as a development dependency:

```shell
npm install --save-dev gulp-translator-d
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

If you're still not sure, please look at tests.

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

# License
  MIT
