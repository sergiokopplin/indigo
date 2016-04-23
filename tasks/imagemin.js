var gulp        = require('gulp'),
    plumber     = require('gulp-plumber'),

    // images
    imagemin    = require('gulp-imagemin');

gulp.task('imagemin', function(tmp) {
    return gulp.src('src/images/**/*.{jpg,png,gif}')
        .pipe(plumber())
        .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
        .pipe(gulp.dest('src/images'));
});
