
import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Smile, Sparkles, MessageCircle } from "lucide-react"
import Swal from "sweetalert2"
import * as THREE from "three"
import React from "react"

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
  transition: { duration: 0.8, ease: [0.42, 0, 1, 1] },
}

export default function LoveComedyPage() {
  const [joke, setJoke] = useState("Why did the programmer fall in love? Because he found the one with no bugs!")
  const [showMore, setShowMore] = useState(false)
  const [noBtnStyle, setNoBtnStyle] = useState({ top: "50%", left: "60%" })
  const [hearts, setHearts] = useState<Array<{ id: number; x: number; y: number }>>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const particlesRef = useRef<THREE.Points[]>([])
  const shapesRef = useRef<THREE.Mesh[]>([])
  const lightsRef = useRef<THREE.Light[]>([])
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

    // Create multiple particle systems
    const createParticleSystem = (count: number, color: number, size: number, spread: number) => {
      const particles = new THREE.BufferGeometry()
      const positions = new Float32Array(count * 3)
      const velocities = new Float32Array(count * 3)
      const colors = new Float32Array(count * 3)
      const sizes = new Float32Array(count)

      for (let i = 0; i < count * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * spread
        positions[i + 1] = (Math.random() - 0.5) * spread
        positions[i + 2] = (Math.random() - 0.5) * spread

        velocities[i] = (Math.random() - 0.5) * 0.02
        velocities[i + 1] = (Math.random() - 0.5) * 0.02
        velocities[i + 2] = (Math.random() - 0.5) * 0.02

        const particleColor = new THREE.Color(color)
        particleColor.setHSL(
          particleColor.getHSL({ h: 0, s: 0, l: 0 }).h + (Math.random() - 0.5) * 0.1,
          0.7,
          0.5 + Math.random() * 0.3,
        )
        colors[i] = particleColor.r
        colors[i + 1] = particleColor.g
        colors[i + 2] = particleColor.b

        sizes[i / 3] = size + Math.random() * size
      }

      particles.setAttribute("position", new THREE.BufferAttribute(positions, 3))
      particles.setAttribute("color", new THREE.BufferAttribute(colors, 3))
      particles.setAttribute("size", new THREE.BufferAttribute(sizes, 1))
      particles.userData = { velocities }

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

    // Create multiple particle systems
    const particleSystems = [
      createParticleSystem(300, 0xff6b9d, 0.1, 60),
      createParticleSystem(200, 0x9d4edd, 0.15, 40),
      createParticleSystem(150, 0xf72585, 0.08, 80),
    ]
    particlesRef.current = particleSystems

    // Create animated geometric shapes with more complex behaviors
    const geometries = [
      new THREE.OctahedronGeometry(0.5),
      new THREE.TetrahedronGeometry(0.6),
      new THREE.IcosahedronGeometry(0.4),
      new THREE.DodecahedronGeometry(0.5),
      new THREE.TorusGeometry(0.4, 0.2, 8, 16),
      new THREE.ConeGeometry(0.3, 0.8, 8),
    ]

    const materials = [
      new THREE.MeshPhongMaterial({
        color: 0xff6b9d,
        transparent: true,
        opacity: 0.7,
        shininess: 100,
        emissive: 0x221122,
      }),
      new THREE.MeshPhongMaterial({
        color: 0x9d4edd,
        transparent: true,
        opacity: 0.6,
        shininess: 100,
        emissive: 0x112211,
      }),
      new THREE.MeshPhongMaterial({
        color: 0xf72585,
        transparent: true,
        opacity: 0.8,
        shininess: 100,
        emissive: 0x111122,
      }),
    ]

    const shapes: THREE.Mesh[] = []
    for (let i = 0; i < 25; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)]
      const material = materials[Math.floor(Math.random() * materials.length)].clone()
      const shape = new THREE.Mesh(geometry, material)

      shape.position.set((Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30)

      shape.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)

      // Add custom animation properties
      shape.userData = {
        originalPosition: shape.position.clone(),
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02,
          z: (Math.random() - 0.5) * 0.02,
        },
        floatSpeed: Math.random() * 0.02 + 0.01,
        floatRange: Math.random() * 3 + 1,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        orbitRadius: Math.random() * 5 + 2,
        orbitSpeed: (Math.random() - 0.5) * 0.01,
      }

      shape.castShadow = true
      shape.receiveShadow = true

      shapes.push(shape)
      scene.add(shape)
    }
    shapesRef.current = shapes

    // Advanced lighting setup with animations
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(10, 10, 5)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    scene.add(directionalLight)

    // Animated point lights
    const pointLights: THREE.Light[] = []
    for (let i = 0; i < 5; i++) {
      const pointLight = new THREE.PointLight([0xff6b9d, 0x9d4edd, 0xf72585, 0x4cc9f0, 0x7209b7][i], 1, 50)
      pointLight.position.set((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20)
      pointLight.userData = {
        originalPosition: pointLight.position.clone(),
        orbitSpeed: (Math.random() - 0.5) * 0.02,
        orbitRadius: Math.random() * 10 + 5,
      }
      pointLights.push(pointLight)
      scene.add(pointLight)
    }
    lightsRef.current = pointLights

    camera.position.z = 20

    // Advanced animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      const elapsedTime = clockRef.current.getElapsedTime()

      // Camera animation based on mouse position
      if (cameraRef.current) {
        cameraRef.current.position.x += (mousePosition.x * 5 - cameraRef.current.position.x) * 0.05
        cameraRef.current.position.y += (mousePosition.y * 5 - cameraRef.current.position.y) * 0.05
        cameraRef.current.lookAt(0, 0, 0)
      }

      // Animate shapes with complex behaviors
      shapes.forEach((shape, index) => {
        const userData = shape.userData

        // Rotation animation
        shape.rotation.x += userData.rotationSpeed.x
        shape.rotation.y += userData.rotationSpeed.y
        shape.rotation.z += userData.rotationSpeed.z

        // Floating animation
        shape.position.y =
          userData.originalPosition.y + Math.sin(elapsedTime * userData.floatSpeed + index) * userData.floatRange

        // Orbital motion
        const orbitAngle = elapsedTime * userData.orbitSpeed + index
        shape.position.x = userData.originalPosition.x + Math.cos(orbitAngle) * userData.orbitRadius * 0.3
        shape.position.z = userData.originalPosition.z + Math.sin(orbitAngle) * userData.orbitRadius * 0.3

        // Pulsing scale
        const pulseScale = 1 + Math.sin(elapsedTime * userData.pulseSpeed + index) * 0.2
        shape.scale.setScalar(pulseScale)

        // Color animation
        if (shape.material instanceof THREE.MeshPhongMaterial) {
          const hue = (elapsedTime * 0.1 + index * 0.1) % 1
          shape.material.emissive.setHSL(hue, 0.5, 0.1)
        }

        // Mouse interaction
        const distance = shape.position.distanceTo(new THREE.Vector3(mousePosition.x * 10, mousePosition.y * 10, 0))
        if (distance < 5) {
          shape.scale.multiplyScalar(1.2)
          if (shape.material instanceof THREE.MeshPhongMaterial) {
            shape.material.opacity = Math.min(1, shape.material.opacity + 0.1)
          }
        }
      })

      // Animate particle systems
      particleSystems.forEach((particleSystem, systemIndex) => {
        particleSystem.rotation.y += 0.001 * (systemIndex + 1)
        particleSystem.rotation.x += 0.0005 * (systemIndex + 1)

        const positions = particleSystem.geometry.attributes.position.array as Float32Array
        const velocities = particleSystem.geometry.userData.velocities as Float32Array

        for (let i = 0; i < positions.length; i += 3) {
          // Apply velocities
          positions[i] += velocities[i]
          positions[i + 1] += velocities[i + 1]
          positions[i + 2] += velocities[i + 2]

          // Wave motion
          positions[i + 1] += Math.sin(elapsedTime * 2 + positions[i] * 0.1) * 0.01

          // Boundary wrapping
          const boundary = 30
          if (Math.abs(positions[i]) > boundary) velocities[i] *= -1
          if (Math.abs(positions[i + 1]) > boundary) velocities[i + 1] *= -1
          if (Math.abs(positions[i + 2]) > boundary) velocities[i + 2] *= -1

          // Mouse attraction
          const mouseInfluence = 0.001
          const dx = mousePosition.x * 10 - positions[i]
          const dy = mousePosition.y * 10 - positions[i + 1]
          velocities[i] += dx * mouseInfluence
          velocities[i + 1] += dy * mouseInfluence
        }

        particleSystem.geometry.attributes.position.needsUpdate = true
      })

      // Animate lights
      pointLights.forEach((light, index) => {
        const userData = light.userData
        const angle = elapsedTime * userData.orbitSpeed + index
        light.position.x = userData.originalPosition.x + Math.cos(angle) * userData.orbitRadius
        light.position.z = userData.originalPosition.z + Math.sin(angle) * userData.orbitRadius
        light.position.y = userData.originalPosition.y + Math.sin(angle * 2) * 3

        // Intensity pulsing
        light.intensity = 0.5 + Math.sin(elapsedTime * 3 + index) * 0.5
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
    const newHearts = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * window.innerWidth,
      y: window.innerHeight,
    }))
    setHearts((prev) => [...prev, ...newHearts])

    // Add explosion effect to 3D scene
    if (sceneRef.current) {
      const explosionParticles = new THREE.BufferGeometry()
      const particleCount = 50
      const positions = new Float32Array(particleCount * 3)
      const velocities: { x: number; y: number; z: number }[] = []

      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 2
        positions[i + 1] = (Math.random() - 0.5) * 2
        positions[i + 2] = (Math.random() - 0.5) * 2

        velocities.push({
          x: (Math.random() - 0.5) * 0.2,
          y: (Math.random() - 0.5) * 0.2,
          z: (Math.random() - 0.5) * 0.2,
        })
      }

      explosionParticles.setAttribute("position", new THREE.BufferAttribute(positions, 3))

      const explosionMaterial = new THREE.PointsMaterial({
        color: 0xff6b9d,
        size: 0.2,
        transparent: true,
        opacity: 1,
      })

      const explosion = new THREE.Points(explosionParticles, explosionMaterial)
      sceneRef.current.add(explosion)

      // Animate explosion
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
        explosionMaterial.opacity -= 0.02

        if (frame < 50 && explosionMaterial.opacity > 0) {
          requestAnimationFrame(animateExplosion)
        } else {
          sceneRef.current?.remove(explosion)
        }
      }
      animateExplosion()
    }

    setTimeout(() => {
      setHearts((prev) => prev.filter((heart) => !newHearts.includes(heart)))
    }, 4000)
  }, [])

  const playMessage = () => {
    const randomMessage = supportMessages[Math.floor(Math.random() * supportMessages.length)]
    const randomTop = Math.floor(Math.random() * 60) + 20
    const randomLeft = Math.floor(Math.random() * 60) + 20

    const popup = document.createElement("div")
    popup.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="w-2 h-2 bg-rose-400 rounded-full animate-pulse"></div>
        <span>${randomMessage}</span>
        <div class="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
      </div>
    `
    popup.className = `
      fixed z-50 px-8 py-5 rounded-2xl shadow-2xl text-lg font-medium
      transform -translate-x-1/2 -translate-y-1/2
      bg-white/90 backdrop-blur-md
      border border-gray-200 text-gray-800
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
      title: '<span class="text-3xl font-light text-gray-800">Do you love me?</span>',
      html: `
        <div class="relative w-full h-40 flex items-center justify-center">
          <button id="yes-btn" class="px-8 py-3 bg-gray-800 text-white rounded-lg font-medium text-lg shadow-lg hover:bg-gray-700 transition-all duration-300 z-10">
            Yes, absolutely ❤️
          </button>
          <button id="no-btn" class="px-6 py-2 bg-gray-400 text-white rounded-lg font-medium absolute transition-all duration-300 hover:bg-gray-500 shadow-lg" 
                  style="top: ${noBtnStyle.top}; left: ${noBtnStyle.left}; transform: translate(-50%, -50%);">
            No 💔
          </button>
        </div>
      `,
      showConfirmButton: false,
      background: "#ffffff",
      customClass: {
        popup: "rounded-2xl border border-gray-200 shadow-2xl",
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
              title: '<span class="text-4xl font-light text-gray-800">Perfect! 😊</span>',
              html: '<p class="text-xl text-gray-600 font-light">You make my heart overflow with joy</p>',
              background: "#ffffff",
              customClass: {
                popup: "rounded-2xl border border-gray-200 shadow-2xl",
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
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
              scale: [0, 1.2, 0],
              rotate: [0, 180, 360],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 4, ease: "easeOut" }}
            className="absolute pointer-events-none z-10"
          >
            <Heart className="w-6 h-6 text-rose-400 fill-rose-300" />
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="relative z-20 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <motion.div {...animations} className="text-center mb-20">
            <motion.h1
              className="text-6xl md:text-8xl font-light mb-12 text-gray-800 leading-tight tracking-wide"
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
              <div className="w-3 h-3 bg-rose-400 rounded-full opacity-60" />
              <div className="w-4 h-4 bg-rose-500 rounded-full opacity-80" />
              <div className="w-3 h-3 bg-rose-400 rounded-full opacity-60" />
            </motion.div>

            <motion.p
              {...animations}
              transition={{ delay: 0.4 }}
              className="text-2xl md:text-3xl text-gray-600 font-light max-w-4xl mx-auto leading-relaxed"
            >
              Elegant code, timeless love, sophisticated humor.
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
                  boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.1)",
                }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200 hover:border-gray-300 transition-all duration-500 cursor-pointer group"
                onClick={generateHearts}
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, delay: i * 0.8 }}
                  className="mb-4"
                >
                  <Smile className="text-amber-500 w-8 h-8 mx-auto group-hover:scale-110 transition-transform duration-300" />
                </motion.div>
                <p className="text-lg font-light text-gray-700 leading-relaxed text-center">{line}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Joke Section */}
          <motion.div {...animations} transition={{ delay: 0.8 }} className="text-center mb-16">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-gray-200 max-w-4xl mx-auto">
              <h2 className="text-3xl font-light text-gray-800 mb-8 flex items-center justify-center gap-4">
                <Sparkles className="w-8 h-8 text-gray-400" />A moment of levity
                <Sparkles className="w-8 h-8 text-gray-400" />
              </h2>

              <p className="text-xl font-light text-gray-600 leading-relaxed italic">{joke}</p>
            </div>
          </motion.div>

          {/* Reveal Feelings Button */}
          <motion.div {...animations} transition={{ delay: 1 }} className="text-center mb-16">
            <button
              className="px-12 py-4 bg-gray-800 text-white rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-300 text-lg font-light tracking-wide"
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
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-gray-200 max-w-5xl mx-auto">
                  <p className="text-3xl text-gray-700 font-light leading-relaxed">
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
              className="px-8 py-4 bg-white text-gray-800 border border-gray-300 font-light rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-lg flex items-center gap-4 group"
            >
              <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Send encouragement</span>
            </button>

            <button
              onClick={askLove}
              className="px-8 py-4 bg-gray-800 text-white font-light rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-300 text-lg flex items-center gap-4 group"
            >
              <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
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
              <div className="w-12 h-12 border border-gray-300 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-gray-400" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style >{`
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
