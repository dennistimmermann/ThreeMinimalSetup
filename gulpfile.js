var gulp = require('gulp')
var browserify = require('browserify')
var watchify = require('watchify')
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var babelify = require('babelify')
var gutil = require('gulp-util')
var sourcemaps = require('gulp-sourcemaps')
var shader = require('browserify-shader')
var uglify = require('gulp-uglify')
var header = require('gulp-header')
var browserSync = require('browser-sync').create()
var run = require('run-sequence')
var _ = require('lodash')
var config = require('./config')
var argv = require('yargs')
	//.usage('Imagemin all images: $0 imagemin [--out directory] [--level 0...7] [--input input files')
	.default('m', 'main').alias('m', 'module').describe('m', 'which module to load.')
    .help('?').alias('?', 'help')
	.argv;

var ENV = 'development'

var banner = ['/**',
  ' * @build ${build}',
  ' * @env ${env}',
  ' */',
  ''].join('\n')

var getify = function(input, env) {
	var debug = env == 'development' ? true : false
	var bundle = browserify({
		basedir: 'app/src/js',
		entries: [input],
		// paths: ['app/vendor'],
		fullPaths: false, //prob disable for production
		//builtins: list of builtins to use
		// detectGlobals: false, // enable if unsing process, global, __filename, __dirname
		debug: debug, //disable for production
		ignore: [],
		cache: {},
		packageCache: {}
	})

	bundle.transform(shader)
	bundle.transform("babelify", {presets: ["es2015"], sourceMaps: true})

	return bundle
}

var build = function(bundle, name, env) {
	var info = []
	_.forIn(config(env), function(value, key) {
		var t = _.template('var ${key} = ${value};')
		info.push(t({key: key, value: JSON.stringify(value)}))
	})

	var info = info.join('\n')

	return bundle.bundle()

		.on('error', function(err) {
			if(err.message) {
				console.dir(err.message)
				err.loc && console.log('Line:',err.loc.line, 'Column:', err.loc.column)
				err.codeFrame && console.log(err.codeFrame)
			}
			else {
				gutil.log(err)
			}
			// this.emit('end')
		})
		.pipe(source(name))
		.pipe(buffer())
		.pipe(sourcemaps.init({
			loadMaps: true
		}))
		.pipe(header(banner, { build : Date.now(), env: env } ))
		.pipe(header(info, {} ))
		.pipe(env == 'production' ? uglify() : gutil.noop())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./www/js'))
}

var compile = function(input, output, env, taskname) {
	ENV = env = env || 'development'

	var bundle = getify(input, env)
	if(env == 'development') {
		bundle = watchify(bundle)
		bundle.on('log', function(e) {
			gutil.log(gutil.colors.blue('[browserify]'), gutil.colors.gray(taskname), e)
		}); // output build logs to terminal
		bundle.on('update', function(e) {
			browserSync.notify("compiling "+taskname+"...")
			gutil.log(gutil.colors.blue('[watchify]'), gutil.colors.gray(taskname), e)
			var b = build(bundle, output, env)
			browserSync.notify(taskname+"...done")
			return b
		})
	}
	return build(bundle, output, env)
}

var get_running = function(t) {
	return _.pluck(_.where(_.values(t.tasks), {running: true}), 'name')[0]
}

var queue_reload = _.debounce(function() {
	browserSync.reload()
	browserSync.notify("... :)")
}, 1000)

gulp.task('watch-webgl', function() {
	return compile('index.js', 'build.js', 'development', 'main')
	//return compile('index.js', 'build.js', 'development', 'main')
})

gulp.task('build-webgl', function() {
	return compile('index.js', 'build.js', 'production', 'main')
})

gulp.task('clean', function(cb) {
	cb()
})

gulp.task('sync', function(cb) {
	browserSync.init({
        server: {
            baseDir: "./www/"
        }
    })

    gulp.watch("www/**/*.css", function(e) {
    	gutil.log(gutil.colors.blue('[reload]'), e.path, 'was', e.type, ', trying to apply changes.')
    	gulp.src('www/**/*.css')
    		.pipe(browserSync.stream())
    })
	gulp.watch(['www/**/*', '!**/*.js.map', '!**/*.css'], function(e) {
		browserSync.notify("waiting for reload...")
		gutil.log(gutil.colors.blue('[reload]'), e.path, 'was', e.type, '- queueing reload.')
		queue_reload()
	})
})

gulp.task('default', ['watch'])
gulp.task('watch', function() {
	run('clean', ['watch-webgl'], 'sync')
})
gulp.task('build', ['build-webgl'])
