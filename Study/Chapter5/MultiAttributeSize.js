

var VSHADER_SOURCE = 
        'attribute vec4 a_Position;\n' +
        'attribute float a_PointSize;\n' +
        'void main() {\n' +
            'gl_Position = a_Position;\n'+
            'gl_PointSize = a_PointSize;\n'+
        '}';

var FSHADER_SOURCE =
    'void main() {' +
        'gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);'+
    '}';

var Tx = 0.5, Ty = 0.5, Tz = 0.0;
var ANGLE_STEP = 45.0;

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

    var n = initVertexBuffers(gl);
    if (n == 0) {
        console.log('invalid vertex count');
        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.POINTS, 0, n);

}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
    var n = 3;

    var sizes = new Float32Array([10.0, 20.0, 30.0]);

    var vertexBuffer = gl.createBuffer();
    var sizeBuffer = gl.createBuffer();
    if (vertexBuffer < 0 || sizeBuffer < 0) {
        console.log("fail to create vertex buffer");
        return 0;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return 0;
    }
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW);
    var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');

    if (a_PointSize < 0) {
        console.log('Failed to get the storage location of a_PointSize');
        return 0;
    }
    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_PointSize);

    return n;
}
