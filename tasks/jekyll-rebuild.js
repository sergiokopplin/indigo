var gulp        = require('gulp'),
    browserSync = require('browser-sync');

gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});
