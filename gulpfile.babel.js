import gulp from 'gulp';
import less from 'gulp-less';
import gutil from 'gulp-util';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import tsify from 'tsify';
import buffer from 'vinyl-buffer';
import uglify from 'gulp-uglify';
import nodemon from 'gulp-nodemon';
import livereload from 'gulp-livereload';
import clean from 'gulp-clean';
//import gsync from 'gulp-sync'(gulp);
var gsync = require('gulp-sync')(gulp);


/**
 * Tasks:
 *
 *  build (default):
 *    builds the client into ./dist
 *
 *  develop:
 *    builds client, and runs auto reloading dev server
 *
 *  lint:
 *    lint all javascript sourcefiles
 *
 *  test:
 *    run mocha tests in ./test/
 *
 *  debug:
 *    like develop but also runs tests and linting
 */

gulp.task('default', ['build']);
gulp.task('develop', gsync.sync(['clean', 'browserify', 'less', 'assets', 'serve', 'livereload']));
gulp.task('build', gsync.sync(['browserify', 'less', 'assets']));

/**
 * path globs / expressions for targets below
 */

var paths = {
  main    : 'server/app.js',
  tests   : 'test/**/*.js',
  sources : [ '**/*.js', '!node_modules/**', '!client/vendor/**', '!build/**'],
  client  : {
    main    : 'client/js/app.js',
    sources : 'client/js/**.*.js',
    less  : 'client/**/*.less',
    jade    : 'client/**/*.jade',
    assets  : ['client/**/*', '!client/less', '!client/scripts', '!**/*.ts', '!**/*.less', '!**/*.jade'],
    build   : './build/'
  }
};

gulp.task('assets', ()=>{
	return gulp.src(paths.client.assets)
  			.pipe(gulp.dest(paths.client.build));
});

gulp.task('clean', ()=>{
	gulp.src(paths.client.build, {read: false} )
    .pipe(clean());
});

gulp.task('browserify', ()=>{
	return browserify({
		entries: 'client/bootstrap.ts',
		debug: true
	})
		.plugin(tsify, {
			target: 'es5',
			experimentalDecorators: true
		})
		.bundle()
		.on('error', err=>{
			gutil.log(gutil.colors.red.bold('[browserify error]'));
			gutil.log(err.message);
			this.emit('end');
		})
		.pipe(source('bundle.js'))
		//.pipe(buffer())
		//.pipe(uglify())
		.pipe(gulp.dest('./build/js'));
});

// Преобразовать less в css
gulp.task('less', () => {
	return gulp.src('./client/less/styles.less')
		.pipe(less())
		.on('error', err => {
			gutil.log(gutil.colors.red.bold('[less error]'));
			gutil.log(gutil.colors.bgRed('filename:') +' '+ err.filename);
			gutil.log(gutil.colors.bgRed('lineNumber:') +' '+ err.lineNumber);
			gutil.log(gutil.colors.bgRed('extract:') +' '+ err.extract.join(' '));
			this.emit('end');
		})
		.pipe(gulp.dest('./build/css'))
});

// Наблюдать за изменениями файлов
gulp.task('watch', () => {
	gulp.watch('./client/**/*.ts', ['browserify']);
	gulp.watch('./client/**/*.less', ['less']);
	gulp.watch('./client/**/*.html', ['assets']);

	//gulp.watch('build/**/*.html', ['livereload']);
});

// Собрать приложение и запустить
gulp.task('serve', () => {
	return nodemon({
		script: paths.main, watch: 'server/**/*.js'
	});
});

// Перезагрузка браузера при изменеии приложения
gulp.task('livereload',  ()=>{
	gulp.watch('./client/**/*.ts', ['browserify']);
	gulp.watch('./client/**/*.less', ['less']);   
	gulp.watch('./client/**/*.html', ['assets']); 	
	//livereload();

  	
  	livereload.listen();
  	var all_build_files = './build/**/*';

  	return gulp.watch(all_build_files, function(evt){    			
    			livereload.changed(evt.path);    			
  			});
});