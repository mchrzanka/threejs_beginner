import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

//creates renderer instance and sets the size of our app. In this case, it's the width and height of the window.
const renderer = new THREE.WebGL1Renderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
	45,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);

//creates control where you mouse hold on the screen and you can move the scene around.
//https://threejs.org/docs/#examples/en/controls/OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);

//acts as a guide, introduces the 3D co-ordinate system (x,y,z)
//https://threejs.org/docs/#api/en/helpers/AxesHelper
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

//moves the camera back because if I don't move it back, it renders at the same level as the scene.
camera.position.set(-10, 30, 30); //x,y,z

//controls.update() must be called after any manual changes to the camera's transform
controls.update();

//a cube
//https://threejs.org/docs/?q=box#api/en/geometries/BoxGeometry
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(boxGeometry, boxMaterial); //a mesh, in 3D world, is an object
scene.add(cube);

//a circle
//https://threejs.org/docs/?q=sphere#api/en/geometries/SphereGeometry
const sphereGeometry = new THREE.SphereGeometry(4, 50, 50);
const sphereMaterial = new THREE.MeshBasicMaterial({
	color: 0x0000ff,
	wireframe: false, //change to true to see frame of object
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial); //a mesh, in 3D world, is an object
scene.add(sphere);

//two dimensional plane to help us see where we are in space (it's like a blank canvas)
const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshBasicMaterial({
	color: 0xffffff,
	side: THREE.DoubleSide, //without this, the plane only shows from the front. This is optional, if you want to see it from all sides.
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
//make the plane and the grid match
plane.rotation.x = -0.5 * Math.PI;

//a grid that also helps us see where we are in space
const gridHelper = new THREE.GridHelper(30); //the value increases the size of the grid. Can leave blank.
scene.add(gridHelper);

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
