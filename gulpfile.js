var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del'),
    concat = require('gulp-concat'),
    replace = require('gulp-replace'),
    replace = require('gulp-replace'),
    fs = require('fs'),
    rimraf = require('gulp-rimraf'),
    s3 = require('gulp-s3-upload')(config),
    pump = require('pump'),
    htmlToJS = require('gulp-html-to-js'),
    webserver = require('gulp-webserver'),
    htmlmin = require('gulp-htmlmin'),
    rename = require("gulp-rename"),
    rp = require("request-promise"),
    config = { useIAM: true };

var buttonUploadName = 'sezzle-widget0.0.1.js';
var bannerUploadName = 'sezzle-banner2.1.1.js';
var globalCssUploadName = 'sezzle-shopify-styles-global1.0.0.css';

gulp.task("cssupload", function() {
    // bucket base url https://d3svog4tlx445w.cloudfront.net/
    var indexPath = './css/sezzle-common.css'
    gulp.src(indexPath)
        .pipe(rename('shopify-app/assets/' + globalCssUploadName))
        .pipe(s3({
            Bucket: 'sezzlemedia', //  Required
            ACL: 'public-read'       //  Needs to be user-defined
        }, {
            maxRetries: 5
        }))
});

gulp.task("upload-widget", function() {
    var indexPath = './sezzle.js'
    gulp.src(indexPath)
        .pipe(rename(buttonUploadName))
        .pipe(s3({
            Bucket: 'sezzle-shopify-application', //  Required
            ACL: 'public-read'       //  Needs to be user-defined
        }, {
            // S3 Constructor Options, ie:
            maxRetries: 5
        }));
});

gulp.task("post-button-to-widget-server", function() {
    var options = {
        method: 'POST',
        uri: 'https://widget.sezzle.com/v1/javascript/price-widget/version',
        body: {
            'version_name': buttonUploadName
        },
        json: true
    }
    rp(options)
        .then(function(body) {
            console.log("Posted new version to shopify wrapper")
        })
        .catch(function(err) {
            console.log("Post failed with shopify, ")
            console.log(err);
        })
});

gulp.task('post-button-css-to-wrapper', function() {
	console.log("Posting css version to shopify gateway")
	  var options = {
		  method: 'POST',
		  uri: 'https://widget.sezzle.com/v1/css/price-widget/version',
		  body: {
			  'version_name': globalCssUploadName
		  },
		  json: true
	  }
	  rp(options)
		  .then(function(body) {
			  console.log("Posted new version to shopify wrapper")
		  })
		  .catch(function(err) {
			  console.log("Post failed with sezzle pay, ")
			  console.log(err);
		  })
  })

gulp.task("deploywidget", ["upload-widget", "post-button-to-widget-server"])
gulp.task("deploycss", ["cssupload", "post-button-css-to-wrapper"])
