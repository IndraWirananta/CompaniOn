// // import * as THREE from '../node_modules/three/build/three.module.js';
// // // import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// // import {GLTFLoader} from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js';

// import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';

// import { GLTFLoader } from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/GLTFLoader.js';
// const canvas = document.querySelector('.dog_canvas')
// const scene = new THREE.Scene()

// const loader = new GLTFLoader()
// loader.load('./assets',function(gltf){
//     console.log(gltf)
// }, function(xhr){
//     console.log((xhr.loaded/xhr.total * 100) + "% loaded")
// },function(error){
//     console.log("error")
// })

// const sizes = {
//     width: window.innerWidth,
//     height: window.innerHeight
// }

// const camera = new THREE.PerspectiveCamera(75,sizes.width/sizes.height, 0.1, 100 )
// camera.position.set(0,1,2)
// scene.add(camera)

// const renderer = new THREE.WebGLRenderer({
//     canvas: canvas
// })

// renderer.setSize(sizes.width, sizes.height)
// renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
// renderer.shadowMap.enabled = true
// renderer.gammaOutput = true