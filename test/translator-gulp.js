var File = require('vinyl');
var through = require('through2');
var assert = require('assert');
var Stream = require('stream');
var gutil = require('gulp-util');

var gulpTranslator = require('../translator-gulp.js');

describe('gulp-translator', function() {

  describe('with null contents', function() {
    it('should let null files pass through', function(done) {
      var translator = gulpTranslator('./test/locales/en.yml');
      var n = 0;

      var _transform = function(file, enc, callback) {
        assert.equal(file.contents, null);
        n++;
        callback();
      };

      var _flush = function(callback) {
        assert.equal(n, 1);
        done();
        callback();
      };

      var t = through.obj(_transform, _flush);
      translator.pipe(t);
      translator.end(new File({
        contents: null
      }));
    });
  });

  describe('with buffer contents', function() {
    it('should interpolate strings - ENGLISH', function(done) {
      var translator = gulpTranslator('./test/locales/en.yml');
      var n = 0;
      var content = new Buffer("[[[ user.title  ]]] [[[title ]]]");
      var translated =  "ENGLISH USER TITLE Title";

      var _transform = function(file, enc, callback) {
        assert.equal(file.contents.toString('utf8'), translated);
        n++;
        callback();
      };

      var _flush = function(callback) {
        assert.equal(n, 1);
        done();
        callback();
      };

      var t = through.obj(_transform, _flush);
      translator.pipe(t);
      translator.end(new File({
        contents: content
      }));
    });

    it('should interpolate strings - POLISH', function(done) {
      var translator = gulpTranslator('./test/locales/pl.yml');
      var n = 0;
      var content = new Buffer("[[[ user.title  ]]] [[[title ]]]");
      var translated = "POLSKI TYTUL Tytul";

      var _transform = function(file, enc, callback) {
        assert.equal(file.contents.toString('utf8'), translated);
        n++;
        callback();
      };

      var _flush = function(callback) {
        assert.equal(n, 1);
        done();
        callback();
      };

      var t = through.obj(_transform, _flush);
      translator.pipe(t);
      translator.end(new File({
        contents: content
      }));
    });

    it("should throw error about undefined locale", function(done){
      var translator = gulpTranslator('./test/locales/pl.yml');
      var n = 0;
      var content = new Buffer("[[[ unsupported  ]]]");

      var _transform = function(file, enc, callback) {
        n++;
        callback();
      };

      var _flush = function(callback) {
        assert.equal(n, 0);
        callback();
      };


      translator.on('error', function(err){
        assert.equal(err.message,
          'Cannot find that key in locales [[[ unsupported  ]]] and is used in /path');
        done();
      });

      var t = through.obj(_transform, _flush);
      translator.pipe(t);
      translator.end(new File({
        path: '/path',
        contents: content
      }));
    });

    describe('filters', function() {
      it("should lowecase translated text", function(done){
        var translator = gulpTranslator('./test/locales/en.yml');
        var n = 0;
        var content = new Buffer("[[[ title  ]]] [[[title | lowercase]]]");
        var translated = "Title title";

        var _transform = function(file, enc, callback) {
          assert.equal(file.contents.toString('utf8'), translated);
          n++;
          callback();
          done();
        };

        var _flush = function(callback) {
          assert.equal(n, 1);
          callback();
        };

        var t = through.obj(_transform, _flush);
        translator.pipe(t);
        translator.end(new File({
          contents: content
        }));
      });

      it("should uppercase translated text", function(done){
        var translator = gulpTranslator('./test/locales/en.yml');
        var n = 0;
        var content = new Buffer("[[[ title  ]]] [[[title  | uppercase ]]]");
        var translated = "Title TITLE";

        var _transform = function(file, enc, callback) {
          assert.equal(file.contents.toString('utf8'), translated);
          n++;
          callback();
        };

        var _flush = function(callback) {
          assert.equal(n, 1);
          done();
          callback();
        };

        var t = through.obj(_transform, _flush);
        translator.pipe(t);
        translator.end(new File({
          contents: content
        }));
      });

      xit("should uppercase after lowercase translated text", function(done){
        var translator = gulpTranslator('./test/locales/en.yml');
        var n = 0;
        var content = new Buffer("[[[ title  ]]] [[[title | lowercase | uppercase ]]]");
        var translated = "Title TITLE";

        var _transform = function(file, enc, callback) {
          assert.equal(file.contents.toString('utf8'), translated);
          n++;
          callback();
        };

        var _flush = function(callback) {
          assert.equal(n, 1);
          done();
          callback();
        };

        var t = through.obj(_transform, _flush);
        translator.pipe(t);
        translator.end(new File({
          contents: content
        }));
      });

      it("should add slashes translated text", function(done){
        try {
          var translator = gulpTranslator('./test/locales/en.yml');
          var n = 0;
          var content = new Buffer("[[[ specialchar  ]]] [[[ specialchar | addslashes ]]]");
          var translated = "Author's name Author\\'s name";

          var _transform = function(file, enc, callback) {
            assert.equal(file.contents.toString('utf8'), translated);
            n++;
            callback();
          };

          var _flush = function(callback) {
            assert.equal(n, 1);
            done();
            callback();
          };

          var t = through.obj(_transform, _flush);
          translator.pipe(t);
          translator.end(new File({
            contents: content
          }));
        } catch (e) {
        }

      });

      it("should throw error if unsupported filter", function(done){
        var translator = gulpTranslator('./test/locales/en.yml');
        var n = 0;
        var content = new Buffer("[[[ title  ]]] [[[title  | unsupported ]]]");

        var _transform = function(file, enc, callback) {
          assert.equal(file.contents.toString('utf8'), translated);
          n++;
          callback();
        };

        var _flush = function(callback) {
          assert.equal(n, 0);
          callback();
        };

        translator.on('error', function(err){
          assert.equal(err.message, 'unsupported filter is not supported and is used in /path');
          done();
        });

        var t = through.obj(_transform, _flush);
        translator.pipe(t);
        translator.end(new File({
          path: '/path',
          contents: content
        }));
      });
    });
  });

  describe('with stream contents', function() {
    it('should emit errors', function(done) {
      var translator = gulpTranslator('./test/locales/en.yml');
      var content = Readable("[[[ title ]]] [[[title]]]");

      var n = 0;

      var _transform = function(file, enc, callback) {
        n++;
        callback();
      };

      var _flush = function(callback) {
        assert.equal(n, 0);
        callback();
      };

      translator.on('error', function(err){
        assert.equal(err.message, "Streaming not supported");
        done();
      });

      var t = through.obj(_transform, _flush);

      translator.pipe(t);
      translator.end(new File({
        contents: content
      }));
    });
  });
});

function Readable(content, cb){
  var readable = new Stream.Readable();
  readable._read = function() {
    this.push(new Buffer(content));
    this.push(null); // no more data
  };
  if (cb) readable.on('end', cb);
  return readable;
}
