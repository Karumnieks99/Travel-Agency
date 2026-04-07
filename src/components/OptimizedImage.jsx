import React from "react";

const MODERNIZABLE_FORMAT = /\.(jpe?g|png)$/i;

function buildWebpSrc(src) {
  if (!MODERNIZABLE_FORMAT.test(src)) return null;
  return src.replace(MODERNIZABLE_FORMAT, ".webp");
}

export default function OptimizedImage({ src, alt, ...imgProps }) {
  const webpSrc = buildWebpSrc(src);

  if (!webpSrc) {
    return <img src={src} alt={alt} {...imgProps} />;
  }

  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      <img src={src} alt={alt} {...imgProps} />
    </picture>
  );
}
