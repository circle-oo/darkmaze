// import * as THREE from "three";
import * as THREE from 'three'
import { PointerLockControls } from 'PointerLockControls'
import getMaze from './maze.js'
import { Vector3 } from 'three';

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(5))

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    10900
);
camera.position.y = 5;

const cameraLight = new THREE.SpotLight(0xffffff, 1);
cameraLight.castShadow = true;

cameraLight.shadow.bias = -0.0001;
cameraLight.shadow.mapSize.width = 512 / 4 * renderer.capabilities.maxTextures; // default
cameraLight.shadow.mapSize.height = 512 / 4 * renderer.capabilities.maxTextures; // default
cameraLight.shadow.camera.near = 0.0001; // default
cameraLight.shadow.camera.far = 10000; // default

var d = 32;

cameraLight.shadow.camera.left = -d;
cameraLight.shadow.camera.right = d;
cameraLight.shadow.camera.top = d;
cameraLight.shadow.camera.bottom = -d;

cameraLight.visible = true;
cameraLight.distance = 10000;
cameraLight.decay = 1;
cameraLight.angle = Math.PI / 6;
cameraLight.penumbra = 0.1;

cameraLight.position.set(0, 0.8, -0.1);
camera.add(cameraLight)
camera.add(cameraLight.target);
cameraLight.target.position.z = -2;
scene.add(camera);

const controls = new PointerLockControls(camera, renderer.domElement)
//controls.addEventListener('change', () => console.log("Controls Change"))
const menuPanel = document.getElementById('webgl')
const startButton = document.getElementById('start')
startButton.addEventListener(
    'click',
    function () {
        controls.lock()
    },
    false
)
controls.addEventListener('lock', () => (menuPanel.style.display = 'none'))
controls.addEventListener('unlock', () => (menuPanel.style.display = 'block'))

const MAP_SIZE = 21;
var greed = getMaze(MAP_SIZE);

const wallMaterial = new THREE.MeshStandardMaterial( {color: 0xFFFFFF} ); //0x3C96FA
const wallHeight = 10;
const wallGeometry = new THREE.BoxGeometry(5, wallHeight, 5);
for (var i=0; i<MAP_SIZE; i++){
    for (var j=0; j<MAP_SIZE; j++) {
        if (greed[i][j] == 1) {
            console.log("construct wall ...")
            const wall = new THREE.Mesh( wallGeometry, wallMaterial);
            wall.receiveShadow = true;
            wall.position.x = i*5;
            wall.position.y = 5;
            wall.position.z = j*5;
            scene.add( wall );
        }
    }
}


const planeGeometry = new THREE.PlaneGeometry(100, 100, 50, 50);
const material = new THREE.MeshStandardMaterial({
    color: 0x0f0f0f,
    wireframe: true
})
const plane = new THREE.Mesh(planeGeometry, material);
plane.rotateX(-Math.PI / 2);
scene.add(plane);
const planeGeometry2 = new THREE.PlaneGeometry(100, 100, 50, 50);
const material2 = new THREE.MeshStandardMaterial({
    color: 0x010101,
    // wireframe: true
})
const plane2 = new THREE.Mesh(planeGeometry2, material2);
plane2.rotateX(-Math.PI / 2);
scene.add(plane2);

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
const onKeyDown = function (event) {
    switch (event.code) {
        case 'KeyW':
            moveForward = true;
            break
        case 'KeyA':
            moveLeft = true;
            break
        case 'KeyS':
            moveBackward = true;
            break
        case 'KeyD':
            moveRight = true;
            break
    }
}
const onKeyUp = function (event) {
    switch (event.code) {
        case 'KeyW':
            moveForward = false;
            break
        case 'KeyA':
            moveLeft = false;
            break
        case 'KeyS':
            moveBackward = false;
            break
        case 'KeyD':
            moveRight = false;
            break
    }
}
document.addEventListener('keydown', onKeyDown, false)
document.addEventListener('keyup', onKeyUp, false)

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}

// const stats = Stats();
// document.body.appendChild(stats.dom);

let prevTime = performance.now();
let time;
let delta;
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();

function animate() {
    if (controls.isLocked === true) {

        time = performance.now();
        delta = (time - prevTime) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveLeft) - Number(moveRight);
        direction.normalize(); // this ensures consistent movements in all directions

        if (moveForward || moveBackward) velocity.z -= direction.z * 50.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 50.0 * delta;

        controls.moveRight(velocity.x * delta);
        controls.moveForward(-velocity.z * delta);

        prevTime = time;

    }
    requestAnimationFrame(animate);
    render();
}

function render() {
    renderer.render(scene, camera);
}

animate();
