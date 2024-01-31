import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()
gui.hide()

// Canvas
const canvas = document.querySelector('canvas.webgl')

const click = document.querySelector('.popup')
click.addEventListener('click', () => {
    click.classList.add('hidden')
    canvas.style.display = "block"

    const listener = new THREE.AudioListener();
    camera.add(listener)

    const sound = new THREE.Audio(listener)

    const audioLoader = new THREE.AudioLoader()
    audioLoader.load('sounds/halloweenMusic.mp3', (buffer) => {
        sound.setBuffer(buffer)
        sound.setLoop(true)
        sound.setVolume(.5)
        sound.play()
    })
})

// Scene
const scene = new THREE.Scene()

// FOG
const fog = new THREE.Fog('#112222', 2, 8)
scene.fog = fog

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const bushTexture = textureLoader.load('./textures/grass/color.jpg')
bushTexture.colorSpace = THREE.SRGBColorSpace

const doorColorTexture = textureLoader.load('./textures/door/color.jpg')
doorColorTexture.colorSpace = THREE.SRGBColorSpace

const doorAlphaTexture = textureLoader.load('./textures/door/alpha.jpg')
const doorAmbientTexture = textureLoader.load('./textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('./textures/door/height.jpg')
const doorMetalnessTexture = textureLoader.load('./textures/door/metalness.jpg')
const doorNormalTexture = textureLoader.load('./textures/door/normal.jpg')
const doorRoughnessTexture = textureLoader.load('./textures/door/roughness.jpg')

const bricksColorTexture = textureLoader.load('./textures/bricks/color.jpg')
bricksColorTexture.colorSpace = THREE.SRGBColorSpace

const bricksAmbientTexture = textureLoader.load('./textures/bricks/ambientOcclusion.jpg')
const bricksNormalTexture = textureLoader.load('./textures/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load('./textures/bricks/roughness.jpg')

const grassColorTexture = textureLoader.load('./textures/grass/color.jpg')
grassColorTexture.colorSpace = THREE.SRGBColorSpace

const grassAmbientTexture = textureLoader.load('./textures/grass/ambientOcclusion.jpg')
const grassNormalTexture = textureLoader.load('./textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('./textures/grass/roughness.jpg')

grassColorTexture.repeat.set(8, 8)
grassAmbientTexture.repeat.set(8, 8)
grassNormalTexture.repeat.set(8, 8)
grassRoughnessTexture.repeat.set(8, 8)

grassColorTexture.wrapS = THREE.RepeatWrapping
grassColorTexture.wrapT = THREE.RepeatWrapping

grassAmbientTexture.wrapS = THREE.RepeatWrapping
grassAmbientTexture.wrapT = THREE.RepeatWrapping

grassNormalTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping

grassRoughnessTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping

/**
 * House
 */

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        map: grassColorTexture,
        aoMap: grassAmbientTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture
    })
)
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

// House

const house = new THREE.Group()
scene.add(house)

//walls
const h = 3
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, h, 4),
    new THREE.MeshStandardMaterial({
        map: bricksColorTexture,
        aoMap: bricksAmbientTexture,
        normalMap: bricksNormalTexture,
        // roughness: bricksRoughnessTexture
    })
)
walls.position.set(0, h * .5, 0)
house.add(walls)

//roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3, 2, 4),
    new THREE.MeshStandardMaterial({ color: 'darkred' })
)
roof.position.y = h + 1
roof.rotation.y = Math.PI * .25
house.add(roof)

//DOOR 
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(1.8, 2, 100, 100),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughness: doorRoughnessTexture
    })
)


const doorFrame = new THREE.Mesh(
    new THREE.PlaneGeometry(1.3, 2.2),
    new THREE.MeshStandardMaterial({ color: 'black' })
)

doorFrame.position.set(0, 1, 2.001)
door.position.set(0, 1, 2.01)
house.add(door, doorFrame)

// BUSHES
const bushGeo = new THREE.SphereGeometry(.6, 16, 16)
const bushMat = new THREE.MeshStandardMaterial({ map: bushTexture })

const bushR1 = new THREE.Mesh(bushGeo, bushMat)
const bushR2 = new THREE.Mesh(bushGeo, bushMat)
const bushR3 = new THREE.Mesh(bushGeo, bushMat)
const bushL1 = new THREE.Mesh(bushGeo, bushMat)
const bushL2 = new THREE.Mesh(bushGeo, bushMat)
const bushL3 = new THREE.Mesh(bushGeo, bushMat)

bushR2.scale.set(.75, .5, .75)
bushR3.scale.set(.55, 1.65, .55)
bushL2.scale.set(.75, .5, .75)
bushL3.scale.set(.55, 1.55, .55)

bushR1.position.set(1.2, .6, 2.5)
bushR2.position.set(1.2, 1.3, 2.5)
bushR3.position.set(1.2, 1.8, 2.5)

bushL1.position.set(-1.2, .6, 2.5)
bushL2.position.set(-1.2, 1.3, 2.5)
bushL3.position.set(-1.2, 1.8, 2.5)

house.add(bushR1, bushL1, bushL2, bushR2, bushR3, bushL3)


//GRAVES

const graves = new THREE.Group()
scene.add(graves)

const graveGeo = new THREE.BoxGeometry(.6, .8, .2)
const graveMat = new THREE.MeshStandardMaterial({ color: 'gray' })

for (let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = 3 + Math.random() * 6
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius
    const grave = new THREE.Mesh(graveGeo, graveMat)
    grave.position.set(x, .2, z)

    grave.rotation.y = Math.random() - .5
    grave.rotation.z = Math.random() - .5
    graves.add(grave)

}

////////// GHOSTS!!!  //////

const ghost1 = new THREE.Group()
const ghost2 = new THREE.Group()
const ghost3 = new THREE.Group()
scene.add(ghost1, ghost2, ghost3)

//GHOST BODIES
const ghostBodyGeo = new THREE.SphereGeometry(.5, 10, 10, 1, 12, 13, 14)
const ghostBodyMat = new THREE.MeshStandardMaterial({ color: 'white' })

const ghostBody1 = new THREE.Mesh(ghostBodyGeo, ghostBodyMat)
ghost1.add(ghostBody1)

const ghostBody2 = new THREE.Mesh(ghostBodyGeo, ghostBodyMat)
ghost2.add(ghostBody2)

const ghostBody3 = new THREE.Mesh(ghostBodyGeo, ghostBodyMat)
ghost3.add(ghostBody3)

//GHOST EYES
const ghostEyeGeo = new THREE.CylinderGeometry(.25, .05, .72)
const ghostEyeMat = new THREE.MeshStandardMaterial({ color: "gold" })

const ghost1LEye = new THREE.Mesh(ghostEyeGeo, ghostEyeMat)
const ghost1REye = new THREE.Mesh(ghostEyeGeo, ghostEyeMat)
const ghost2LEye = new THREE.Mesh(ghostEyeGeo, ghostEyeMat)
const ghost2REye = new THREE.Mesh(ghostEyeGeo, ghostEyeMat)
const ghost3LEye = new THREE.Mesh(ghostEyeGeo, ghostEyeMat)
const ghost3REye = new THREE.Mesh(ghostEyeGeo, ghostEyeMat)


ghost1.add(ghost1LEye, ghost1REye)
ghost2.add(ghost2LEye, ghost2REye)
ghost3.add(ghost3LEye, ghost3REye)

/**
 * Lights
 */1
// Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.3)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

const doorLight = new THREE.PointLight('orange', 6, 4, 3)
doorLight.position.set(0, 2.5, 3)
doorLight.castShadow = true
house.add(doorLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', .2)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

//GHOST Lights

const ghost1Light = new THREE.PointLight('#ff00ff', 6, 3)
ghost1.add(ghost1Light)
const ghost2Light = new THREE.PointLight('#00ffff', 6, 3)
ghost2.add(ghost2Light)
const ghost3Light = new THREE.PointLight('#ffff00', 6, 3)
ghost3.add(ghost3Light)



//SHADOWS
moonLight.castShadow = true
ghost1Light.castShadow = true
ghost2Light.castShadow = true
ghost3Light.castShadow = true

walls.castShadow = true
bushL1.castShadow = true
bushL2.castShadow = true
bushL3.castShadow = true
bushR1.castShadow = true
bushR2.castShadow = true
bushR3.castShadow = true

floor.receiveShadow = true
walls.receiveShadow = true

doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256

ghost1Light.shadow.mapSize.width = 256
ghost1Light.shadow.mapSize.height = 256
ghost2Light.shadow.mapSize.width = 256
ghost2Light.shadow.mapSize.height = 256
ghost3Light.shadow.mapSize.width = 256
ghost3Light.shadow.mapSize.height = 256

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 2
camera.position.z = 7
scene.add(camera)






// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#112222')
renderer.shadowMap.enabled = true

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    const ghost1Angle = elapsedTime * .2
    ghost1.position.x = Math.cos(ghost1Angle / 2) * 4
    ghost1.position.z = Math.sin(ghost1Angle / 3) * 4
    ghost1.position.y = Math.sin(ghost1Angle * 3) * 4



    const ghost2Angle = elapsedTime * -.32
    ghost2.position.x = Math.cos(ghost2Angle) * 5
    ghost2.position.z = Math.sin(ghost2Angle) + Math.sin(ghost2Angle) * 5
    ghost2.position.y = Math.sin(ghost2Angle * 4) + Math.sin(elapsedTime * 2.5)


    const ghost3Angle = elapsedTime * -1.1
    ghost3.position.x = Math.cos(ghost3Angle) * 5
    ghost3.position.z = Math.sin(ghost3Angle) * 5
    ghost3.position.y = Math.sin(ghost3Angle * -4) + 1



    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()