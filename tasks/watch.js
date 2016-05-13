var gulp = require('gulp');

gulp.task('watch', function() {
    gulp.watch('assets/styles/**/*', ['styles']);
    gulp.watch('assets/images/**/*.{jpg,png,gif}', ['imagemin']);
    gulp.watch(['_drafts/*', '_includes/*', '_layouts/*', '_posts/*', '*.{html,md}', '_config.yml'], ['jekyll-rebuild']);
});
