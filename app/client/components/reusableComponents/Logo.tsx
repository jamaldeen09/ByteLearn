"use client"
import React from "react"
import Image from 'next/image'

const Logo = (): React.ReactElement => {
  return (
    <Image
      src="https://thumbs.dreamstime.com/b/black-school-icon-shadow-logo-design-white-157312165.jpg"
      alt="ByteLearn Logo"
      className="w-14 h-14 sm:w-20 sm:h-20"
      width={80}  // Matches the largest size (sm:w-20)
      height={80} // Matches the largest size (sm:h-20)
      priority={true} // Optional: marks this image as high priority for preloading
      unoptimized={true}
    />
  )
}

export default Logo