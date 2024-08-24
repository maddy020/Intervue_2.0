import { Button } from "@/components/ui/button";
import Image, { StaticImageData } from "next/image";

interface FeatureProps {
  title: string;
  description: string;
  image: StaticImageData;
}

const FeatureCard = ({ title, description, image }: FeatureProps) => {
  return (
    <div>
      <div className="featureCardShadow border rounded-lg shadow-inner hover:shadow-2xl transition-all">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="FeatureCardImage">
            <Image
              src={image.src}
              alt="Feature Image"
              className="w-full h-[200px] object-cover"
              width={400}
              height={200}
            />
          </div>
        </div>
        <div className="w-full p-4">
          <div className="py-4">
            <h1 className="titleMain tracking-tighter bg-gradient-to-b from-black to-black/70 text-transparent bg-clip-text ">
              {title}
            </h1>
          </div>
          <div className="w-full py-4">
            <p className="descriptionMain tracking-tighter text-black/70">
              {description}
            </p>
          </div>
          <div className="w-full py-2">
            <Button className="w-full text-lg learnButton">Learn More</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;
