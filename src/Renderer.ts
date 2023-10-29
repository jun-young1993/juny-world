import * as THREE from "three";

interface RendererInterface {
    canvas: HTMLCanvasElement
}

export default class Renderer {
    private readonly canvas: HTMLCanvasElement;
    constructor(rendererProperty: RendererInterface) {
        this.canvas = rendererProperty.canvas;

    }
}