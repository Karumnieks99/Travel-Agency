import React from "react";

const MODERNIZABLE_FORMAT = /\.(jpe?g|png)$/i;

function buildWebpSrc(src) {
  if (!MODERNIZABLE_FORMAT.test(src)) return null;
  return src.replace(MODERNIZABLE_FORMAT, ".webp");
}

export default function OptimizedImage({ src, alt, fetchPriority, webpSrcSet, sizes, ...imgProps }) {
  const webpSrc = buildWebpSrc(src);
  // React 18 only forwards the lowercase DOM attribute; camelCase is dropped with a warning.
  if (fetchPriority) imgProps.fetchpriority = fetchPriority;

  if (!webpSrc && !webpSrcSet) {
    return <img src={src} alt={alt} {...imgProps} />;
  }

  return (
    <picture>
      <source srcSet={webpSrcSet ?? webpSrc} sizes={webpSrcSet ? sizes : undefined} type="image/webp" />
      <img src={src} alt={alt} {...imgProps} />
    </picture>
  );
}
