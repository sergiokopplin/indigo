var gulp        = require('gulp'),
    browserSync = require('browser-sync'),
    plumber     = require('gulp-plumber'),
    changed     = require('gulp-changed'),

    // stylus
    stylus      = require('gulp-stylus'),
	rupture     = require('rupture'),
	prefixer    = require('autoprefixer-stylus'),
    nib         = require('nib');

gulp.task('styles', function() {
    return gulp.src('src/styles/main.styl')
        .pipe(changed('assets/styles'))
        .pipe(plumber())
        .pipe(stylus({
            use:[prefixer(), rupture(), nib()],
			compress: false
        }))
        .pipe(gulp.dest('_site/assets/styles'))
        .pipe(gulp.dest('_includes'))
        .pipe(browserSync.reload({stream: true}))
        .pipe(gulp.dest('assets/styles'));
});
