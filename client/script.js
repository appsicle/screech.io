function midPointBtw(p1, p2) {
    return {
        x: p1.x + (p2.x - p1.x) / 2,
        y: p1.y + (p2.y - p1.y) / 2
    };
}

var el = document.getElementById('imageView');
var ctx = el.getContext('2d');
var socket = io();
socket.on('drawing', onDrawingEvent);
ctx.lineJoin = ctx.lineCap = 'round';
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;
ctx.lineWidth = 5;

var current = {
  color: 'black'
};

var isDrawing, points = [];

el.onmousemove = function (e) {
    // if (!isDrawing) return;

    points.push({ x: e.clientX, y: e.clientY });

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    var p1 = points[0];
    var p2 = points[1];

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    console.log(points);

    for (var i = 1, len = points.length; i < len; i++) {
        // we pick the point between pi+1 & pi+2 as the
        // end point and p1 as our control point
        var midPoint = midPointBtw(p1, p2);
        ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
        p1 = points[i];
        p2 = points[i + 1];
    }
    // Draw last line as a straight line while
    // we wait for the next point to be able to calculate
    // the bezier control point

    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();
    drawLine(p1.x, p1.y, e.clientX||e.touches[0].clientX, e.clientY||e.touches[0].clientY, current.color, true);
    p1.x = e.clientX||e.touches[0].clientX;
    p1.y = e.clientY||e.touches[0].clientY;
};

function drawLine(x0, y0, x1, y1, color, emit){
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.closePath();

  if (!emit) { return; }
  var w = el.width;
  var h = el.height;

  socket.emit('drawing', {
    x0: x0 / w,
    y0: y0 / h,
    x1: x1 / w,
    y1: y1 / h,
    color: color
  });
}

function onDrawingEvent(data){
  var w = el.width;
  var h = el.height;
  drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
}
