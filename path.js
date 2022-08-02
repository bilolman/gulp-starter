exports.path = {
	build: {
		html: './build',
		css: './build/assets/css',
		js: './build/assets/js',
		img: './build/assets/img',
		fonts: './build/assets/fonts',
	},
	dist: {
		html: './dist',
		css: './dist/assets/css',
		js: './dist/assets/js',
		img: './dist/assets/img',
		fonts: './dist/assets/fonts',
	},
	src: {
		html: './src/*.html',
		css: './src/assets/sass/style.scss',
		js: './src/assets/js/*.js',
		img: './src/assets/img/**/*.*',
		fonts: './src/assets/fonts/**/*.{eot,woff,woff2,ttf,otf,svg}',
	},
	watch: {
		html: './src/**/*.html',
		css: './src/assets/sass/**/*.scss',
		js: './src/assets/js/**/*.js',
		img: './src/assets/img/**/*.*',
		fonts: './src/assets/fonts/**/*.{eot,woff,woff2,ttf,otf,svg}',
	},
}
