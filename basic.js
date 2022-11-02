// import * as THREE from "three";
import * as THREE from 'https://unpkg.com/three/build/three.module.js'
import { PointerLockControls } from 'https://unpkg.com/three/examples/jsm/controls/PointerLockControls';
import Stats from 'https://unpkg.com/three/examples/jsm/libs/stats.module'

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(5))


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.y = 1;

const cameraLight = new THREE.SpotLight(0xffffff, 6);
cameraLight.castShadow = true;

cameraLight.shadow.bias = -0.0001;
cameraLight.shadow.mapSize.width = 512 / 4 * renderer.capabilities.maxTextures; // default
cameraLight.shadow.mapSize.height = 512 / 4 * renderer.capabilities.maxTextures; // default
cameraLight.shadow.camera.near = 0.1; // default
cameraLight.shadow.camera.far = 500; // default

var d = 32;

cameraLight.shadow.camera.left = -d;
cameraLight.shadow.camera.right = d;
cameraLight.shadow.camera.top = d;
cameraLight.shadow.camera.bottom = -d;

cameraLight.visible = true;
cameraLight.distance = 10;
cameraLight.decay = 1;
cameraLight.angle = Math.PI / 4;
cameraLight.penumbra = 0.1;

camera.add(cameraLight);
cameraLight.position.set(0, 0, 1);
scene.add(camera);
cameraLight.target = camera;

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

const planeGeometry = new THREE.PlaneGeometry(100, 100, 50, 50);
const material = new THREE.MeshStandardMaterial({
    color: 0x0f0f0f
})
const plane = new THREE.Mesh(planeGeometry, material);
plane.rotateX(-Math.PI / 2);
scene.add(plane);

const onKeyDown = function (event) {
    switch (event.code) {
        case 'KeyW':
            controls.moveForward(0.25)
            break
        case 'KeyA':
            controls.moveRight(-0.25)
            break
        case 'KeyS':
            controls.moveForward(-0.25)
            break
        case 'KeyD':
            controls.moveRight(0.25)
            break
    }
}
document.addEventListener('keydown', onKeyDown, false)

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}

// const stats = Stats();
// document.body.appendChild(stats.dom);

function animate() {
    requestAnimationFrame(animate);
    // controls.update();
    render();
    // stats.update();
}

function render() {
    renderer.render(scene, camera);
}

animate();