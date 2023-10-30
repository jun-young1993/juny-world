import * as THREE from 'three'
import Floor from "./components/Floor";
import {BoxGeometry, Material, Mesh, MeshPhongMaterial, MeshStandardMaterial, Scene, TextureLoader} from "three";
import {
    appBackgroundColor,
    appBackgroundLightColor,
    appCrossHairColor,
    appFloorColor,
    appWallColor,
    colors
} from "./Colors";
import {floor} from "three/examples/jsm/nodes/shadernode/ShaderNodeBaseElements";
import {PointerLockControls} from "three/examples/jsm/controls/PointerLockControls";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import dat from 'dat.gui';
import {githubLogPath} from "./Paths";

const isDev = true;
const datGui = new dat.GUI();
const dotGuiAdd = function (object:object,name:string) : void
{

    if(isDev) {
        // @ts-ignore
        datGui.add(object, "x", -1000, 1000, 0.1).name(name + ' x');
        // @ts-ignore
        datGui.add(object, "y", -1000, 1000, 0.1).name(name + ' y');
        // @ts-ignores
        datGui.add(object, "z", -1000, 1000, 0.1).name(name + ' z');
    }
}

//Canvas
const canvas = document.querySelector('#three-canvas') as HTMLCanvasElement;
// ========== GLTF
const gltfLoader = new GLTFLoader();
// ========== textureLoader
const textureLoader = new TextureLoader();

// ================ Light
// spotLight
const spotLight = new THREE.SpotLight(colors.white);
spotLight.castShadow = true;

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

// Helper
const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

const gridHelper  = new THREE.GridHelper(5);
scene.add(gridHelper);

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.x = 4;
camera.position.y = 19;
camera.position.z = 30;
scene.add(camera);

// Light
const ambientLight = new THREE.AmbientLight(appBackgroundLightColor, 1.5);
scene.add(ambientLight);

// ===========MESHES
// Floor
const floorHeight = 1;
const floorWidth = 800;
const floorDepth = 800;
const floorPositionX = 0;
const floorPositionY = 0;
const floorPositionZ = 0;
const floorGeometry = new BoxGeometry(floorWidth, floorHeight, floorDepth);
const floorMaterial = new MeshPhongMaterial({color: appFloorColor});
const floorMesh = new Mesh(floorGeometry, floorMaterial);
floorMesh.position.set(floorPositionX, floorPositionY, floorPositionZ);
scene.add(floorMesh);

// Wall
const wallHeight = 400;
const wallWidth = 800;
const wallDepth = 1;
const wallPositionX = 0;
const wallPositionY = wallHeight/ 2;
const wallPositionZ = floorDepth / 2;
const wallGeometry = new BoxGeometry(wallWidth, wallHeight, wallDepth);
const wallMaterial = new MeshPhongMaterial({color: appWallColor});
const wallMesh = new Mesh(wallGeometry, wallMaterial);
wallMesh.position.set(wallPositionX, wallPositionY, wallPositionZ);
scene.add(wallMesh);
dotGuiAdd(wallMesh.position, 'wall mesh position');

// Geolit
const geolitTextureLoader = new TextureLoader();
const geoliteGithubLogTexture = geolitTextureLoader.load(
    githubLogPath('5x6'),
);

geoliteGithubLogTexture.wrapS = THREE.RepeatWrapping;
geoliteGithubLogTexture.wrapT = THREE.RepeatWrapping;
geoliteGithubLogTexture.repeat.set( 0.5, 0.5 );
geoliteGithubLogTexture.needsUpdate = true;
const geolitWidth = 20;
const geolitHeight = 24;
const geolitDepth = 4;
const geoliteX = 0;
const geoliteY = geolitHeight/2;
const geoliteZ = 0;
const geoliteSpotLight = spotLight.clone();
geoliteSpotLight.position.set(geoliteX, geoliteY*10, geoliteZ);
scene.add(geoliteSpotLight);
const geolitGeometry = new BoxGeometry(geolitWidth, geolitHeight, geolitDepth);
const geolitFrontMaterial = new THREE.MeshBasicMaterial({
    map: geoliteGithubLogTexture,
    side: THREE.FrontSide,
    opacity : 1,
    transparent : false 
});

const geolitMesh = new Mesh(geolitGeometry, geolitFrontMaterial);
geolitMesh.position.set(geoliteX, geoliteY, geoliteZ);

scene.add(geolitMesh);
dotGuiAdd(geolitMesh.position, 'geolite mesh position');





// resize image


// table
const basicTableGltfPath = './gltf/basic-table-6x12x8(light-green).glb';

gltfLoader.load(
    basicTableGltfPath,
    glb => {
        const modelMesh = glb.scene.children[0];
        modelMesh.position.set(0,10,0);
        scene.add(modelMesh);
            dotGuiAdd(modelMesh.position, 'basic table position');

    }
);



// 조준점 설정
const crossHairGeometry = new THREE.CircleGeometry(0.02, 32);
const crossHairMaterial = new THREE.MeshBasicMaterial({ color: appCrossHairColor });
const crossHairMesh = new THREE.Mesh(crossHairGeometry, crossHairMaterial);
crossHairMesh.position.z = -2; // 조준점의 거리 조절
camera.add(crossHairMesh);

// Controller
const controls = new PointerLockControls(camera, renderer.domElement);
scene.add(controls.getObject());
controls.domElement.addEventListener('click',() => {
    controls.lock();
});



// Move Controller
let keys:Record<string, boolean> = {};
const moveSpeed:number = 300;
window.addEventListener('keydown', ({code}) => {

    keys[code] = true;
});
window.addEventListener('keyup', e => {
    delete keys[e.code];
});
function work(delta: number){
    const deltaMoveSpeed = moveSpeed  * delta;
    if(keys['KeyW'] === true || keys['ArrowUp'] === true){

        controls.moveForward(deltaMoveSpeed);
    }
    if(keys['KeyS'] === true || keys['ArrowDown'] === true){
        controls.moveForward(-deltaMoveSpeed);
    }

    if(keys['KeyD'] === true || keys['ArrowRight'] === true){
        controls.moveRight(deltaMoveSpeed);
    }
    if(keys['KeyA'] === true  || keys['ArrowLeft'] === true){
        controls.moveRight(-deltaMoveSpeed);
    }
}


// 그리기
const clock = new THREE.Clock();
function draw() {
    const delta = clock.getDelta();
    const time = clock.getElapsedTime();

    // 캐릭터 이동
    work(delta);


    camera.updateMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight); // 브라우저 사이즈 변경될때마다 업데이트
    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
}


draw();
