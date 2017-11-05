const gulp = require('gulp');
const ts = require('gulp-typescript');
const clean = require('gulp-clean');
const runSequence = require('run-sequence');

gulp.task('build', function() {
    const merge = require('merge2');
    const tsProject = ts.createProject('tsconfig.json');
    var tsResult = tsProject.src()
        .pipe(tsProject());

    return merge([
        tsResult.dts.pipe(gulp.dest('./definitions')),
        tsResult.js.pipe(gulp.dest(tsProject.config.compilerOptions.outDir))
    ]);
});

gulp.task('clean', function () {
    return gulp.src('dist', { read: false })
        .pipe(clean());
});

gulp.task('default', [], function(cb) {
    runSequence('clean', 'build', cb);
});