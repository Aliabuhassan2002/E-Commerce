import React from 'react'

import '../Navbar/Navbar.css'

const About = () => {
  return (
   <>
      <section className="flex flex-col md:flex-row justify-between items-center gap-8 px-4 py-12 max-w-7xl mx-auto mt-20">
        <div className="w-full md:w-1/2">
          <img 
            src="src/assets/rug3/josh-hemsley-wPYvAFGrL4A-unsplash.jpg" 
            alt="Our Story" 
            className="w-full max-w-[600px] h-auto aspect-square object-cover mx-auto"
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col items-center gap-8 px-4">
          <h2 className="text-3xl font-bold text-center">
            Our Story
          </h2>
          <p className="max-w-[600px] text-center text-gray-700 leading-relaxed">
            Our journey began with a simple idea: to bring the world's finest rugs to your doorstep. Rugs are more
            than just floor coverings—they are the heart of a home, a blend of art and functionality, and a reflection of your
            unique style. That's why we've dedicated ourselves to curating a collection that celebrates tradition, craftsmanship, and
            innovation. From the intricate handwoven patterns of timeless classics to modern designs that suit contemporary
            tastes, each rug in our collection is selected with care and attention to detail. We work directly with skilled artisans and
            trusted manufacturers to ensure the highest quality, ethical practices, and fair trade principles.
          </p>
        </div>
      </section>

      <section className="flex flex-col md:flex-row-reverse justify-between items-center gap-8 px-4 py-12 max-w-7xl mx-auto">
        <div className="w-full md:w-1/2">
          <img 
            src="src/assets/partners.png" 
            alt="Our Partners" 
            className="w-full max-w-[600px] h-auto aspect-square object-cover mx-auto"
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col items-center gap-8 px-4">
          <h2 className="text-3xl font-bold text-center">
            Our Partners
          </h2>
          <p className="max-w-[600px] text-center text-gray-700 leading-relaxed">
            Our journey began with a simple idea: to bring the world's finest rugs to your doorstep. Rugs are more
            than just floor coverings—they are the heart of a home, a blend of art and functionality, and a reflection of your
            unique style. That's why we've dedicated ourselves to curating a collection that celebrates tradition, craftsmanship, and
            innovation. From the intricate handwoven patterns of timeless classics to modern designs that suit contemporary
            tastes, each rug in our collection is selected with care and attention to detail. We work directly with skilled artisans and
            trusted manufacturers to ensure the highest quality, ethical practices, and fair trade principles.
          </p>
        </div>
      </section>
    </>
  )
}

export default About;