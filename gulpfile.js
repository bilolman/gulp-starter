const { src, dest, watch, parallel, series } = require('gulp')
const { path } = require('./path')
const autoprefixer = require('gulp-autoprefixer')
const cssbeautify = require('gulp-cssbeautify')
const removeComments = require('gulp-strip-css-comments')
const rename = require('gulp-rename')
const sass = require('gulp-dart-sass')
const cssnano = require('gulp-cssnano')
const uglify = require('gulp-uglify')
const plumber = require('gulp-plumber')
const imagemin = require('gulp-imagemin')
const del = require('del')
const panini = require('panini')
const notify = require('gulp-notify')
const sourcemaps = require('gulp-sourcemaps')
const concat = require('gulp-concat')
const browsersync = require('browser-sync').create()

function browserSync(done) {
	browsersync.init({
		notify: false,
		server: {
			baseDir: './dist',
		},
	})

	done()
}

function devHtml() {
	panini.refresh()
	return src(path.src.html, { base: 'src/' })
		.pipe(
			plumber({
				errorHandler: function (err) {
					notify.onError({
						title: 'HTML Error',
						message: 'Error: <%= error.message %>',
					})(err)
					this.emit('end')
				},
			})
		)
		.pipe(
			panini({
				root: 'src/',
				layouts: 'src/layouts/',
				partials: 'src/partials/',
				helpers: 'src/helpers/',
				data: 'src/data/',
			})
		)
		.pipe(dest(path.dist.html))
		.pipe(browsersync.reload({ stream: true }))
}

function buildHtml() {
	panini.refresh()
	return src(`${path.dist.html}/*.html`, { base: 'dist/' }).pipe(
		dest(path.build.html)
	)
}

function devCss() {
	return src(path.src.css, { base: './src/assets/sass/' })
		.pipe(
			plumber({
				errorHandler: function (err) {
					notify.onError({
						title: 'SCSS Error',
						message: 'Error: <%= error.message %>',
					})(err)
					this.emit('end')
				},
			})
		)
		.pipe(sass().on('error', sass.logError))
		.pipe(dest(path.dist.css))
		.pipe(browsersync.reload({ stream: true }))
}

function buildCss() {
	return src(`${path.dist.css}/*.css`, { base: './dist/assets/css/' })
		.pipe(
			autoprefixer({
				cascade: true,
			})
		)
		.pipe(cssbeautify())
		.pipe(dest(path.build.css))
		.pipe(sourcemaps.init())
		.pipe(
			cssnano({
				zindex: false,
				discardComments: {
					removeAll: true,
				},
			})
		)
		.pipe(removeComments())
		.pipe(
			rename({
				suffix: '.min',
				extname: '.css',
			})
		)
		.pipe(sourcemaps.write())
		.pipe(dest(path.build.css))
}

function devJs() {
	return src(['./src/assets/js/**/*.js'], { base: './src/assets/js/' })
		.pipe(
			plumber({
				errorHandler: function (err) {
					notify.onError({
						title: 'JS Error',
						message: 'Error: <%= error.message %>',
					})(err)
					this.emit('end')
				},
			})
		)
		.pipe(concat('app.js'))
		.pipe(dest(path.dist.js))
		.pipe(browsersync.reload({ stream: true }))
}

function buildJs() {
	return src(`${path.dist.js}/*.js`, { base: './dist/assets/js/' })
		.pipe(dest(path.build.js))
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(
			rename({
				suffix: '.min',
				extname: '.js',
			})
		)
		.pipe(sourcemaps.write())
		.pipe(dest(path.build.js))
}

function devImages() {
	return src(path.src.img, { base: './src/assets/img/' })
		.pipe(dest(path.dist.img))
		.pipe(browsersync.reload({ stream: true }))
}

function buildImages() {
	return src(`${path.dist.img}/**/*.*`, { base: './dist/assets/img/' })
		.pipe(
			imagemin([
				imagemin.gifsicle({ interlaced: true }),
				imagemin.mozjpeg({ quality: 80, progressive: true }),
				imagemin.optipng({ optimizationLevel: 5 }),
				imagemin.svgo({
					plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
				}),
			])
		)
		.pipe(dest(path.build.img))
}

function devFonts() {
	return src(path.src.fonts, { base: './src/assets/fonts/' })
		.pipe(dest(path.dist.fonts))
		.pipe(browsersync.reload({ stream: true }))
}

function buildFonts() {
	return src(`${path.dist.fonts}/*.{eot,woff,woff2,ttf,otf,svg}`, {
		base: './dist/assets/fonts/',
	}).pipe(dest(path.build.fonts))
}

function devClean() {
	return del('./dist')
}

function buildClean() {
	return del('./build')
}

function watchFiles() {
	watch([path.watch.html], devHtml)
	watch([path.watch.css], devCss)
	watch([path.watch.js], devJs)
	watch([path.watch.img], devImages)
	watch([path.watch.fonts], devFonts)
}

exports.default = series(
	devClean,
	parallel(devHtml, devCss, devJs, devImages, devFonts),
	browserSync,
	watchFiles
)

exports.build = series(
	buildClean,
	parallel(buildHtml, buildCss, buildJs, buildImages, buildFonts)
)
