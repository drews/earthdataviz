console.log("running app.js");
require('earth-projections');
require('dataset-controls');

var d3 = require('d3'),
    angular = require('angular');


var app = angular.module('earthdataviz', ['earth-projections']);

//require('controls')(app);

function load_image_into(image, canvasId){
    var canvas = document.getElementById(canvasId);
    var ctx = canvas.getContext('2d');
    canvas.height = image.height;
    canvas.width = image.width;
    ctx.drawImage( image, 0, 0 );
}

function project_to(image,projection,source,target){
    var sx = image.width,
        sy = image.height;

    var tx = 800,
        ty = 600;

    var path = d3.geo.path()
        .projection(projection);

    var source_canvas = document.getElementById(source),
        source_ctx = source_canvas.getContext('2d');

    source_ctx.drawImage( image, 0, 0, sx, sy );
    var source_data = source_ctx.getImageData( 0, 0, sx, sy ).data;

    var target_canvas = document.getElementById(target),
        target_ctx = target_canvas.getContext('2d'),
        target_data = target_ctx.createImageData( tx, ty );

    for ( var y = 0; y < ty; ++y ) {
        var i = -1;
        for ( var x = 0; x < tx; ++x ) {
	    var p = projection.invert([x,y]),
                lambda = p[0],
                phi = p[1];
            // check bounds
            if ( lambda > 180 || lambda < -180 || phi > 90 || phi < -90 ) {
                i += 4;
                continue
            }
            // pick a point in the source projection...
            var q = ((90 - phi) / 180 * ty | 0) * tx + ((180 + lambda) / 360 * tx | 0) << 2;
            // ... and copy it's RGBA value to destination projection
            target_data[++i] = source_data[q];   // red
            target_data[++i] = source_data[++q]; // green
            target_data[++i] = source_data[++q]; // blue
            target_data[++i] = 255;              // alpha
        }
    }
    // clear the target canvas then paint the projected image
    target_ctx.clearRect( 0, 0, tx, ty );
    target_ctx.putImageData( target_data, 0, 0 );
}

//document.onload = function() {
    console.log("document loaded");
    var blue_marble = new Image();
    blue_marble.onload = function() {
        console.log("blue marble loaded!");
    //    project_to( this, d3.geo.kavrayskiy7(), "raw", "ortho" );
        project_to( this, d3.geo.orthographic(), "raw", "ortho" );
    };
    blue_marble.src = "./assets/2048.jpg";
//}

/*
function load_ortho_into(sourceId, destId) {

//    var projection = d3.geo.orthographic()
//        .translate([2048 / 2, 1024 / 2])
//        .scale(scale)
//        .clipAngle(90);

    var source_canvas = document.getElementById(sourceId);
    var dest_canvas = document.getElementById(destId);
    console.log(dest_canvas);

    var width = source_canvas.width,
        height = source_canvas.height,
    
        radius = (height / 2) - 5;
    dest_canvas.width = width;
    dest_canvas.height = height;

    var context = dest_canvas.getContext('2d');
    context.beginPath();
    context.arc(width / 2, height / 2, radius, 0, 2 * Math.PI, true);
    context.strokeStyle = "white";
    context.lineWidth = 2.5;
    context.stroke(); 
}

*/
/*app.controller('controlsCtrl',[function() {
    this.foo = "this is a test...";


}]);
*/
/*
function load_dataset()
{
    var canvas = document.getElementById("raw");
    var context = canvas.getContext('2d');
    var imageObj = new Image();
    imageObj.onload = function() {
        canvas.height = this.height;
        canvas.width = this.width;
        context.drawImage(this, 0, 0);
    };

    imageObj.src = "./assets/2048.jpg";
}

/*

var width = 960,
    height = 500;

var projection = d3.geo.kavrayskiy7();

var path = d3.geo.path()
    .projection(projection);

var canvas = d3.select("body").append("canvas")
    .attr("width", width)
    .attr("height", height);

var context = canvas.node().getContext("2d");

var image = new Image;
image.onload = onload;
image.src = "readme-blue-marble.jpg";

function onload() {
  var dx = image.width,
      dy = image.height;

  context.drawImage(image, 0, 0, dx, dy);

  var sourceData = context.getImageData(0, 0, dx, dy).data,
      target = context.createImageData(width, height),
      targetData = target.data;

  for (var y = 0, i = -1; y < height; ++y) {
    for (var x = 0; x < width; ++x) {
      var p = projection.invert([x, y]), Î» = p[0], Ï = p[1];
      if (Î» > 180 || Î» < -180 || Ï > 90 || Ï < -90) { i += 4; continue; }
      var q = ((90 - Ï) / 180 * dy | 0) * dx + ((180 + Î») / 360 * dx | 0) << 2;
      targetData[++i] = sourceData[q];
      targetData[++i] = sourceData[++q];
      targetData[++i] = sourceData[++q];
      targetData[++i] = 255;
    }
  }

  context.clearRect(0, 0, width, height);
  context.putImageData(target, 0, 0);
}

*/



