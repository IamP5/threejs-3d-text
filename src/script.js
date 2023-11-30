import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import GUI from 'lil-gui'

const gui = new GUI()

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('textures/matcaps/8.png')
matcapTexture.colorSpace = THREE.SRGBColorSpace

let isAnimating = true;

const fontLoader = new FontLoader()
fontLoader.load(
    'fonts/helvetiker_regular.typeface.json',
    (font) => {
        const textGeometry = new TextGeometry(
            'Sara te amo <3',
            {
                font,
                size: 0.5,
                height: 0.2,
                curveSegments: 5,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 4
            }
        )
        textGeometry.computeBoundingBox();
        textGeometry.center()
/*         textGeometry.translate(
            - (textGeometry.boundingBox.max.x - 0.02) * 0.5,
            - (textGeometry.boundingBox.max.y - 0.02) * 0.5,
            - (textGeometry.boundingBox.max.z - 0.03) * 0.5
        ) */
        const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
        const text = new THREE.Mesh(textGeometry, material)
        scene.add(text)

        const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
        for(let i = 0; i < 100; i++) {
            const donut = new THREE.Mesh(donutGeometry, material)

            donut.position.x = (Math.random() - 0.5) * 10
            donut.position.y = (Math.random() - 0.5) * 10
            donut.position.z = (Math.random() - 0.5) * 10

            donut.rotation.x = Math.random() * Math.PI
            donut.rotation.y = Math.random() * Math.PI

            const scale = Math.random()
            donut.scale.set(scale, scale, scale)

            scene.add(donut)
        }

        const sphereGeometry = new THREE.SphereGeometry(0.3, 32, 32)
        for(let i = 0; i < 100; i++) {
            const sphere = new THREE.Mesh(sphereGeometry, material)

            sphere.position.x = (Math.random() - 0.5) * 10
            sphere.position.y = (Math.random() - 0.5) * 10
            sphere.position.z = (Math.random() - 0.5) * 10

            sphere.rotation.x = Math.random() * Math.PI
            sphere.rotation.y = Math.random() * Math.PI

            const scale = Math.random()
            sphere.scale.set(scale, scale, scale)

            scene.add(sphere)
        }

        
        const cubeGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3)
        for(let i = 0; i < 100; i++) {
            const cube = new THREE.Mesh(cubeGeometry, material)

            cube.position.x = (Math.random() - 0.5) * 10
            cube.position.y = (Math.random() - 0.5) * 10
            cube.position.z = (Math.random() - 0.5) * 10

            cube.rotation.x = Math.random() * Math.PI
            cube.rotation.y = Math.random() * Math.PI

            const scale = Math.random()
            cube.scale.set(scale, scale, scale)

            scene.add(cube)
        }
        const targetPosition = new THREE.Vector3();
        text.getWorldPosition(targetPosition);

        const clock = new THREE.Clock();

        const center = new THREE.Vector3(0, 0, 0);
        const radius = 4;
        
        const tick = () =>
        {
            if (isAnimating) {
                const elapsedTime = clock.getElapsedTime()
        
                const angle = (elapsedTime) * 0.4;
            
                const x = center.x + radius * Math.cos(angle);
                const z = center.z + radius * Math.sin(angle + (Math.PI * 0.25));
                const y = center.y + radius * Math.sin(angle);
    
                camera.position.set(x, y, z);
                camera.lookAt(center);
            }
        
            renderer.render(scene, camera)

            window.requestAnimationFrame(tick)
        }
        
        tick()
    }
)

const GUIControls = {
    startAnimation: () => {
        isAnimating = true;
    },
    stopAnimation: () => {
        isAnimating = false;
        camera.lookAt(center);
    }
};

gui.add(GUIControls, 'startAnimation');
gui.add(GUIControls, 'stopAnimation');

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = (Math.random() - 0.5) * 10
camera.position.y = (Math.random() - 0.5) * 10
camera.position.z = (Math.random() - 0.5) * 10

camera.lookAt(new THREE.Vector3(0, 0, 0))

scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))