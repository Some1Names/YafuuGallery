"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";

// next/image with the silver loading shimmer (.shimmer, globals.css) behind
// it until the picture has loaded — then the shimmer is removed, so nothing
// keeps animating behind finished images. For `fill` images: the shimmer
// fills the same positioned parent the image does.
export default function ShimmerImage({ alt, onLoad, onError, ...props }: ImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // A new picture in the same spot (an edit preview, a changed avatar)
  // loads again — show the shimmer again until it has.
  const [shownSrc, setShownSrc] = useState(props.src);
  if (props.src !== shownSrc) {
    setShownSrc(props.src);
    setIsLoaded(false);
  }

  return (
    <>
      {!isLoaded && <span aria-hidden="true" className="shimmer absolute inset-0" />}
      <Image
        alt={alt}
        {...props}
        onLoad={(e) => {
          setIsLoaded(true);
          onLoad?.(e);
        }}
        // a broken image stops "loading" too (the alt/placeholder shows)
        onError={(e) => {
          setIsLoaded(true);
          onError?.(e);
        }}
      />
    </>
  );
}
