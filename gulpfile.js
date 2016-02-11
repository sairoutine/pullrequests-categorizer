'use strict';

var source_dir = './src/js/**/*.js';

var tmp_dir = './tmp/';

var dist_dir = './js/';

var appjs = 'app.js';

var appminjs = 'app.min.js';

var watch      = require('gulp-watch');
var browserify = require('browserify');
var gulp       = require('gulp');
var source     = require('vinyl-source-stream');
var uglify     = require("gulp-uglify");
var msx        = require("gulp-msx");
var rename     = require('gulp-rename');
var plumber    = require('gulp-plumber');
var runSequence= require('run-sequence');
var path       = require('path');

gulp.task('msx', function() {
	return gulp.src(source_dir)
	.pipe(plumber())
	.pipe(msx()) 
	.pipe(gulp.dest(tmp_dir));
});

gulp.task('browserify', function() {
	return browserify(path.join(tmp_dir, appjs))
		.bundle()
		.pipe(plumber())
		.pipe(source(appjs))
		.pipe(gulp.dest(dist_dir));
});

gulp.task('minify', function() {
	return gulp.src(path.join(dist_dir, appjs))
		.pipe(uglify())
		.pipe(rename(appminjs))
		.pipe(gulp.dest(dist_dir));
});


gulp.task('build', function(callback) {
	return runSequence(
		'msx',
		'browserify',
		'minify',
		callback
	);
});

gulp.task('watch', function() {
	gulp.watch('src/js/**/*.js', ['build']);
});
