import Image from 'next/image'
import { motion } from 'framer-motion'
import React from 'react'

const testimonials = [
  {
    text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque ut fuga magni!',
    imageSrc: "https://res.cloudinary.com/dtc9ysbnn/image/upload/v1723236914/avatar-1_xxgkqm.png",
    name: 'Alex Rose',
    username: '@alexrose06',
  },
  {
    text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque ut fuga magni!',
    imageSrc: "https://res.cloudinary.com/dtc9ysbnn/image/upload/v1723236914/avatar-2_jddbqk.png",
    name: 'Alex Rose',
    username: '@alexrose06',
  },
  {
    text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque ut fuga magni!',
    imageSrc: "https://res.cloudinary.com/dtc9ysbnn/image/upload/v1723236915/avatar-3_xdijdf.png",
    name: 'Alex Rose',
    username: '@alexrose06',
  },
  {
    text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque ut fuga magni!',
    imageSrc: "https://res.cloudinary.com/dtc9ysbnn/image/upload/v1723236915/avatar-4_ppdr5c.png",
    name: 'Alex Rose',
    username: '@alexrose06',
  },
  {
    text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque ut fuga magni!',
    imageSrc: "https://res.cloudinary.com/dtc9ysbnn/image/upload/v1723236915/avatar-5_uzpthr.png",
    name: 'Alex Rose',
    username: '@alexrose06',
  },
  {
    text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque ut fuga magni!',
    imageSrc: "https://res.cloudinary.com/dtc9ysbnn/image/upload/v1723236916/avatar-6_tkivlz.png",
    name: 'Alex Rose',
    username: '@alexrose06',
  },
]

const firstColumn = testimonials.slice(0, 3)
const secondColumn = testimonials.slice(3, 6)
const thirdColumn = testimonials.slice(0, 3)

const TestimonialsColumn = (props: {
  className?: string
  testimonials: typeof testimonials
  duration?: number
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: '-50% ',
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: 'linear',
          repeatType: 'loop',
        }}
        className="main-container"
      >
        {[...new Array(2)].fill(0).map((_, index) => (
          <React.Fragment key={index}>
            {props.testimonials.map(({ text, imageSrc, name, username },i) => (
              <div className="card" key={i}>
                <div>{text}</div>
                <div className="flex items-center mt-5 gap-4">
                  <Image
                    src={imageSrc}
                    alt={name}
                    width={50}
                    height={50}
                    className="rounded-3xl"
                  />
                  <div className="flex flex-col">
                    <div className="font-medium tracking-tight leading-5">
                      {name}
                    </div>
                    <div className="leading-5 tracking-tight">{username}</div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  )
}

const Testimonials = () => {
  return (
    <section className="bg-white">
      <div className="flex flex-col px-10">
        <div className="max-w-[540px] mx-auto">
          <div className="flex justify-center">
            <div className="text-sm inline-flex border border-[#222]/10 px-3 py-1 rounded-lg tracking-tight shadow-inner">
              Testimonials
            </div>
          </div>
          <h2 className="CtaTitle">
            What our users say
          </h2>
          <p className="text-lg tracking-tighter text-black/70 text-center mt-5">
          Hear from Our Satisfied Users About Their Interview Experience.
          </p>
        </div>
        <div className="testimonial-container">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="test-col"
            duration={19}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="test-col"
            duration={17}
          />
        </div>
      </div>
    </section>
  )
}

export default Testimonials
