var gulp = require('gulp');

gulp.task('watch', function() {
    gulp.watch('assets/images/**/*.{jpg,png,gif}', ['imagemin']);
    gulp.watch(['_drafts/*', '_sass/**/*', '_includes/*', '_layouts/*', '_posts/*', '*.{html,md}', '_config.yml'], ['jekyll-rebuild']);
});
