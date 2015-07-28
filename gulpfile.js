var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    jshint = require('gulp-jshint'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    del = require('del'),
    sass = require('gulp-sass'),
//    autoprefixer = require('gulp-autoprefixer'),
    ngAnnotate =  require('gulp-ng-annotate'),
//    uglify =  require('gulp-uglify'),
    flatten = require('gulp-flatten');
    // chartjs = require('chartjs')


gulp.on('err', function(e) {
  console.log(e.err.stack);
});

// Modules for webserver and livereload
var express = require('express'),
    refresh = require('gulp-livereload'),
    livereload = require('connect-livereload'),
    livereloadport = 45729,
    serverport = 9000;


// Set up an express server (not starting it yet)
var server = express();
server.use(livereload({port: livereloadport}));// Add live reload
server.use(express.static('./dist')); // Use our 'dist' folder as rootfolder
gulp.task('clean', [], function() {
    del.sync(['dist/*','dist/**/*']);
});

gulp.task('scripts', [], function() {
    gulp.src('./src/app.js')
        .pipe(browserify({
          insertGlobals : true,
          debug : true,
          paths: ['./node_modules','./src']
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('static', [], function() {
    gulp.src(['./node_modules/angular/**/*.min.js']).pipe(flatten()).pipe(gulp.dest('dist/js'));
    gulp.src(['./style/*.css']).pipe(gulp.dest('dist/'));
    gulp.src(['./src/*.html']).pipe(flatten()).pipe(gulp.dest('dist/'));
    gulp.src('./assets/*').pipe(flatten()).pipe(gulp.dest('dist/assets'));
});

gulp.task('watch', [], function() {
    server.listen(serverport);// Start webserver
    refresh.listen(livereloadport);// Start live reload
    gulp.watch(['./src/*','./src/**/*','style/*'],['static']);
    gulp.watch(['./src/*.js', './src/**/*.js'],['scripts']);
    gulp.watch('./dist/**').on('change', refresh.changed);
});

// Default task
gulp.task('default', ['static', 'scripts', 'watch']);
