import { ImageResponse } from "next/og";
import OG_IMG from "@/public/static/opengraph/image.png";
import Image from "next/image";
export const runtime = "edge";

export const alt = "Meer Tarbani";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        // style={{
        //   fontSize: 128,
        //   background: 'white dark:black',
        //   width: '100%',
        //   height: '100%',
        //   display: 'flex',
        //   alignItems: 'center',
        //   justifyContent: 'center',
        // }}
        className="flex items-center justify-center w-full h-full bg-white dark:bg-black"
      >
        <Image
          src={OG_IMG.src}
          alt={alt}
          width={size.width}
          height={size.height}
        />
      </div>
    )
  );
}
