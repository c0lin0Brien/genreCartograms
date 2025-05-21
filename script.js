var fidSlide = document.getElementById("fidRange");
var magSlide = document.getElementById("magRange");
var FIDELITY = fidSlide.value;
var dFid = 0;
var MAGNITUDE = magSlide.value;
var dMag = 0;
var canvas = document.getElementById("myCanvas");
var xCenter = window.innerWidth / 2;
var yCenter = window.innerHeight / 2;

// Update slider value every time change is made
fidSlide.oninput = function() {
    FIDELITY = this.value
    // TODO: Complete function
}

magSlide.oninput = function() {
    dMag = magSlide.value / MAGNITUDE;
    MAGNITUDE = magSlide.value;
    scale(circ1, dMag);
}

// Construct central point
var centerPoint = new Point(xCenter, yCenter);
// Draw lines from center to surrounding points
function surround(cent, fid) {
    var parray = [];
    var paths = [];
    for (var i = 0; i < fid; i++) {
        parray.push((new Point(cent.x + (MAGNITUDE * 10), cent.y)).rotate((360/fid)*i, cent))
        paths.push(new Path(cent, parray[i]))
    }
    return new Group(paths);
}
// Takes group and modifies magnitude of all paths
function scale(gr, fac) {
    gr.scale(fac)
}

circ1 = surround(centerPoint, FIDELITY);
circ1.style = {
    strokeColor: 'black',
    strokeWidth: 2
};