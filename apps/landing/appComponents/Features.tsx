import React from "react";
import FeatureCard from "./feature-card";
import secure from "./icons/Secure.gif";
import playback from "./icons/Playback.png";
import collaborative from "./icons/Collaborative_Coding.png";
import interviews from "./icons/Multiple_Interviews.gif";

const features = [
  {
    title: "Collaborative Coding",
    description: "Code together with candidates in a shared, live environment.",
    image: collaborative,
  },
  {
    title: "Multiple Interviews at Once",
    description:
      "Conduct simultaneous interviews seamlessly for maximum efficiency.",
    image: interviews,
  },
  {
    title: "Code Playback for Review",
    description:
      "Replay and analyze coding sessions to assess candidate performance.",
    image: playback,
  },
  {
    title: "Secure and Scalable",
    description:
      "Ensure secure interviews with a platform that grows with your needs.",
    image: secure,
  },
];

const Feature = () => {
  return (
    <section>
      <div className="md:mt-20 mt-10 max-w-[1000px] mx-auto ">
        <div className="flex justify-center">
          <div className="text-sm inline-flex border border-[#222]/10 features-pad rounded-lg tracking-tight shadow-inner">
            Features
          </div>
        </div>
        <div className="keyFeatures tracking-tighter bg-gradient-to-b from-black to-black/70 text-transparent bg-clip-text text-center mt-5">
          Key features
        </div>
        <div className="Explore tracking-tighter text-black/70 text-center ">
          Explore the Core Features of Our Project!
        </div>
      </div>
      <div className="featurecardContainer my-10 max-w-[1200px] mx-auto">
        <div className="px-4">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              image={feature.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Feature;
