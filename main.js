import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as lil from 'lil-gui'

const menuCallBack = (e)=>{
  menu.classList.toggle("open")
  console.debug()
}

const hero = document.querySelector('.hero')

// DEBUG
const gui = new lil.GUI()
gui.hide()
if(window.location.hash === '#debug')
gui.show()

const canvas = document.querySelector('canvas.webgl')

const menu = document.querySelector('.burger-menu')
menu.addEventListener('click',menuCallBack)

// Create a scene
var scene = new THREE.Scene();

// Create a camera
var camera = new THREE.PerspectiveCamera(75, hero.clientWidth / hero.clientHeight, 1, 1100);
camera.position.z = 3;

// Create a renderer
var renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
renderer.setClearColor( 0x000000, 0 ); // the default
renderer.setSize(hero.clientWidth, hero.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
document.querySelector('.hero').appendChild(renderer.domElement);

// Load glb
const  loader = new GLTFLoader();
const material = new THREE.MeshStandardMaterial({side:THREE.BackSide,color:new THREE.Color(0xffffff), emissive:new THREE.Color("rgb(242, 176, 211)"),emissiveIntensity:0.12, roughness: 0})
loader.load(`/meshs/sphere_pilea_smooth.glb`,(glb)=>{
  for(let child of glb.scene.children){
    child.material = material
    const max = 0.005
    const min = -0.005
    child.userData.rotation = Math.random() * (max - min) + min
  }
  glb.scene.position.x = -1.3
  glb.scene.rotation.set(-0.8, 0, 0.5)
  scene.add(glb.scene)
  console.log(scene)
})

const directionalLight = new THREE.DirectionalLight(new THREE.Color("rgb(223, 210, 185)"), 3.68)
directionalLight.position.set(0, 1, 3)
directionalLight.rotation.set(0, 2, 0)
scene.add(directionalLight)

const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) =>
{
  cursor.x = event.clientX / window.innerWidth - 0.5
  cursor.y = event.clientY / window.innerHeight - 0.5
})

const clock = new THREE.Clock()
let previousTime = 0

// Start the animation loop
animate();

// This function is called every frame
function animate() {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - previousTime
  previousTime = elapsedTime

  const parallaxX = cursor.x * 1
  const parallaxY = - cursor.y * 1

  if(scene.children[1]){
    for(let mesh of scene.children[1].children){
      mesh.rotation.y += mesh.userData.rotation

      mesh.position.x += (- parallaxX - mesh.position.x) * Math.random() * deltaTime
      mesh.position.z += (parallaxY - mesh.position.z) * Math.random() * deltaTime
      // mesh.position.y += (- parallaxY - mesh.position.y) * 1 * deltaTime
    }
  }

  // Render the scene
  renderer.render(scene, camera);

  // Request another frame
  requestAnimationFrame(animate);

}