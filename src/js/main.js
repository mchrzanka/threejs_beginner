import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

//https://www.educative.io/answers/what-is-datgui-in-threejs
import * as dat from 'dat.gui'; //adding dat.gui for user graphics controls

import nebula from '../imgs/nebula.png';

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

//a cube with images on it's faces
//background image. each type of file has a special loader. For images, we use the textureLoader
const textureLoader = new THREE.TextureLoader();

const box2Geometry = new THREE.BoxGeometry(4, 4, 4);
const box2Material = new THREE.MeshBasicMaterial({
	map: textureLoader.load(nebula),
});
const box2 = new THREE.Mesh(box2Geometry, box2Material);
scene.add(box2);
box2.position.set(0, 15, 10);

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

//MODELS
// Instantiate a loader
const loader = new GLTFLoader();

// Load a glTF resource
loader.load(
	// resource URL
	'../assets/duck.glb',
	// called when the resource is loaded
	function (gltf) {
		const model = gltf.scene;
		scene.add(model);
		model.position.set(12, 0, 0);
	},
	// called when loading has errors
	function (error) {
		console.error(error);
	}
);

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
gui.add(options, 'intensity', 0, 1000);

//SELECTING OBJECTS FROM THE SCENE
//we need to keep track of the camera location and the mouse position. Anything in between those two positions is able to be selected.
const mousePosition = new THREE.Vector2();
window.addEventListener('mousemove', function (e) {
	mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
	mousePosition.y = (e.clientY / window.innerHeight) * 2 - 1;
});

const rayCaster = new THREE.Raycaster(); //a ray, in geometry, is a line that starts at a point and extends infinitely in one direction. Raycasting is a technique to determine what objects in a scene a ray is intersecting with.

//each object in the scene has data, including an ID. We grab the ID and store it to use it in the animate function.
const sphereId = sphere.id;

//CHANGE MESH SHAPE
const plane2Geometry = new THREE.PlaneGeometry(10, 10, 10, 10);
const plane2Material = new THREE.MeshBasicMaterial({
	color: 0xffffff,
	wireframe: true,
});
const plane2 = new THREE.Mesh(plane2Geometry, plane2Material);
scene.add(plane2);
plane2.position.set(10, 10, 15);

//https://www.youtube.com/watch?v=xJAfLdUgdc4&list=PLjcjAqAnHd1EIxV4FSZIiJZvsdrBc1Xho @ 44.53
//positions of all the vertex points are located in this array. Grabbing the first 3 entries in the array (x,y,z) allows us to mess with the very first vertex in the mesh.
plane2.geometry.attributes.position.array[0] -= 10 * Math.random();
plane2.geometry.attributes.position.array[1] -= 10 * Math.random();
plane2.geometry.attributes.position.array[2] -= 10 * Math.random();

//grab the very last z vertex in the mesh and change it (as opposed to the x,y,z of the first vertex that we just did)
const lastPointZ = plane2.geometry.attributes.position.array.length - 1;
plane2.geometry.attributes.position.array[lastPointZ] -= 10 * Math.random();

//SHADERS
const vShader = `
void main(){
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const fShader = `
void main(){
	gl_FragColor = vec4(0.5,0.5,1.0,1.0);
}
`;

//my sphere
const sphere2Geometry = new THREE.SphereGeometry(4);
const sphere2Material = new THREE.ShaderMaterial({
	vertexShader: vShader,
	fragmentShader: fShader,
});
const sphere2 = new THREE.Mesh(sphere2Geometry, sphere2Material);
scene.add(sphere2);
sphere2.position.set(-5, 10, -10);

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

	//setting the two ends of the ray for selecting objects in the scene
	rayCaster.setFromCamera(mousePosition, camera);
	const intersects = rayCaster.intersectObjects(scene.children); //variable that holds an object that contains any element in the scene that intersects with the ray

	//loop through the intersects object to see if anything our mouse has passed over has the same ID as an object (in this case, the sphere). If it does, change the color of that object to red.
	for (let i = 0; i < intersects.length; i++) {
		if (intersects[i].object.id === sphereId) {
			intersects[i].object.material.color.set(0xff0000);
		}
	}

	//animate the changing of the vertex points. Goes kind of crazy so I'm commenting out.
	// plane2.geometry.attributes.position.array[0] = 10 * Math.random();
	// plane2.geometry.attributes.position.array[1] = 10 * Math.random();
	// plane2.geometry.attributes.position.array[2] = 10 * Math.random();
	// plane2.geometry.attributes.position.array[lastPointZ] = 10 * Math.random();
	// plane2.geometry.attributes.position.needsUpdate = true;
}
animate();

//RENDERING EVERYTHING
//background color
//renderer.setClearColor(0xcdb0ed);

//scene.background = textureLoader.load(nebula); //this method loads the image in 2D, which is fine if that's what you want.

//to make the background 3D:
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
	nebula,
	nebula,
	nebula,
	nebula,
	nebula,
	nebula,
]); //you can import multiple images and just list their names in the position you want them.

//render everything
renderer.render(scene, camera);

//make the window and canvas responsive
window.addEventListener('resize', function () {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});
