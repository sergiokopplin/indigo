var gulp        = require('gulp'),
    plumber     = require('gulp-plumber'),
    changed     = require('gulp-changed'),

    // images
    imagemin    = require('gulp-imagemin');

gulp.task('imagemin', function(tmp) {
    return gulp.src('assets/images/**/*.{jpg,png,gif}')
        .pipe(changed('assets/images'))
        .pipe(plumber())
        .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
        .pipe(gulp.dest('assets/images'));
});
