var gulp        = require('gulp'),
    browserSync = require('browser-sync');

gulp.task('browserSync', ['jekyll-build'], function() {
    browserSync({
        server: { baseDir: "_site/" }
    });
});
