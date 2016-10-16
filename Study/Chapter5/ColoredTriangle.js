

var VSHADER_SOURCE = 
        'attribute vec4 a_Position;\n' +
        'attribute vec4 a_Color;\n' +
        'varying vec4 v_Color; \n' + 
        'void main() {\n' +
            'gl_Position = a_Position;\n'+
            'gl_PointSize = 10.0;\n'+
            'v_Color = a_Color; \n' +
        '}';

var FSHADER_SOURCE =
    'precision mediump float;' +
    'varying vec4 v_Color; \n' +
    'void main() {' +
        'gl_FragColor = v_Color;'+
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

    gl.drawArrays(gl.TRIANGLES, 0, n);

}

function initVertexBuffers(gl) {
    var verticesColors = new Float32Array(
        [0.0, 0.5, 1.0, 0.0, 0.0,
         -0.5, -0.5, 1.0, 1.0, 0.0,
          0.5, -0.5, 1.0, 1.0, 1.0]
        );
    var n = 3;

    var vertexBuffer = gl.createBuffer();
    if (vertexBuffer < 0) {
        console.log("fail to create vertex buffer");
        return 0;
    }

    var FSIZE = verticesColors.BYTES_PER_ELEMENT;

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return 0;
    }
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0);
    gl.enableVertexAttribArray(a_Position);

    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');

    if (a_Color < 0) {
        console.log('Failed to get the storage location of a_PointSize');
        return 0;
    }
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
    gl.enableVertexAttribArray(a_Color);

    return n;
}
