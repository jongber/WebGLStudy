

var VSHADER_SOURCE = 
        'attribute vec4 a_Position;\n' +
        'attribute vec4 a_Color;\n' +
        'uniform mat4 u_ProjMatrix;' +
        'uniform mat4 u_ViewMatrix;'+
        'varying vec4 v_Color;' +
        'void main() {\n' +
            'gl_Position = u_ProjMatrix * u_ViewMatrix * a_Position;\n'+
            'v_Color = a_Color;' +
        '}';

var FSHADER_SOURCE =
    'precision mediump float;'+
    'varying vec4 v_Color;' +
    'void main() {' +
        'gl_FragColor = v_Color;'+
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

    var n = initVertexBuffers(gl);
    if (n == 0) {
        console.log('invalid vertex count');
        return;
    }

    //setup transform matrix
    var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    var viewMatrix = new Matrix4();

    var u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
    var projMatrix = new Matrix4();

    viewMatrix.setLookAt(0, 0, 15, 0, 0, -100, 0, 1, 0);
    projMatrix.setPerspective(30, canvas.width/canvas.height, 1, 100);
    //projMatrix.setOrtho(-1.0, 1.0, -1.0, 1.0, 0.0, 2.0);

    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

    gl.enable(gl.POLYGON_OFFSET_FILL);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, n/2);
    gl.polygonOffset(1.0, 1.0);
    gl.drawArrays(gl.TRIANGLES, n/2, n/2);
}

function initVertexBuffers(gl) {
    var verticesColor = new Float32Array([
        // three triangles on the right side
        0.0, 6.5, -5.0, 0.0, 1.0, 0.0,
        -2.5, -2.5, -5.0, 0.0, 1.0, 0.0,
        2.5, -2.5, -5.0, 1.0, 0.0, 0.0,    // the green triangle in back

        0.0, 3.0, -5.0, 1.0, 0.0, 0.0,
        -3.0, -3.0, -5.0, 1.0, 1.0, 0.0,
        3.0, -3.0, -5.0, 1.0, 1.0, 0.0,    // the yellow triangle in middle

        ]);
    var n = 6;

    var triangleBuffer = gl.createBuffer();
    if (triangleBuffer < 0) {
        console.log("fail to create vertex buffer");
        return 0;
    }

    var FSIZE = verticesColor.BYTES_PER_ELEMENT;

    gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColor, gl.STATIC_DRAW);
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return 0;
    }

    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);

    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');

    if (a_Color < 0) {
        console.log('Failed to get the storage location of a_Color');
        return 0;
    }
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    return n;
}

