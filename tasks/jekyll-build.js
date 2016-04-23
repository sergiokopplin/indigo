var gulp = require('gulp'),
    cp   = require('child_process');

gulp.task('jekyll-build', function (done) {
    return cp.spawn('bundle', ['exec', 'jekyll', 'build', '--drafts', '--quiet', '--config', '_config.yml,_config_dev.yml'], {stdio: 'inherit'}).on('close', done);
    // return cp.spawn('bundle', ['exec', 'jekyll', 'build'], {stdio: 'inherit'}).on('close', done);
});
