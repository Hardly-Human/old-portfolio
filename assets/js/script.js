/* 
 * 3D FLOATING TYPO
 * Made with ThreeJS - Enjoy!
 * https://threejs.org/
 *
 * Move the cursor to zoom in/out and float around the cubed space.
 * On mobile touch + drag screen to zoom in/out and float.
 *
 * Inspired by one of the ThreeJS examples in documentation.
 *
 * #014 - #100DaysOfCode
 * By ilithya | 2019
 */

const nearDist = 0.1;
const farDist = 10000;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth / window.innerHeight,
nearDist,
farDist);

camera.position.x = farDist * -2;
camera.position.z = 500;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor("#4DD0E1"); // Backgrond Color - Blue
renderer.setPixelRatio(window.devicePixelRatio); // For HiDPI devices to prevent bluring output canvas
renderer.setSize(window.innerWidth, window.innerHeight);
document.querySelector("#canvas-wrapper").appendChild(renderer.domElement);

// CREATE CUBES
const cubeSize = 120;
const geometry = new THREE.BoxBufferGeometry(cubeSize, cubeSize, cubeSize); // BufferAttribute allows for more efficient passing of data to the GPU
const material = new THREE.MeshNormalMaterial(); // Maps the normal vectors to RGB colors
const group = new THREE.Group();
for (let i = 0; i < 350; i++) {
  const mesh = new THREE.Mesh(geometry, material);
  const dist = farDist / 3;
  const distDouble = dist * 2;
  const tau = 2 * Math.PI; // One turn

  mesh.position.x = Math.random() * distDouble - dist;
  mesh.position.y = Math.random() * distDouble - dist;
  mesh.position.z = Math.random() * distDouble - dist;
  mesh.rotation.x = Math.random() * tau;
  mesh.rotation.y = Math.random() * tau;
  mesh.rotation.z = Math.random() * tau;

  // Manually control when 3D transformations recalculation occurs for better performance
  mesh.matrixAutoUpdate = false;
  mesh.updateMatrix();

  group.add(mesh);
}
scene.add(group);

// CREATE TYPOGRAPHY
const loader = new THREE.FontLoader();
const textMesh = new THREE.Mesh();
const createTypo = font => {
  const word = "Decisions determine Destiny";
  const typoProperties = {
    font: font,
    size: cubeSize,
    height: cubeSize / 2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 10,
    bevelSize: 6,
    bevelOffset: 1,
    bevelSegments: 8 };

  const text = new THREE.TextGeometry(word, typoProperties);
  textMesh.geometry = text;
  textMesh.material = material;
  textMesh.position.x = cubeSize * -2;
  textMesh.position.z = cubeSize * -1;
  scene.add(textMesh);
};
loader.load(
"https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
createTypo);


// CREATE PART OF THE MOUSE/TOUCH OVER EFFECT
let mouseX = 0;
let mouseY = 0;
const mouseFX = {
  windowHalfX: window.innerWidth / 2,
  windowHalfY: window.innerHeight / 2,
  coordinates: function (coordX, coordY) {
    mouseX = (coordX - mouseFX.windowHalfX) * 10;
    mouseY = (coordY - mouseFX.windowHalfY) * 10;
  },
  onMouseMove: function (e) {
    mouseFX.coordinates(e.clientX, e.clientY);
  },
  onTouchMove: function (e) {
    mouseFX.coordinates(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
  } };

document.addEventListener("mousemove", mouseFX.onMouseMove, false);
document.addEventListener("touchmove", mouseFX.onTouchMove, false);

// RENDER 3D GRAPHIC
const render = () => {
  requestAnimationFrame(render);

  // Camera animation
  // Works with onMouseMove and onTouchMove functions
  camera.position.x += (mouseX - camera.position.x) * 0.05;
  camera.position.y += (mouseY * -1 - camera.position.y) * 0.05;
  camera.lookAt(scene.position); // Rotates the object to face a point in world space

  const t = Date.now() * 0.001;
  const rx = Math.sin(t * 0.7) * 0.5;
  const ry = Math.sin(t * 0.3) * 0.5;
  const rz = Math.sin(t * 0.2) * 0.5;
  group.rotation.x = rx;
  group.rotation.y = ry;
  group.rotation.z = rz;
  textMesh.rotation.x = rx;
  textMesh.rotation.y = ry;
  textMesh.rotation.z = rx; // Happy accident :) 

  renderer.render(scene, camera);
};
render();

// RESIZE CANVAS
// This is buggy in some iOS...
// const resizeCanvas = () => {
// 	camera.aspect = window.innerWidth / window.innerHeight;
// 	camera.updateProjectionMatrix();
// 	renderer.setSize(window.innerWidth, window.innerHeight);
// };
// window.addEventListener("resize", resizeCanvas, false);

$(document).ready(function(){
  $("a").on('click', function(event) {
    if (this.hash !== "") {
      event.preventDefault();
      var hash = this.hash;
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 800, function(){
        window.location.hash = hash;
      });
    } 
  });
});