import productDemo from "../videos/ProductDemo.mp4";

export default function Page() {
  return (
    <div className="flex justify-center video px-4">
      <video
        style={{
          borderRadius: "16px",
          border: "10px solid #E5E7EB",
        }}
        width={1330}
        autoPlay
        muted
        loop
      >
        <source src={productDemo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
