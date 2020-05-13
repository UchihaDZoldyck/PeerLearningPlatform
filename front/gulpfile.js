var gulp = require("gulp");
var cssnano = require("gulp-cssnano");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var cache = require("gulp-cache");
var imagemin = require("gulp-imagemin");
var bs = require("browser-sync").create();
var sass = require("gulp-sass");
var util = require("gulp-util");
var sourcemaps = require("gulp-sourcemaps");


var path ={
	'html': './templates/**/',
    'css': './src/css/**/',
    'js': './src/js/',
    'images': './src/images/',
    'css_dist': './dist/css',
    'js_dist': './dist/js',
    'images_dist': './dist/images'
};
//define a html task
gulp.task("html", function () {
	gulp.src(path.html + '*.html')
		.pipe(bs.stream())
});

//define a css task
gulp.task("css", function(){
    gulp.src(path.css + '*.scss')    //find the path of original (s)css files
		.pipe(sass().on("error", sass.logError)) //
        .pipe(cssnano())            //compress
        .pipe(rename({"suffix":".min"}))    //add ".min" as a suffix
    	.pipe(gulp.dest(path.css_dist)) //add file to dist
		.pipe(bs.stream())
});

//define a js task
gulp.task("js", function(){
	gulp.src(path.js + '*.js')
		.pipe(sourcemaps.init())
		.pipe(uglify().on("error", util.log))
        .pipe(rename({"suffix":".min"}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.js_dist))
		.pipe(bs.stream())

});

//define a images task
gulp.task("images", function(){
	gulp.src(path.images + '*.*')
		.pipe(cache(imagemin()))
		.pipe(gulp.dest(path.images_dist))
		.pipe(bs.stream())
});

//define a watching files task
gulp.task("watch", function(){
	gulp.watch(path.html + '*.html', ['html']);
	gulp.watch(path.css + '*.scss', ['css']);
	gulp.watch(path.js + '*.js', ['js']);
	gulp.watch(path.images + '*.*', ['images']);
});

//initialize browser-sync task
gulp.task("bs", function(){
	bs.init({
		'server':{
			'baseDir': './'
		}
	});
});

//a default task
gulp.task("default", ['watch']);