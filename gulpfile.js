const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
//const sass = require('gulp-sass'); //somente para projetos que requerem sass e esteja instalado gulp-sass
//const autoprefixer = require('gulp-autoprefixer'); //somente para projetos que requerem sass e esteja instalado gulp-autoprefixer

/** Exemplo do proprio site do gulp */
/**
gulp.taks('task_name', () => {
    //javascript commands
    //gulp.src é utilizado para informar os arquivos a serem modificados, usados etc...
    //pipe é o que vc informa o que quer que faz com o arquivo
});
 */

/** GULP-SASS */
/**function execSass(){
    return gulp.src('scss/*.scss')
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dist/css/'))
        .pipe(browserSync.stream());
}

gulp.task('sass', execSass);**/

const watch = () => {
    gulp.watch('src/*.js', concatJs);
    //gulp.watch(['src/*.js', 'css/*.scss'], gulp.parallel('compJs')); //exemplo com multiplos tipos de arquivos
}

//funçao unificar arquivos js
const concatJs = () => {
    return gulp.src('src/*.js')
    .pipe(concat('mediaDevicesHelper.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/'));
}

exports.mainJs = concatJs;
exports.watch = watch;
console.log(uglify);
gulp.task('default', gulp.parallel(watch));
