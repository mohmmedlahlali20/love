"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Smile, Sparkles, MessageCircle } from "lucide-react"
import Swal from "sweetalert2"
import * as THREE from "three"

const compliments = [
  "You're my favorite notification.",
  "You make my heart write infinite loops.",
  "You're the semicolon to my code — it all makes sense with you.",
  "You're the Git to my commit. 💖",
]

const supportMessages = [
  "Everything gonna be okay ✨",
  "You're amazing just the way you are! 💖",
  "You're not alone — I'm here. ❤️",
  "Breathe. You've got this. 🌈",
  "You are loved, deeply and truly. 💫",
]

const animations = {
  initial: { opacity: 0, y: -30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeOut" },
}

// Create heart shape geometry
const createHeartShape = () => {
  const heartShape = new THREE.Shape()
  const x = 0,
    y = 0
  heartShape.moveTo(x + 5, y + 5)
  heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y)
  heartShape.bezierCurveTo(x - 6, y, x - 6, y + 3.5, x - 6, y + 3.5)
  heartShape.bezierCurveTo(x - 6, y + 5.5, x - 4, y + 7.7, x, y + 10)
  heartShape.bezierCurveTo(x + 4, y + 7.7, x + 6, y + 5.5, x + 6, y + 3.5)
  heartShape.bezierCurveTo(x + 6, y + 3.5, x + 6, y, x, y)
  heartShape.bezierCurveTo(x + 4, y, x + 5, y + 5, x + 5, y + 5)
  return heartShape
}

// Create flower shape geometry
const createFlowerShape = () => {
  const flowerShape = new THREE.Shape()
  const centerX = 0,
    centerY = 0,
    radius = 2

  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2
    const petalX = centerX + Math.cos(angle) * radius
    const petalY = centerY + Math.sin(angle) * radius

    if (i === 0) {
      flowerShape.moveTo(petalX, petalY)
    }

    const nextAngle = ((i + 1) / 5) * Math.PI * 2
    const nextPetalX = centerX + Math.cos(nextAngle) * radius
    const nextPetalY = centerY + Math.sin(nextAngle) * radius

    const controlX = centerX + Math.cos(angle + Math.PI / 5) * radius * 1.5
    const controlY = centerY + Math.sin(angle + Math.PI / 5) * radius * 1.5

    flowerShape.quadraticCurveTo(controlX, controlY, nextPetalX, nextPetalY)
  }

  return flowerShape
}

export default function LoveComedyPage() {
  const [joke, setJoke] = useState("Why did the programmer fall in love? Because he found the one with no bugs!")
  const [showMore, setShowMore] = useState(false)
  const [noBtnStyle, setNoBtnStyle] = useState({ top: "50%", left: "60%" })
  const [hearts, setHearts] = useState<Array<{ id: number; x: number; y: number }>>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene>()
  const rendererRef = useRef<THREE.WebGLRenderer>()
  const cameraRef = useRef<THREE.PerspectiveCamera>()
  const particlesRef = useRef<THREE.Points[]>([])
  const heartsRef = useRef<THREE.Mesh[]>([])
  const flowersRef = useRef<THREE.Mesh[]>([])
  const clockRef = useRef<THREE.Clock>(new THREE.Clock())

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Three.js setup
  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    mountRef.current.appendChild(renderer.domElement)

    sceneRef.current = scene
    rendererRef.current = renderer
    cameraRef.current = camera

    // Create romantic particle systems (rose petals, heart particles)
    const createRomanticParticles = (
      count: number,
      color: number,
      size: number,
      spread: number,
      shape: "heart" | "petal",
    ) => {
      const particles = new THREE.BufferGeometry()
      const positions = new Float32Array(count * 3)
      const velocities = new Float32Array(count * 3)
      const colors = new Float32Array(count * 3)
      const rotations = new Float32Array(count)

      for (let i = 0; i < count * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * spread
        positions[i + 1] = (Math.random() - 0.5) * spread
        positions[i + 2] = (Math.random() - 0.5) * spread

        velocities[i] = (Math.random() - 0.5) * 0.01
        velocities[i + 1] = Math.random() * -0.02 - 0.01 // Gentle falling
        velocities[i + 2] = (Math.random() - 0.5) * 0.01

        const particleColor = new THREE.Color(color)
        if (shape === "heart") {
          particleColor.setHSL(0.95 + Math.random() * 0.1, 0.8, 0.6 + Math.random() * 0.2)
        } else {
          particleColor.setHSL(0.05 + Math.random() * 0.1, 0.7, 0.7 + Math.random() * 0.2)
        }
        colors[i] = particleColor.r
        colors[i + 1] = particleColor.g
        colors[i + 2] = particleColor.b

        rotations[i / 3] = Math.random() * Math.PI * 2
      }

      particles.setAttribute("position", new THREE.BufferAttribute(positions, 3))
      particles.setAttribute("color", new THREE.BufferAttribute(colors, 3))
      particles.userData = { velocities, rotations, shape }

      const particleMaterial = new THREE.PointsMaterial({
        size: size,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      })

      const particleSystem = new THREE.Points(particles, particleMaterial)
      scene.add(particleSystem)
      return particleSystem
    }

    // Create romantic particle systems
    const particleSystems = [
      createRomanticParticles(150, 0xff69b4, 0.3, 60, "heart"), // Pink hearts
      createRomanticParticles(200, 0xff1493, 0.2, 50, "petal"), // Rose petals
      createRomanticParticles(100, 0xff6347, 0.25, 70, "heart"), // Coral hearts
    ]
    particlesRef.current = particleSystems

    // Create 3D Hearts
    const heartShape = createHeartShape()
    const heartGeometry = new THREE.ExtrudeGeometry(heartShape, {
      depth: 0.5,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 2,
      bevelSize: 0.1,
      bevelThickness: 0.1,
    })

    const heartMaterials = [
      new THREE.MeshPhongMaterial({
        color: 0xff69b4,
        transparent: true,
        opacity: 0.8,
        shininess: 100,
        emissive: 0x331122,
      }),
      new THREE.MeshPhongMaterial({
        color: 0xff1493,
        transparent: true,
        opacity: 0.7,
        shininess: 100,
        emissive: 0x221133,
      }),
      new THREE.MeshPhongMaterial({
        color: 0xff6347,
        transparent: true,
        opacity: 0.9,
        shininess: 100,
        emissive: 0x332211,
      }),
    ]

    const hearts3D: THREE.Mesh[] = []
    for (let i = 0; i < 15; i++) {
      const material = heartMaterials[Math.floor(Math.random() * heartMaterials.length)].clone()
      const heart = new THREE.Mesh(heartGeometry, material)

      heart.position.set((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30)

      heart.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)

      heart.scale.setScalar(0.1 + Math.random() * 0.1)

      heart.userData = {
        originalPosition: heart.position.clone(),
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.01,
          y: (Math.random() - 0.5) * 0.01,
          z: (Math.random() - 0.5) * 0.01,
        },
        floatSpeed: Math.random() * 0.02 + 0.01,
        floatRange: Math.random() * 2 + 1,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        orbitRadius: Math.random() * 3 + 1,
        orbitSpeed: (Math.random() - 0.5) * 0.008,
      }

      heart.castShadow = true
      heart.receiveShadow = true

      hearts3D.push(heart)
      scene.add(heart)
    }
    heartsRef.current = hearts3D

    // Create 3D Flowers
    const flowerShape = createFlowerShape()
    const flowerGeometry = new THREE.ExtrudeGeometry(flowerShape, {
      depth: 0.2,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 2,
      bevelSize: 0.05,
      bevelThickness: 0.05,
    })

    const flowerMaterials = [
      new THREE.MeshPhongMaterial({
        color: 0xffb6c1,
        transparent: true,
        opacity: 0.8,
        shininess: 80,
        emissive: 0x221122,
      }),
      new THREE.MeshPhongMaterial({
        color: 0xffc0cb,
        transparent: true,
        opacity: 0.7,
        shininess: 80,
        emissive: 0x112211,
      }),
      new THREE.MeshPhongMaterial({
        color: 0xff69b4,
        transparent: true,
        opacity: 0.9,
        shininess: 80,
        emissive: 0x221133,
      }),
    ]

    const flowers3D: THREE.Mesh[] = []
    for (let i = 0; i < 12; i++) {
      const material = flowerMaterials[Math.floor(Math.random() * flowerMaterials.length)].clone()
      const flower = new THREE.Mesh(flowerGeometry, material)

      flower.position.set((Math.random() - 0.5) * 35, (Math.random() - 0.5) * 25, (Math.random() - 0.5) * 25)

      flower.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)

      flower.scale.setScalar(0.3 + Math.random() * 0.2)

      flower.userData = {
        originalPosition: flower.position.clone(),
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.008,
          y: (Math.random() - 0.5) * 0.008,
          z: (Math.random() - 0.5) * 0.008,
        },
        floatSpeed: Math.random() * 0.015 + 0.008,
        floatRange: Math.random() * 1.5 + 0.5,
        pulseSpeed: Math.random() * 0.015 + 0.008,
        swaySpeed: Math.random() * 0.01 + 0.005,
      }

      flower.castShadow = true
      flower.receiveShadow = true

      flowers3D.push(flower)
      scene.add(flower)
    }
    flowersRef.current = flowers3D

    // Romantic lighting setup
    const ambientLight = new THREE.AmbientLight(0xffeef0, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(10, 10, 5)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    scene.add(directionalLight)

    // Soft romantic point lights
    const pointLights: THREE.PointLight[] = []
    const lightColors = [0xff69b4, 0xff1493, 0xffb6c1, 0xffc0cb, 0xff6347]
    for (let i = 0; i < 4; i++) {
      const pointLight = new THREE.PointLight(lightColors[i], 0.8, 30)
      pointLight.position.set((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20)
      pointLight.userData = {
        originalPosition: pointLight.position.clone(),
        orbitSpeed: (Math.random() - 0.5) * 0.01,
        orbitRadius: Math.random() * 8 + 4,
      }
      pointLights.push(pointLight)
      scene.add(pointLight)
    }

    camera.position.z = 25

    // Romantic animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      const elapsedTime = clockRef.current.getElapsedTime()

      // Gentle camera movement based on mouse
      if (cameraRef.current) {
        cameraRef.current.position.x += (mousePosition.x * 3 - cameraRef.current.position.x) * 0.03
        cameraRef.current.position.y += (mousePosition.y * 3 - cameraRef.current.position.y) * 0.03
        cameraRef.current.lookAt(0, 0, 0)
      }

      // Animate 3D hearts
      hearts3D.forEach((heart, index) => {
        const userData = heart.userData

        // Gentle rotation
        heart.rotation.x += userData.rotationSpeed.x
        heart.rotation.y += userData.rotationSpeed.y
        heart.rotation.z += userData.rotationSpeed.z

        // Floating motion
        heart.position.y =
          userData.originalPosition.y + Math.sin(elapsedTime * userData.floatSpeed + index) * userData.floatRange

        // Gentle orbital motion
        const orbitAngle = elapsedTime * userData.orbitSpeed + index
        heart.position.x = userData.originalPosition.x + Math.cos(orbitAngle) * userData.orbitRadius * 0.2
        heart.position.z = userData.originalPosition.z + Math.sin(orbitAngle) * userData.orbitRadius * 0.2

        // Gentle pulsing
        const pulseScale = 1 + Math.sin(elapsedTime * userData.pulseSpeed + index) * 0.1
        heart.scale.setScalar((0.1 + Math.random() * 0.1) * pulseScale)

        // Color animation
        if (heart.material instanceof THREE.MeshPhongMaterial) {
          const hue = 0.9 + Math.sin(elapsedTime * 0.5 + index) * 0.1
          heart.material.emissive.setHSL(hue, 0.3, 0.1)
        }

        // Mouse attraction
        const mouseVector = new THREE.Vector3(mousePosition.x * 10, mousePosition.y * 10, 0)
        const distance = heart.position.distanceTo(mouseVector)
        if (distance < 8) {
          heart.scale.multiplyScalar(1.1)
          if (heart.material instanceof THREE.MeshPhongMaterial) {
            heart.material.emissive.multiplyScalar(1.2)
          }
        }
      })

      // Animate 3D flowers
      flowers3D.forEach((flower, index) => {
        const userData = flower.userData

        // Gentle rotation
        flower.rotation.x += userData.rotationSpeed.x
        flower.rotation.y += userData.rotationSpeed.y
        flower.rotation.z += userData.rotationSpeed.z

        // Swaying motion like flowers in breeze
        flower.position.x = userData.originalPosition.x + Math.sin(elapsedTime * userData.swaySpeed + index) * 0.5
        flower.position.y =
          userData.originalPosition.y + Math.sin(elapsedTime * userData.floatSpeed + index) * userData.floatRange

        // Gentle pulsing
        const pulseScale = 1 + Math.sin(elapsedTime * userData.pulseSpeed + index) * 0.05
        flower.scale.setScalar((0.3 + Math.random() * 0.2) * pulseScale)

        // Color animation
        if (flower.material instanceof THREE.MeshPhongMaterial) {
          const hue = 0.05 + Math.sin(elapsedTime * 0.3 + index) * 0.05
          flower.material.emissive.setHSL(hue, 0.2, 0.08)
        }
      })

      // Animate romantic particles
      particleSystems.forEach((particleSystem, systemIndex) => {
        particleSystem.rotation.y += 0.0005 * (systemIndex + 1)

        const positions = particleSystem.geometry.attributes.position.array as Float32Array
        const velocities = particleSystem.geometry.userData.velocities as Float32Array
        const rotations = particleSystem.geometry.userData.rotations as Float32Array

        for (let i = 0; i < positions.length; i += 3) {
          // Apply gentle velocities
          positions[i] += velocities[i]
          positions[i + 1] += velocities[i + 1]
          positions[i + 2] += velocities[i + 2]

          // Gentle swaying motion
          positions[i] += Math.sin(elapsedTime * 0.5 + positions[i + 1] * 0.1) * 0.005

          // Boundary wrapping with gentle reset
          if (positions[i + 1] < -30) {
            positions[i + 1] = 30
            positions[i] = (Math.random() - 0.5) * 60
            positions[i + 2] = (Math.random() - 0.5) * 60
          }

          // Gentle mouse attraction
          const mouseInfluence = 0.0005
          const dx = mousePosition.x * 8 - positions[i]
          const dy = mousePosition.y * 8 - positions[i + 1]
          velocities[i] += dx * mouseInfluence
          velocities[i + 1] += dy * mouseInfluence

          // Update rotations
          rotations[i / 3] += 0.01
        }

        particleSystem.geometry.attributes.position.needsUpdate = true
      })

      // Animate romantic lights
      pointLights.forEach((light, index) => {
        const userData = light.userData
        const angle = elapsedTime * userData.orbitSpeed + index
        light.position.x = userData.originalPosition.x + Math.cos(angle) * userData.orbitRadius
        light.position.z = userData.originalPosition.z + Math.sin(angle) * userData.orbitRadius
        light.position.y = userData.originalPosition.y + Math.sin(angle * 1.5) * 2

        // Gentle intensity pulsing
        light.intensity = 0.6 + Math.sin(elapsedTime * 2 + index) * 0.2
      })

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight
        cameraRef.current.updateProjectionMatrix()
        rendererRef.current.setSize(window.innerWidth, window.innerHeight)
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [mousePosition])

  const generateHearts = useCallback(() => {
    const newHearts = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * window.innerWidth,
      y: window.innerHeight,
    }))
    setHearts((prev) => [...prev, ...newHearts])

    // Add romantic explosion effect to 3D scene
    if (sceneRef.current) {
      const explosionParticles = new THREE.BufferGeometry()
      const particleCount = 30
      const positions = new Float32Array(particleCount * 3)
      const velocities: {
        y: number
        x: number 
        z: number 
}[] = []

      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 4
        positions[i + 1] = (Math.random() - 0.5) * 4
        positions[i + 2] = (Math.random() - 0.5) * 4

        velocities.push({
          x: (Math.random() - 0.5) * 0.15,
          y: (Math.random() - 0.5) * 0.15,
          z: (Math.random() - 0.5) * 0.15,
        })
      }

      explosionParticles.setAttribute("position", new THREE.BufferAttribute(positions, 3))

      const explosionMaterial = new THREE.PointsMaterial({
        color: 0xff69b4,
        size: 0.3,
        transparent: true,
        opacity: 1,
      })

      const explosion = new THREE.Points(explosionParticles, explosionMaterial)
      sceneRef.current.add(explosion)

      // Animate romantic explosion
      let frame = 0
      const animateExplosion = () => {
        frame++
        const positions = explosion.geometry.attributes.position.array as Float32Array

        for (let i = 0; i < positions.length; i += 3) {
          positions[i] += velocities[i / 3].x
          positions[i + 1] += velocities[i / 3].y
          positions[i + 2] += velocities[i / 3].z
        }

        explosion.geometry.attributes.position.needsUpdate = true
        explosionMaterial.opacity -= 0.015

        if (frame < 60 && explosionMaterial.opacity > 0) {
          requestAnimationFrame(animateExplosion)
        } else {
          sceneRef.current?.remove(explosion)
        }
      }
      animateExplosion()
    }

    setTimeout(() => {
      setHearts((prev) => prev.filter((heart) => !newHearts.includes(heart)))
    }, 5000)
  }, [])

  const playMessage = () => {
    const randomMessage = supportMessages[Math.floor(Math.random() * supportMessages.length)]
    const randomTop = Math.floor(Math.random() * 60) + 20
    const randomLeft = Math.floor(Math.random() * 60) + 20

    const popup = document.createElement("div")
    popup.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
        <span>${randomMessage}</span>
        <div class="w-2 h-2 bg-rose-400 rounded-full animate-pulse"></div>
      </div>
    `
    popup.className = `
      fixed z-50 px-8 py-5 rounded-2xl shadow-2xl text-lg font-medium
      transform -translate-x-1/2 -translate-y-1/2
      bg-pink-50/95 backdrop-blur-md
      border border-pink-200 text-pink-800
      transition-all duration-500
    `
    popup.style.top = `${randomTop}%`
    popup.style.left = `${randomLeft}%`
    popup.style.animation = "fadeInScale 0.6s ease-out forwards, fadeOutScale 0.6s ease-in 3.5s forwards"

    document.body.appendChild(popup)

    setTimeout(() => {
      if (document.body.contains(popup)) {
        document.body.removeChild(popup)
      }
    }, 4500)

    generateHearts()
  }

  const moveNoButton = () => {
    const top = Math.floor(Math.random() * 70) + 15 + "%"
    const left = Math.floor(Math.random() * 70) + 15 + "%"
    setNoBtnStyle({ top, left })
  }

  const askLove = () => {
    Swal.fire({
      title: '<span class="text-3xl font-light text-pink-800">Do you love me?</span>',
      html: `
        <div class="relative w-full h-40 flex items-center justify-center">
          <button id="yes-btn" class="px-8 py-3 bg-pink-600 text-white rounded-lg font-medium text-lg shadow-lg hover:bg-pink-700 transition-all duration-300 z-10">
            Yes, absolutely ❤️
          </button>
          <button id="no-btn" class="px-6 py-2 bg-gray-400 text-white rounded-lg font-medium absolute transition-all duration-300 hover:bg-gray-500 shadow-lg" 
                  style="top: ${noBtnStyle.top}; left: ${noBtnStyle.left}; transform: translate(-50%, -50%);">
            No 💔
          </button>
        </div>
      `,
      showConfirmButton: false,
      background: "linear-gradient(135deg, #fef7ff 0%, #fce7f3 100%)",
      customClass: {
        popup: "rounded-2xl border border-pink-200 shadow-2xl",
        title: "text-2xl",
      },
      didOpen: () => {
        const noBtn = document.getElementById("no-btn")
        const yesBtn = document.getElementById("yes-btn")

        if (noBtn) {
          noBtn.addEventListener("mouseenter", moveNoButton)
          noBtn.addEventListener("click", moveNoButton)
        }

        if (yesBtn) {
          yesBtn.addEventListener("click", () => {
            Swal.fire({
              title: '<span class="text-4xl font-light text-pink-800">Perfect! 😊</span>',
              html: '<p class="text-xl text-pink-600 font-light">You make my heart overflow with joy</p>',
              background: "linear-gradient(135deg, #fef7ff 0%, #fce7f3 100%)",
              customClass: {
                popup: "rounded-2xl border border-pink-200 shadow-2xl",
              },
              timer: 3000,
              timerProgressBar: true,
            })
            generateHearts()
          })
        }
      },
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 relative overflow-hidden">
      {/* Three.js Canvas */}
      <div ref={mountRef} className="fixed inset-0 z-0" />

      {/* Floating Hearts */}
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ x: heart.x, y: heart.y, opacity: 1, scale: 0 }}
            animate={{
              y: heart.y - 400,
              opacity: 0,
              scale: [0, 1.5, 0],
              rotate: [0, 180, 360],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 5, ease: "easeOut" }}
            className="absolute pointer-events-none z-10"
          >
            <Heart className="w-8 h-8 text-pink-500 fill-pink-400" />
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="relative z-20 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <motion.div {...animations} className="text-center mb-20">
            <motion.h1
              className="text-6xl md:text-8xl font-light mb-12 text-pink-800 leading-tight tracking-wide"
              animate={{
                opacity: [0.8, 1, 0.8],
              }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
            >
              You're My Favorite Human
            </motion.h1>

            <motion.div
              className="flex justify-center items-center gap-8 mb-12"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            >
              <Heart className="w-6 h-6 text-pink-400 fill-pink-300" />
              <Heart className="w-8 h-8 text-pink-500 fill-pink-400" />
              <Heart className="w-6 h-6 text-pink-400 fill-pink-300" />
            </motion.div>

            <motion.p
              {...animations}
              transition={{ delay: 0.4 }}
              className="text-2xl md:text-3xl text-pink-700 font-light max-w-4xl mx-auto leading-relaxed"
            >
              Where hearts bloom and love flourishes in every line of code.
            </motion.p>
          </motion.div>

          {/* Compliments Grid */}
          <motion.div
            {...animations}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20"
          >
            {compliments.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 0.8 }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 20px 40px -12px rgba(236, 72, 153, 0.2)",
                }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-pink-200 hover:border-pink-300 transition-all duration-500 cursor-pointer group"
                onClick={generateHearts}
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, delay: i * 0.8 }}
                  className="mb-4"
                >
                  <Smile className="text-pink-400 w-8 h-8 mx-auto group-hover:scale-110 transition-transform duration-300" />
                </motion.div>
                <p className="text-lg font-light text-pink-700 leading-relaxed text-center">{line}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Joke Section */}
          <motion.div {...animations} transition={{ delay: 0.8 }} className="text-center mb-16">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-pink-200 max-w-4xl mx-auto">
              <h2 className="text-3xl font-light text-pink-800 mb-8 flex items-center justify-center gap-4">
                <Sparkles className="w-8 h-8 text-pink-400" />A moment of joy
                <Sparkles className="w-8 h-8 text-pink-400" />
              </h2>

              <p className="text-xl font-light text-pink-600 leading-relaxed italic">{joke}</p>
            </div>
          </motion.div>

          {/* Reveal Feelings Button */}
          <motion.div {...animations} transition={{ delay: 1 }} className="text-center mb-16">
            <button
              className="px-12 py-4 bg-pink-600 text-white rounded-lg shadow-lg hover:bg-pink-700 transition-all duration-300 text-lg font-light tracking-wide"
              onClick={() => setShowMore(!showMore)}
            >
              {showMore ? "Conceal feelings" : "Reveal feelings"}
            </button>
          </motion.div>

          {/* Hidden Message */}
          <AnimatePresence>
            {showMore && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-20"
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-pink-200 max-w-5xl mx-auto">
                  <p className="text-3xl text-pink-700 font-light leading-relaxed">
                    You're the elegant solution to my life's algorithm. Without you, nothing compiles.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <motion.div
            {...animations}
            transition={{ delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-6 items-center justify-center mb-16"
          >
            <button
              onClick={playMessage}
              className="px-8 py-4 bg-white text-pink-700 border border-pink-300 font-light rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-lg flex items-center gap-4 group"
            >
              <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Send encouragement</span>
            </button>

            <button
              onClick={askLove}
              className="px-8 py-4 bg-pink-600 text-white font-light rounded-lg shadow-lg hover:bg-pink-700 transition-all duration-300 text-lg flex items-center gap-4 group"
            >
              <Heart className="w-5 h-5 group-hover:scale-110 transition-transform fill-current" />
              <span>Ask the question</span>
            </button>
          </motion.div>

          {/* Floating Animation */}
          <motion.div {...animations} transition={{ delay: 1.4 }} className="flex justify-center">
            <motion.div
              animate={{
                y: [0, -20, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 6,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <div className="w-12 h-12 border border-pink-300 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-pink-400 fill-pink-300" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        
        @keyframes fadeOutScale {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
        }
      `}</style>
    </div>
  )
}
