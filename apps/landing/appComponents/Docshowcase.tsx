import { Button } from "@/components/ui/button";
import Image from "next/image";

const Docshowcase = () => {
  return (
    <div className="doc-container">
      <div className="doc-btn-container">
        <div className="doc-btn">CollabIq</div>
      </div>
      <div className="doc-content">
        <div className="doc-left-content">
          <h1 className="doc-title">Ready for developers</h1>
          <p className="doc-subtitle">
            Conduct efficient, real-time coding interviews at scale,
            streamlining the hiring process with our collaborative platform.
          </p>
          <a
            className="doc-btn-1"
            href="https://github.com/maddy020/Intervue_2.0"
          >
            Read Docs
            <span className="material-symbols-outlined">arrow_right_alt</span>
          </a>
        </div>
        <div className="doc-right-content">
          <Image
            src="https://res.cloudinary.com/dtc9ysbnn/image/upload/v1723236913/api_uab9ko.png"
            alt="api image"
            width={650}
            height={300}
            className="overflow-hidden items-end "
          />
        </div>
      </div>
    </div>
  );
};

export default Docshowcase;
