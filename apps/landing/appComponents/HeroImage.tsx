import Image from "next/image";
import heroimage from "./icons/HeroImage.png";

const HeroImage = () => {
  return (
    <section className="px-4 heroImageContainerSection">
      <div className="p-3 heroImageContainer">
        <Image
          src={heroimage}
          width={1400}
          height={800}
          alt="hero-image"
          className="drop-shadow-xl border rounded-lg"
        />
      </div>
    </section>
  );
};

export default HeroImage;
