import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

//https://www.educative.io/answers/what-is-datgui-in-threejs
import * as dat from 'dat.gui'; //adding dat.gui for user graphics controls

//BASIC CREATE A SCENE
//creates renderer instance and sets the size of our app. In this case, it's the width and height of the window.
const renderer = new THREE.WebGL1Renderer();

//set shadows to true
renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
	45,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);

//CONTROLS
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

//ADDING OBJECTS TO WORK WITH
//a cube
//https://threejs.org/docs/?q=box#api/en/geometries/BoxGeometry
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); //this material doesn't need a light source to be seen. All of the other ones do.
const cube = new THREE.Mesh(boxGeometry, boxMaterial); //a mesh, in 3D world, is an object
scene.add(cube);

//a circle
//https://threejs.org/docs/?q=sphere#api/en/geometries/SphereGeometry
const sphereGeometry = new THREE.SphereGeometry(4, 50, 50);
const sphereMaterial = new THREE.MeshStandardMaterial({
	color: 0x0000ff,
	wireframe: false, //change to true to see frame of object
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial); //a mesh, in 3D world, is an object
scene.add(sphere);
sphere.position.set(-10, 10, 0);
sphere.castShadow = true; //sphere creates a shadow (onto the plane)

//SEEING WHERE WE ARE IN SPACE
//two dimensional plane to help us see where we are in space (it's like a blank canvas)
const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({
	color: 0xffffff,
	side: THREE.DoubleSide, //without this, the plane only shows from the front. This is optional, if you want to see it from all sides.
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
//make the plane and the grid match
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true; //plane receives shadow from the sphere

//a grid that also helps us see where we are in space
const gridHelper = new THREE.GridHelper(30); //the value increases the size of the grid. Can leave blank.
scene.add(gridHelper);

//LIGHTING & SHADOWS
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
// scene.add(directionalLight);
// directionalLight.position.set(-30, 40, 0); //move the light helper square to change light direction
// directionalLight.castShadow = true; //the light casts a shadow
// directionalLight.shadow.camera.bottom = -12; //fixes the shadow being clipped (makes the bottom area bigger by 12 rad)

// //physical directional light helper to show you where the light source is coming from
// const dLightHelper = new THREE.DirectionalLightHelper(directionalLight);
// scene.add(dLightHelper);

// //shadow helper for us to physically see the area where the shadow can be cast. Before adding this in, the shadow was being clipped because the area wasn't big enough to hold it.
// const dLightShadowHelper = new THREE.CameraHelper(
// 	directionalLight.shadow.camera
// );
// scene.add(dLightShadowHelper);

const spotLight = new THREE.SpotLight(0xffffff);
scene.add(spotLight);
spotLight.position.set(-20, 20, 0);
//spotLight.intensity = 100; // needed this to make the light stronger because it wasn't appearing further away

spotLight.castShadow = true;

const sLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(sLightHelper);

//FOG
scene.fog = new THREE.Fog(0xffffff, 0, 200);

//GUI FOR USERS - dat.gui
const gui = new dat.GUI();

//properties to include in the gui
const options = {
	sphereColor: '#ffea00',
	wireframe: false,
	angle: 0.2, //spotlight
	penumbra: 0, //spotlight
	intensity: 1, //spotlight
};

gui.addColor(options, 'sphereColor').onChange(function (e) {
	sphere.material.color.set(e);
});

gui.add(options, 'wireframe').onChange(function (e) {
	sphere.material.wireframe = e;
});

gui.add(options, 'angle', 0, 1);
gui.add(options, 'penumbra', 0, 1);
gui.add(options, 'intensity', 0, 100);

//ANIMATION
//sphere bounce
let step = 0;
let speed = 0.01;

//our render/animate loop so that we can see the cube. It's a loop that causes the renderer to draw the scene every time the screen is refreshed (typically 60 times per second). Anything you want to change or move needs to be run through the animate loop (you can call other functions from inside of it so it's not crazy).
function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);

	//animate the cube, rotates it by 0.01 radians every second
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	//ball bounce
	step += speed;
	sphere.position.y = 10 * Math.abs(Math.sin(step)); //ball looks like it's bouncing, but it's following the sin wave on the y axis

	//setting spotlight values from gui
	spotLight.angle = options.angle;
	spotLight.penumbra = options.penumbra;
	spotLight.intensity = options.intensity;
	sLightHelper.update(); //call helper after every time we update the values
}
animate();

//RENDERING EVERYTHING

//render everything
renderer.render(scene, camera);
