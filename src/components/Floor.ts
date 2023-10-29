import {BoxGeometry, Mesh, MeshPhongMaterial, Object3DEventMap, Scene} from "three";
import Stuff from "./Stuff";



interface FloorInterface extends Stuff{
    width : number,
    height? : number,
    depth: number,
    color?: string,
    scene: Scene
}
export default class Floor {
    private readonly geometry: BoxGeometry;
    private readonly material: MeshPhongMaterial;
    private readonly mesh: Mesh<BoxGeometry, MeshPhongMaterial, Object3DEventMap>;

    constructor(floorProperty: FloorInterface) {

        this.geometry = new BoxGeometry(floorProperty.width, floorProperty.height || 1, floorProperty.depth);
        this.material = new MeshPhongMaterial({color: floorProperty.color || '#ffe9ac'});
        this.mesh = new Mesh(this.geometry, this.material);
        this.mesh.position.set(0,0,0);
        floorProperty.scene.add(this.mesh);
    }
}