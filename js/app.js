import * as THREE from "three";
import * as dat from "dat.gui";
import fragment from "./shader/fragment.glsl";
import vertex from "./shader/vertex.glsl";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { resolveLygia } from 'resolve-lygia'

var colors = require('nice-color-palettes');
let ind = Math.floor(Math.random() * colors.length);
// ind = 93;
let pallete = colors[ind];

pallete = ['#ff90a5','#4127ff','#060638']

export default class Sketch {
    constructor(options) {
        this.scene = new THREE.Scene();

        this.container = options.dom;
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.renderer = new THREE.WebGLRenderer({alpha: true});
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.outputEncoding = THREE.sRGBEncoding;

        this.container.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.001, 1000);

        // var frustumSize = 10;
        // var aspect = window.innerWidth / window.innerHeight;
        // this.camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, -1000, 1000 );
        this.camera.position.set(0, 0, 1.5);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.time = 0;

        this.isPlaying = true;

        this.addObjects();
        this.resize();
        this.render();
        this.setupResize();
        this.settings();
    }

    settings() {
        let that = this;
        this.settings = {
            waveSize: 0.2,
            waveSpeed: 10.0,
            waveDensity: 0.1,
            colorSpeed: 0.3,
            colorSpread: 0.4,
        };
        this.gui = new dat.GUI();


        const folder1 = this.gui.addFolder("Waves Noise");
        const folder2 = this.gui.addFolder("Color Noise");
        const folder3 = this.gui.addFolder("Colors");
        // folder1.add(settings, "density", 0, 10, 0.01);
        folder1.add(this.settings, "waveSize", 0, 1, 0.02).onChange(() => {
            this.material.uniforms.uWaveSize.value = this.settings.waveSize;
        }).name('size');
        folder1.add(this.settings, "waveSpeed", 0.1, 80, 0.1).onChange(() => {
            this.material.uniforms.uWaveSpeed.value = this.settings.waveSpeed;
        }).name("speed");
        folder1.open();
        folder2.add(this.settings, "colorSpeed", 0.001, 10.0, 0.01).onChange(() => {
            this.material.uniforms.uColorSpeed.value = this.settings.colorSpeed;
        }).name('speed');
        folder2.add(this.settings, "colorSpread", 0.1, 1, 0.001).onChange(() => {
            this.material.uniforms.uColorSpread.value = this.settings.colorSpread;
        }).name('density');
        folder2.open();
        folder3.addColor(pallete, "0").name('color 1').onChange(() => {
            this.material.uniforms.uColor.value = pallete.map((color) => new THREE.Color(color))
        });
        folder3.addColor(pallete, "1").name('color 2').onChange(() => {
            this.material.uniforms.uColor.value = pallete.map((color) => new THREE.Color(color))
        });
        folder3.addColor(pallete, "2").name('color 3').onChange(() => {
            this.material.uniforms.uColor.value = pallete.map((color) => new THREE.Color(color))
        });
        folder3.open();
    }

    setupResize() {
        window.addEventListener("resize", this.resize.bind(this));
    }

    resize() {
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
    }

    addObjects() {
        let that = this;
        this.material = new THREE.ShaderMaterial({
            extensions: {
                derivatives: "#extension GL_OES_standard_derivatives : enable"
            },
            side: THREE.DoubleSide,
            uniforms: {
                time: { type: "f", value: 0 },
                uColor: {value: pallete.map((color) => new THREE.Color(color))},
                uWaveSize: {value: this.settings?.waveSize || 0.2},
                uWaveSpeed: {value: this.settings?.waveSpeed || 10.0},
                uColorSpread: {value: this.settings?.colorSpread || 0.4},
                uColorSpeed: {value: this.settings?.colorSpeed || 0.3},
                resolution: { type: "v4", value: new THREE.Vector4() },
                uvRate1: {
                    value: new THREE.Vector2(1, 1)
                },
                uLightPos: {
                    value: new THREE.Vector3(-10, 2, 0) // position of spotlight
                },
                uLightColor: {
                    value: new THREE.Color(0xffffff) // default light color
                },
                uLightIntensity: {
                    value: .85 // light intensity
                },
            },
            // wireframe: true,
            // transparent: true,
            vertexShader: resolveLygia(vertex),
            fragmentShader: resolveLygia(fragment)
        });

        this.geometry = new THREE.PlaneGeometry(3, 2, 300, 200);

        this.plane = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.plane);
    }

    stop() {
        this.isPlaying = false;
    }

    play() {
        if (!this.isPlaying) {
            this.render();
            this.isPlaying = true;
        }
    }

    render() {
        if (!this.isPlaying) return;
        this.time += 0.0001;
        this.material.uniforms.time.value = this.time;
        requestAnimationFrame(this.render.bind(this));
        this.renderer.render(this.scene, this.camera);
    }
}

new Sketch({
    dom: document.getElementById("container")
});
