import * as THREE from 'three'
import Floor from "./components/Floor";
import {BoxGeometry, Group, Material, MathUtils, Mesh, MeshPhongMaterial, MeshStandardMaterial, Raycaster, Scene, TextureLoader, Vector2} from "three";
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
import { crossHairMeshName, geolit } from './Names';
import { commonName, commonPath } from './Common';

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
floorMesh.name = 'floor-mesh';
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
wallMesh.name='wall-mesh';
wallMesh.position.set(wallPositionX, wallPositionY, wallPositionZ);
scene.add(wallMesh);
dotGuiAdd(wallMesh.position, 'wall mesh position');

// Geolit


const geolitTextureLoader = new TextureLoader();
const geolits = ['github','test'];
const geolitGroup = new Group();
for(let geolitIndex = 0; geolitIndex<geolits.length; geolitIndex++){

    const geolitWidth = 20;
    const geolitHeight = 24;
    const geolitDepth = 4;
    const geoliteX = 0 + (geolitIndex*30);
    const geoliteY = geolitHeight/2;
    const geoliteZ = 0;
    const geoliteSpotLight = spotLight.clone();
    geoliteSpotLight.position.set(geoliteX, geoliteY*10, geoliteZ);
    scene.add(geoliteSpotLight);
    const geolitGeometry = new BoxGeometry(geolitWidth, geolitHeight, geolitDepth);
    const geolitFrontMaterial = new THREE.MeshBasicMaterial({
        // map: geoliteGithubLogTexture,
        // side: THREE.FrontSide,
        // opacity : 1,
        // transparent : false 
    });
    
    const geolitTexture = geolitTextureLoader.load(
        // githubLogPath('5x6'),
        commonPath.testImagePath
    );
    geolitFrontMaterial.map = geolitTexture;
    geolitTexture.needsUpdate=true;

    const geolitMesh = new Mesh(geolitGeometry, geolitFrontMaterial);
    geolitMesh.name = commonName.geolit+'-'+geolits[geolitIndex];
    geolitMesh.position.set(geoliteX, geoliteY, geoliteZ);
    
    geolitGroup.add(geolitMesh);
    dotGuiAdd(geolitMesh.position, `${geolitMesh.name} position`);
}
geolitGroup.rotation.set(0,MathUtils.degToRad(90),0);
geolitGroup.position.set(wallWidth/2, 0, 0);
dotGuiAdd(geolitGroup.position, `geolitGroup position`);
dotGuiAdd(geolitGroup.rotation, `geolitGroup rotation`);
scene.add(geolitGroup);







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
crossHairMesh.name = crossHairMeshName;
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

// raycaster
// Raycater
const raycaster = new Raycaster();
const mouse = new Vector2();


// events
document.addEventListener('mousemove',onMouseMove,false);
document.addEventListener('click',onClick,false);

function onMouseMove(event: MouseEvent){
    // event.preventDefault(); // 기존 동작 중지

    // mouse.x = (event.clientX/ window.innerWidth) * 2 - 1;
    // mouse.y = (event.clientX/ window.innerWidth) * 2 + 1;
    // console.log(mouse.x, mouse.y);
    mouse.x = crossHairMesh.position.x;
    mouse.y = crossHairMesh.position.y;
    // raycaster update
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children);

    // 교차된 객체 하이라이트
    for (let i = 0; i < intersects.length; i++) {
        // @ts-ignore
        // intersects[i].object.material.color.set(0xff0000);
    }

}

function onClick(event: MouseEvent){
    // event.preventDefault(); // 기존 동작 중지

    // raycaster update
    raycaster.setFromCamera(mouse, camera);

    // 객체 감지
    const intersects = raycaster.intersectObjects(scene.children);
    console.log(intersects);
    for(const intersect of intersects){
        //@ts-ignore

        if(intersect.object.name === crossHairMeshName){
            continue;
        }
        
        console.log(intersect.object.name);
        break;
    }
}






draw();
