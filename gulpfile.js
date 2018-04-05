const settings = require('./settings');

const gulp = require('gulp');
const browserSync = require('browser-sync'); // Сервер
const pug = require('gulp-pug'); // HTML преероцессор
const sass = require('gulp-sass'); // CSS преероцессор
const autoprefixer = require('gulp-autoprefixer'); // Добавляет вендорные префиксы CSS
const data = require('gulp-data'); // Позволяет использовать JSON файлы для хранения данных, данные могут быть вызваны в PUG в качестве объекта
const plumber = require('gulp-plumber'); // В случае ошибки в PUG или SASS сервер не падает
const gulpIf = require('gulp-if'); // Позволяет использовать особый синтаксис IF ELSE в GULP
const clean = require('gulp-clean'); // Удаление папок / файлов - тут нигде не используется
const fs = require('fs'); // Необходимо для работы gulp-data с JSON
const csso = require('gulp-csso'); // Минификация CSS
const minify = require('gulp-minify'); // Минификация JS
const babel = require('gulp-babel'); // Преобразование нового синтаксиса JS в старый
const concat = require('gulp-concat'); // Объеденяет все файлы JS в 1
const imagemin = require('gulp-imagemin'); // Сжатие картинок
const sourcemaps = require('gulp-sourcemaps'); // Необходимо для отладки скриптов - чтобы понимать где произошла ошибка
const svgSymbols = require('gulp-svg-symbols'); // Создание SVG спрайтов - иконки на страницы можно добавлять с помощью миксина "icon"
const runSequence = require('run-sequence'); // Последовательность задач
const ftp = require('vinyl-ftp');
const gutil = require( 'gulp-util' );
const rename = require('gulp-rename');



const isProduction= process.env.NODE_ENV ? true : false;

gulp.task('serve', ['pug', 'ftp-css', 'ftp-js', 'sass', 'js', 'copy', 'sprite-svg'], () => {
	browserSync.init({
			server: {
				baseDir: "./build"
			}
	});
	gulp.watch('build/css/style.css', ['ftp-css']);
	gulp.watch('build/js/app.js', ['ftp-js']);
	gulp.watch('src/', ['copy']);
	gulp.watch('src/assets/icons', ['sprite-svg']);
	gulp.watch('src/**/*.sass', ['sass']);
	gulp.watch('src/**/*.pug', ['pug']);
	gulp.watch('src/**/*.js', ['js']);
	gulp.watch('src/data/*.json', ['pug', 'sass', 'js']);
	gulp.watch('build/**/*.*').on('change', browserSync.reload);
});

// PUG
gulp.task('pug', () => {
	return gulp.src('src/pages/*.pug')
		.pipe(plumber())
		.pipe(data( ()=> {
			return JSON.parse(fs.readFileSync('./src/data/data.json'));
		}))
		.pipe( pug( { pretty: isProduction ? false : true } ) )
		.pipe(gulp.dest('build'));

});

// SASS
gulp.task('sass', () => {
	setTimeout( () => {
		return gulp.src('src/assets/style.sass')
			.pipe(plumber())
			.pipe(sass())
			.pipe(gulpIf( !isProduction, sourcemaps.init() ))
			.pipe(autoprefixer())
			.pipe(gulpIf( isProduction, csso() ))
			.pipe(gulpIf( !isProduction, sourcemaps.write() ))
		.pipe(gulp.dest('build/css/'));
	},500 );
});

// JS
gulp.task('js', () => {
	return gulp.src('src/block/**/*.js')
		.pipe(babel({presets: ['es2015']}))
		.pipe(gulpIf( !isProduction, sourcemaps.init() ))
		.pipe(concat('app.js'))
		.pipe(gulpIf( isProduction, minify({ext : {
					src : '-debug.js',
					min : '.js'
				}
			})
		))
		.pipe(gulpIf( !isProduction, sourcemaps.write() ))
	.pipe(gulp.dest('build/js/'));
});

// SVG sprite
gulp.task('sprite-svg', ()=> {
	return gulp.src('src/assets/icons/*.svg')
		.pipe(gulpIf( isProduction, imagemin() ))
		.pipe(svgSymbols({
			default: ['default-svg', 'default-css']
		}))
		.pipe(gulp.dest('build/img'));
});

// COPY
gulp.task('copy', () => {
	gulp.src('src/assets/fonts/**/*')
		.pipe(gulp.dest('build/fonts'))
	gulp.src(['src/assets/img/**/*'])
		.pipe(gulpIf( isProduction, imagemin() ))
		.pipe(gulp.dest('build/img'))
	gulp.src('src/assets/root/**/*')
		.pipe(gulp.dest('build'));
	gulp.src('src/assets/vendor/**/*')
		.pipe(gulp.dest('build/vendor'));
});


// FTP
gulp.task( 'ftp-css',  () =>{
	let connfig = ftp.create( {
		host: settings.host,
		user: settings.user,
		password: settings.password,
		parallel: 10,
		log: gutil.log
	} );

	let globs = [
		'./build/css/style.css'
	];
	return gulp.src( globs, { base: '.', buffer: false } )
		.pipe(rename({dirname: ''}))
		.pipe( connfig.dest( '/i/css' ) );
} );

gulp.task( 'ftp-js',  () =>{
	let connfig = ftp.create( {
		host: settings.host,
		user: settings.user,
		password: settings.password,
		parallel: 10,
		log: gutil.log
	} );

	let globs = [
		'./build/js/app.js'
	];
	return gulp.src( globs, { base: '.', buffer: false } )
		.pipe(rename({dirname: ''}))
		.pipe( connfig.dest( '/i/js' ) );
} );

gulp.task('default', ()=> {
	runSequence(['serve']);
});