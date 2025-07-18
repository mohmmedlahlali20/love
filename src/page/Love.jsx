
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Smile, Sparkles, Music, Volume2, VolumeX, Play } from "lucide-react"
import Swal from "sweetalert2"
import sound1 from '../assets/audios/sound1.mp3'

const compliments = [
  "You're my favorite notification.",
  "You make my heart write infinite loops.",
  "You're the semicolon to my code — it all makes sense with you.",
  "You're the Git to my commit. 💖",
]

const jokes = [
  "Why did the programmer fall in love? Because he found the one with no bugs!",
  "You're like a perfect algorithm - efficient, elegant, and impossible to improve!",
  "Are you a compiler? Because you make my heart run without errors!",
  "You must be a recursive function, because I can't stop thinking about you!",
]


const supportMessages = [
  "Everything gonna be okay ✨",
  "You're amazing just the way you are! 💖",
  "You’re not alone — I’m here. ❤️",
  "Breathe. You’ve got this. 🌈",
  "You are loved, deeply and truly. 💫",
];

const animations = {
  initial: { opacity: 0, y: -30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
}

export default function LoveComedyPage() {
  const [currentJoke, setCurrentJoke] = useState(0)
  const [showMore, setShowMore] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hearts, setHearts] = useState([])
  const bgAudioRef = useRef(null)

  useEffect(() => {
    const audio = new Audio(sound1)
    audio.loop = true
    audio.volume = 0.3
    bgAudioRef.current = audio

    return () => {
      if (bgAudioRef.current) {
        bgAudioRef.current.pause()
      }
    }
  }, [])

  const toggleMusic = async () => {
    if (bgAudioRef.current) {
      if (isPlaying) {
        bgAudioRef.current.pause()
        setIsPlaying(false)
      } else {
        try {
          await bgAudioRef.current.play()
          setIsPlaying(true)
        } catch (error) {
          console.log("Audio play failed:", error)
        }
      }
    }
  }

 const playMessage = () => {
    const randomMessage = supportMessages[Math.floor(Math.random() * supportMessages.length)];

    const randomTop = Math.floor(Math.random() * 80) + 10; // 10% to 90%
    const randomLeft = Math.floor(Math.random() * 80) + 10; // 10% to 90%

    const popup = document.createElement("div");
    popup.innerText = randomMessage;
    popup.className =
      "fixed z-50 px-4 py-3 bg-white rounded-xl shadow-lg text-rose-600 font-semibold text-lg animate-fade-in";
    popup.style.top = `${randomTop}%`;
    popup.style.left = `${randomLeft}%`;
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.background = "linear-gradient(135deg, #fce7f3 0%, #f3e8ff 100%)";
    popup.style.border = "1px solid #fbcfe8";
    popup.style.color = "#be185d";
    popup.style.transition = "opacity 0.5s ease";

    document.body.appendChild(popup);

    setTimeout(() => {
      popup.style.opacity = 0;
      setTimeout(() => document.body.removeChild(popup), 1000);
    }, 4000);

    const audio = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3");
    audio.volume = 0.5;
    audio.play();
  };



  const generateHearts = () => {
    const newHearts = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * window.innerWidth,
      y: window.innerHeight,
    }))
    setHearts((prev) => [...prev, ...newHearts])

    setTimeout(() => {
      setHearts((prev) => prev.filter((heart) => !newHearts.includes(heart)))
    }, 3000)
  }

  const nextJoke = () => {
    setCurrentJoke((prev) => (prev + 1) % jokes.length)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-rose-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-pink-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-rose-200 rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute bottom-40 right-10 w-12 h-12 bg-pink-300 rounded-full opacity-20 animate-bounce"></div>
      </div>

      {/* Floating Hearts */}
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ x: heart.x, y: heart.y, opacity: 1, scale: 0 }}
            animate={{
              y: heart.y - 200,
              opacity: 0,
              scale: [0, 1, 0],
              rotate: [0, 180, 360],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3, ease: "easeOut" }}
            className="absolute pointer-events-none z-10"
          >
            <Heart className="w-6 h-6 text-pink-500 fill-pink-400" />
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="relative z-20 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <motion.div {...animations} className="text-center mb-16">
            <motion.h1
              className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-pink-600 via-purple-600 to-rose-600 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            >
              You're My Favorite Human
            </motion.h1>

            <motion.div
              className="flex justify-center items-center gap-4 mb-8"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <Heart className="w-8 h-8 text-red-500 fill-red-400" />
              <Heart className="w-12 h-12 text-pink-500 fill-pink-400" />
              <Heart className="w-8 h-8 text-red-500 fill-red-400" />
            </motion.div>

            <motion.p
              {...animations}
              transition={{ delay: 0.3 }}
              className="text-2xl md:text-3xl text-gray-700 font-medium max-w-3xl mx-auto leading-relaxed"
            >
              A little bit of love, a little bit of code, and a whole lot of laughs.
            </motion.p>
          </motion.div>

          {/* Music Control */}
          <motion.div {...animations} transition={{ delay: 0.4 }} className="flex justify-center mb-12">
            <button
              onClick={toggleMusic}
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              {isPlaying ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              <span className="font-semibold">{isPlaying ? "Pause Music" : "Play Background Music"}</span>
              <Music className="w-5 h-5" />
            </button>
          </motion.div>

          {/* Compliments Grid */}
          <motion.div
            {...animations}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
          >
            {compliments.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-pink-100 hover:border-pink-200 transition-all duration-300 cursor-pointer group"
                onClick={generateHearts}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: i * 0.5 }}
                >
                  <Smile className="text-yellow-500 w-8 h-8 mb-4 mx-auto group-hover:scale-110 transition-transform" />
                </motion.div>
                <p className="text-lg font-medium text-gray-800 leading-relaxed">{line}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Joke Section */}
          <motion.div {...animations} transition={{ delay: 0.6 }} className="text-center mb-12">
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-3xl p-8 shadow-xl border border-pink-200 max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-rose-600 mb-6 flex items-center justify-center gap-3">
                <Sparkles className="w-8 h-8" />
                Wanna laugh?
                <Sparkles className="w-8 h-8" />
              </h2>

              <AnimatePresence mode="wait">
                <motion.p
                  key={currentJoke}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-xl italic text-gray-700 mb-6 leading-relaxed"
                >
                  {jokes[currentJoke]}
                </motion.p>
              </AnimatePresence>

              <button
                onClick={nextJoke}
                className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold"
              >
                Tell me another! 😄
              </button>
            </div>
          </motion.div>

          {/* Reveal Feelings Button */}
          <motion.div {...animations} transition={{ delay: 0.7 }} className="text-center mb-12">
            <button
              className="px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg font-semibold"
              onClick={() => setShowMore(!showMore)}
            >
              {showMore ? "Hide My Feelings 💌" : "Reveal My Feelings 💌"}
            </button>
          </motion.div>

          {/* Hidden Message */}
          <AnimatePresence>
            {showMore && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="text-center mb-12"
              >
                <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-3xl p-8 shadow-2xl border-2 border-pink-200 max-w-4xl mx-auto">
                  <motion.p
                    className="text-3xl text-rose-700 font-bold leading-relaxed"
                    animate={{
                      textShadow: [
                        "0 0 0px rgba(236, 72, 153, 0)",
                        "0 0 20px rgba(236, 72, 153, 0.5)",
                        "0 0 0px rgba(236, 72, 153, 0)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    You're the punchline to my life's code. Without you, it throws an error. 😘
                  </motion.p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Comfort Message Button */}
          <motion.div {...animations} transition={{ delay: 0.8 }} className="text-center">
            <button
              onClick={playMessage}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg flex items-center gap-3 mx-auto"
            >
              <Play className="w-6 h-6" />
              Play Comfort Message
              <Sparkles className="w-6 h-6" />
            </button>
          </motion.div>

          {/* Floating Animation */}
          <motion.div {...animations} transition={{ delay: 1 }} className="flex justify-center mt-16">
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <Sparkles className="w-16 h-16 text-pink-500" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
