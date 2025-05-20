// Handling resizing of the canvas
var canvas = document.getElementById("myCanvas");
var xCenter = window.innerWidth / 2;
var yCenter = parseInt((window.innerHeight / 2));

// Initial path
var myPath = new Path();
myPath.strokeColor = 'black';
myPath.add(new Point(xCenter, yCenter));
myPath.add(new Point(100,50));

// function resizeCanvas() {
//     // TODO: update positions when resizing
//     xCenter = window.innerWidth / 2;
//     yCenter = window.innerHeight / 2;
// }

// resizeCanvas();
// window.addEventListener("resize", resizeCanvas);

var FIDELITY = 5;

// Create circle of points around central point
var movingPoint = new Point(xCenter - 100, yCenter);
var movingPath = new Path();
movingPath.strokeColor = 'black';
movingPath.add(new Point(xCenter, yCenter));
movingPath.add(movingPoint);

function switchPoint() {
    movingPath.segments[1].point.set(xCenter + 100, yCenter);
    console.log("(" + (movingPoint.x).toString(), (movingPoint.y).toString() + ")")
}

window.addEventListener('click', switchPoint);
// Draw paths from center to each center point