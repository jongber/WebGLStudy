

var VSHADER_SOURCE = 
        'attribute vec4 a_Position;\n' +
        'attribute vec2 a_TexCoord; \n' +
        'varying vec2 v_TexCoord;' +
        'void main() {\n' +
            'gl_Position = a_Position;\n'+
            'v_TexCoord = a_TexCoord;\n'+
        '}';

var FSHADER_SOURCE =
    'precision mediump float;' +
    'uniform sampler2D u_Sampler;\n'+
    'varying vec2 v_TexCoord;\n' +
    'void main() {' +
        'gl_FragColor = texture2D(u_Sampler, v_TexCoord);'+
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

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    initTextures(gl, n);

}

function initVertexBuffers(gl) {
    var verticesTexCoords = new Float32Array
        (
            [-0.5,  0.5,  0.0, 1.0,
             -0.5, -0.5, 0.0, 0.0,
              0.5,  0.5,  1.0, 1.0,
              0.5, -0.5, 1.0, 0.0
              ]
        );
    var n = 4;

    var vertexBuffer = gl.createBuffer();
    if (vertexBuffer < 0) {
        console.log("fail to create vertex buffer");
        return 0;
    }

    var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return 0;
    }

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.enableVertexAttribArray(a_Position);

    var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');

    if (a_TexCoord < 0) {
        console.log('Failed to get the storage location of a_TexCoord');
        return 0;
    }
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
    gl.enableVertexAttribArray(a_TexCoord);

    return n;
}

function initTextures(gl, n) {
    var texture = gl.createTexture();
    var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');

    var image = new Image();

    image.onload = function () {
        loadTexture(gl, n, texture, u_Sampler, image);
    }
    image.src = '../resources/sky.jpg';
}
function loadTexture(gl, n, texture, u_Sampler, image) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);  // flip the image's y axis
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler, 0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}