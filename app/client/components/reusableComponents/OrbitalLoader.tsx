import { motion } from "framer-motion";


const BlackOrbitalLoader = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <motion.div
        className="relative w-24 h-24"
        animate={{ rotate: 360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {/* Outer Ring */}
        <motion.div
          className="absolute inset-0 border-2 border-black rounded-full opacity-70"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {/* Middle Ring */}
        <motion.div
          className="absolute inset-3 border-2 border-black rounded-full opacity-60"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.6, 0.9, 0.6],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.2,
          }}
        />
        {/* Inner Dot */}
        <motion.div
          className="absolute inset-6 bg-black rounded-full"
          animate={{
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.4,
          }}
        />
      </motion.div>
    </div>
  );
};

export default BlackOrbitalLoader