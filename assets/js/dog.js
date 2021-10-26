import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';

import { GLTFLoader } from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';

var controls
var mobileview = false;

const canvas = document.querySelector('.dog_canvas')
const scene = new THREE.Scene()
const loader = new GLTFLoader()
var doggoMesh
var pivot

loader.load('assets/3d/dog_new.glb',function(glb){
    console.log(glb)
    doggoMesh = glb.scene;
    doggoMesh.scale.set(0.3,0.3,0.3)
    doggoMesh.translateY(-0.5)
    pivot = new THREE.Group();
    scene.add( pivot );
    pivot.add( doggoMesh );

}, function(xhr){
    console.log((xhr.loaded/xhr.total * 100) + "% loaded")
},function(error){
    console.log("error")
})



const ambientLight = new THREE.AmbientLight(0xcccfff, 1)
scene.add(ambientLight)

var sizes = {
    width : window.innerWidth,
    height : window.innerHeight
}

const camera = new THREE.PerspectiveCamera(60,sizes.width/sizes.height, 0.1, 50 )
camera.position.set(1,0.4,3)

scene.add(camera)
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    canvas: canvas
})
controls = new OrbitControls(camera, renderer.domElement)
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
renderer.shadowMap.enabled = false
controls.enableZoom = false
renderer.gammaOutput = true
renderer.render(scene,camera)
controls.enablePan = true

controls.target.set(-1.187,-0.2436,0.6246)
if (window.innerWidth <= 600){
    camera.position.set(3.21, 0.2422, -1.147)
    controls.enableZoom = false;
    controls.enabled = false;
} else if (window.innerWidth <= 800){
    camera.position.set(2.7, 2, -1)
    controls.enableZoom = false;
    controls.enabled = false;
}

function animate(){
    requestAnimationFrame(animate)
    pivot.rotation.y += 0.01;
    renderer.render(scene, camera)
    controls.update()
}
function onResize() {
    if (window.innerWidth <= 600){
        camera.position.set(3.21, 0.2422, -1.147)
        controls.enableZoom = false;
        controls.enabled = false;
    } else if (window.innerWidth <= 800){
        camera.position.set(2.7, 2, -1)
        controls.enableZoom = false;
        controls.enabled = false;
    }else{
        controls.target.set(-1.187,-0.2436,0.6246)
        camera.position.set(1,0.4,3)
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight
        renderer.setSize(sizes.width, sizes.height)
        camera.aspect = sizes.width/sizes.height
        camera.updateProjectionMatrix()
    }
    controls.update()    
    console.log("RESIZE")
}
  
function test(){
    console.log(controls.target)
    console.log(camera.position)
}
window.addEventListener('resize', onResize);
controls.addEventListener( 'change', test );
animate()





// import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';

// import { GLTFLoader } from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/GLTFLoader.js';
// import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';

// var controls
// var mobileview = false;

// const canvas = document.querySelector('.dog_canvas')
// const scene = new THREE.Scene()

// const loader = new GLTFLoader()
// loader.load('assets/3d/dog_new.glb',function(glb){
//     console.log(glb)
//     const root = glb.scene;
//     root.scale.set(0.3,0.3,0.3)
//     root.translateY(-0.4);
//     scene.add(root);
// }, function(xhr){
//     console.log((xhr.loaded/xhr.total * 100) + "% loaded")
// },function(error){
//     console.log("error")
// })

// const ambientLight = new THREE.AmbientLight(0xcccfff, 1)
// scene.add(ambientLight)






// var sizes = {
//     width : window.innerWidth/2,
//     height : window.innerHeight
// }

// if (window.innerWidth <= 600){
//     console.log("OPENED ON MOBILE")
//     sizes.width = window.innerWidth
//     mobileview = true
// }

// const camera = new THREE.PerspectiveCamera(75,sizes.width/sizes.height, 0.1, 100 )
// camera.position.set(1.4,0.6,1.7)

// scene.add(camera)



// const renderer = new THREE.WebGLRenderer({
//     antialias: true,
//     alpha: true,
//     canvas: canvas
// })
// controls = new OrbitControls(camera, renderer.domElement)
// renderer.setSize(sizes.width, sizes.height)
// renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
// renderer.shadowMap.enabled = false
// controls.enableZoom = false
// renderer.gammaOutput = true
// renderer.render(scene,camera)
// controls.enablePan = false
// controls.autoRotate = true
// if (window.innerWidth <= 600){
//     controls.enableZoom = false;
//     controls.enabled = false;
// }
// console.log(sizes.width, sizes.height)
// function animate(){
//     requestAnimationFrame(animate)
//     renderer.render(scene, camera)
//     controls.update()
// }
// function onResize() {
    
//     if (window.innerWidth <= 600){
//         if(mobileview == false){
//             sizes.width = window.innerWidth
//             sizes.height = window.innerHeight
//             controls.enableRotate = false;
//             controls.enabled = false;
//         }
//     }else{
//         sizes.width = window.innerWidth/2
//         sizes.height = window.innerHeight
//         controls.enableRotate = true;
//         controls.enabled = true;
//     }
//     renderer.setSize(sizes.width, sizes.height)
//     console.log(sizes.width, sizes.height)
//     camera.aspect = sizes.width/sizes.height
//     camera.updateProjectionMatrix()
// }
  
// window.addEventListener('resize', onResize);

// animate()