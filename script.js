var FIDELITY = 5;
var canvas = document.getElementById("myCanvas");
var xCenter = window.innerWidth / 2;
var yCenter = window.innerHeight / 2;

// Construct central point
var centerPoint = new Point(xCenter, yCenter);
// Draw lines from center to surrounding points
function surround(cent, fid) {
    var parray = [];
    var paths = [];
    for (var i = 0; i < fid; i++) {
        parray.push((new Point(cent.x + 100, cent.y)).rotate((360/fid)*i, cent))
        paths.push(new Path(cent, parray[i]))
    }
    return new Group(paths);
}

circ1 = surround(centerPoint, FIDELITY);
circ1.style = {
    strokeColor: 'black',
    strokeWidth: 2
};