import * as THREE from 'three';

//creates renderer instance and sets the size of our app. In this case, it's the width and height of the window.
const renderer = new THREE.WebGL1Renderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);

//acts as a guide, introduces the 3D co-ordinate system (x,y,z)
//https://threejs.org/docs/#api/en/helpers/AxesHelper
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

//moves the camera back because if I don't move it back, it renders at the same level as the scene.
camera.position.set(0, 2, 5); //x,y,z

//the cube we're generating for this example
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

//our render/animate loop so that we can see the cube. It's a loop that causes the renderer to draw the scene every time the screen is refreshed (typically 60 times per second). Anything you want to change or move needs to be run through the animate loop (you can call other functions from inside of it so it's not crazy).
function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);

	//animate the cube, rotates it by 0.01 radians every second
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
}
animate();

renderer.render(scene, camera);
