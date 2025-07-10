"use client"
import { AddComponentProps } from "../../types/types"
import { motion } from "framer-motion"


const AddComponent = ({ icon, whatTheButtonDoes, purpose }: AddComponentProps) => {


  return (
    <div
      className="flex items-center space-x-4"
    >
      <motion.button
        whileHover={{ scale: 1.1, cursor: "pointer", filter: "brightness(90%)" }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.3, damping: 10, stiffness: 100, type: "spring" }}
        onClick={whatTheButtonDoes}
        className="bg-black text-white rounded-full centered-flex w-12 h-12"
      >
        <span>{icon}</span>
      </motion.button>
      <p>{purpose}</p>
    </div>
  )
}

export default AddComponent