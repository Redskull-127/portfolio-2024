"use client";
import Spline from "@splinetool/react-spline";

export default function Avatar3D() {
  return (
    <div className="absolute size-[400px] object-fill overflow-hidden">
      <Spline
        style={{
          position: "absolute",
          animation: "fade-in 1s ease-in-out",
        }}
        scene="https://prod.spline.design/47G-sHHwpZlB68OX/scene.splinecode"
      />
    </div>
  );
}
