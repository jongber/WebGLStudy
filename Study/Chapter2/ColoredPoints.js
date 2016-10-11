
/*
어떻게 Fragment Shader에 값을 넘겨 줄 수 있나?
* uniform 변수 사용
* gl.getUniformLocation으로 Fragment shader에 선언된 변수 get!
* gl.uniform4f 로 선언된 변수에 값을 대입
uniform 변수는 모든 vertex들에대해 일괄 적용된다.
attribute 변수는 각 vertex마다 적용된다. (Vertex Shader에 값을 넘겨주는 용도니까)

 */

var VSHADER_SOURCE = 
        'attribute vec4 a_Position;\n' +
        'void main() {\n' +
            'gl_Position = a_Position;\n'+
            'gl_PointSize = 10.0;\n'+
        '}';

var FSHADER_SOURCE =
    'precision mediump float;' +
    'uniform vec4 u_FragColor;' +
    'void main() {' +
        'gl_FragColor = u_FragColor;'+
    '}';

function main(){
    var canvas = document.getElementById("webgl");

    var gl = getWebGLContext(canvas);
    if (!gl) {
        return;
    }

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initShader shader');
        return;
    }

    // get storage location`
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');

    if (a_Position < 0 || u_FragColor < 0) {
        console.log('Failed to get the storage location of a_Position u_FragColor');
        return;
    }

    canvas.onmousedown = function(ev) {
        click(ev, gl, canvas, a_Position, u_FragColor);
    }
    
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_points = [];
var g_colors = [];

function click(ev, gl, canvas, a_Position, u_FragColor) {
    var x = ev.clientX;
    var y = ev.clientY;
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.height/2) / (canvas.height/2);
    y = (canvas.width/2 - (y-rect.top))/(canvas.width / 2);

    g_points.push([x, y]);

    if (x >= 0.0 && y >= 0.0) {
        g_colors.push([1.0, 0.0, 0.0, 1.0]); // Red
    }
    else if (x < 0.0 && y < 0.0) {
        g_colors.push([0.0, 1.0, 0.0, 1.0]);
    }
    else {
        g_colors.push([1.0, 1.0, 1.0, 1.0]);
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    var len = g_points.length;
    for (var i = 0; i < len; ++i) {
        
        var xy = g_points[i];
        var rgba = g_colors[i];

        gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.drawArrays(gl.POINTS, 0, 1);
    }
}