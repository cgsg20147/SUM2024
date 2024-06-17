
let
  gl;

function GLinit() {  
  gl = document.getElementById("myCan").getContext("2d");
  gl.scale(0.25, 0.25);
  let img = new Image();
  let data = [];
  img.src = "./z3.jpg";
  img.onload = function() {
    let h;
    gl.drawImage(img, 0, 0);
    h = Array.from(gl.getImageData(0, 0, 1000, 1000).data);
    for (let i = 0; i < h.length / 4; i++) {
      data[i] = [h[i * 4], h[i * 4 + 1], h[i * 4 + 2], h[i * 4 + 3]];
    }
    data = createSDF(data, 1000, 1000);
    for (let i = 0; i < 1000; i++)
      for (let j = 0; j < 1000; j++) {
        let c = data[i * 1000 + j];
        gl.fillStyle = (`rgba(${c}, ${c}, ${c}, 255)`);
        gl.fillRect(j * 4, i * 4, 4, 4);
    }
  }
}
function createSDF(data, w, h) {
  let sdf1 = new Array(w * h), sdf2 = new Array(w * h), a;
  for (let i = 0; i < sdf1.length; i++)
    sdf1[i] = 10000;
  for (let i = 0; i < h; i++)
    for (let j = 0; j < w; j++) {
      if (data[i * w + j][0] != 255 || data[i * w + j][1] != 255 || data[i * w + j][2] != 255) {
        for (let k = 0; k < w; k++) {
          a = (j - k) * (j - k);
          if (sdf1[i * w + k] > a)
            sdf1[i * w + k] = a;
        }
      }
    }
  for (let i = 0; i < w; i++)
    for (let j = 0; j < h; j++) {
      if (data[j * w + i][0] != 255 || data[j * w + i][1] != 255 || data[j * w + i][2] != 255) {
        for (let k = 0; k < h; k++) {
          a = (j - k) * (j - k);
          if (sdf1[k * w + i] > a)
            sdf1[k * w + i] = a;
        }
      }
    }
  return sdf1;
}
window.requestAnimationFrame(GLinit);