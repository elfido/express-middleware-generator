"use strict";
var gulp = require("gulp"),
	util = require("gulp-util"),
	bump = require("gulp-bump"),
	mocha = require('gulp-mocha');

gulp.task("test", function(cb){
	let mochaErr ;
	gulp.src('test/**/*.js')
	.pipe(mocha({reporter: "spec", timeout: 60000}))
	.on('error', function (err) {
		console.log(err);
		mochaErr = err;
	})
	.on('end', function () {
		cb(mochaErr);
	});
});

gulp.task('bump', function(){
	let type = generatorHelpers.getBumpOption();
	console.log(type);
	gulp.src('./package.json')
	.pipe(bump( type ))
	.pipe(gulp.dest('./'));
});


var generatorHelpers = {
	bumpParams: ["--patch", "--minor", "--major", "--prerelease"],
	getBumpOption: function(){
		let args = process.argv,
			res = {type: "patch"},
			opt = (args.length>2) ? args[3].toLocaleLowerCase() : null;
		if ( opt !== null && generatorHelpers.bumpParams.indexOf(opt)>=0 ){
			opt = opt.replace("--", "");
			res = {type: opt};
		}
		if ( opt !== null && opt.indexOf("--version") === 0){
			let _version = opt.split(":");
			if (_version.length<1){
				console.error("Invalid version");
			}
			res = {version: _version[1]};
		}
		return res;
	}
}