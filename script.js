// Handling resizing of the canvas
var canvas = document.getElementById("myCanvas");
var xCenter = window.innerWidth / 2;
var yCenter = window.innerHeight / 2;

// Testing some stuff out
var myPath = new Path();
myPath.strokeColor = 'black';
myPath.add(new Point(xCenter, yCenter));
myPath.add(new Point(100,50));

function resizeCanvas() {
    // TODO: update positions when resizing
    xCenter = window.innerWidth / 2;
    yCenter = window.innerHeight / 2;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);