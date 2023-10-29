import * as THREE from 'three'
import Floor from "./components/Floor";
import {BoxGeometry, Mesh, MeshPhongMaterial, Scene} from "three";
import {appBackgroundColor, appBackgroundLightColor, appFloorColor} from "./Colors";
import {floor} from "three/examples/jsm/nodes/shadernode/ShaderNodeBaseElements";
import {PointerLockControls} from "three/examples/jsm/controls/PointerLockControls";

//Canvas
const canvas = document.querySelector('#three-canvas') as HTMLCanvasElement;

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Scene
const scene = new Scene();
scene.background = new THREE.Color(appBackgroundColor);

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.x = 4;
camera.position.y = 19;
camera.position.z = 14;
scene.add(camera);

// Light
const ambientLight = new THREE.AmbientLight(appBackgroundLightColor, 0.8);
scene.add(ambientLight);


// Floor
const floorHeight = 1;
const floorWidth = 200;
const floorDepth = 200;
const floorPositionX = 0;
const floorPositionY = 0;
const floorPositionZ = 0;
const floorGeometry = new BoxGeometry(floorWidth, floorHeight, floorDepth);
const floorMaterial = new MeshPhongMaterial({color: appFloorColor});
const floorMesh = new Mesh(floorGeometry, floorMaterial);
floorMesh.position.set(floorPositionX, floorPositionY, floorPositionZ);
scene.add(floorMesh);

//

// Controller
const controls = new PointerLockControls(camera, renderer.domElement);
controls.domElement.addEventListener('click',() => {
    controls.lock();
});

// Move Controller
let keys:Record<string, boolean> = {};
const moveSpeed:number = 0.5;
window.addEventListener('keydown', ({code}) => {

    keys[code] = true;
});
window.addEventListener('keyup', e => {
    delete keys[e.code];
});
function work(){

    if(keys['KeyW'] === true || keys['ArrowUp'] === true){

        controls.moveForward(moveSpeed);
    }
    if(keys['KeyS'] === true || keys['ArrowDown'] === true){
        controls.moveForward(-moveSpeed);
    }

    if(keys['KeyD'] === true || keys['ArrowRight'] === true){
        controls.moveRight(moveSpeed);
    }
    if(keys['KeyA'] === true  || keys['ArrowLeft'] === true){
        controls.moveRight(-moveSpeed);
    }
}


function draw() {
    // const delta = clock.getDelta();

    work();

    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
}


draw();
