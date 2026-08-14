"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import AssetPoster from "./asset-poster";
import { assetMediaClass } from "./asset-frame";
import type { AssetRiveProps } from "./asset-types";

const AssetRiveCanvas = dynamic(() => import("./asset-rive-canvas"), {
  ssr: false,
});

function AssetRive({
  src,
  poster,
  alt,
  fit,
  mediaClassName,
  artboard,
  animations,
  stateMachines,
  autoplay = true,
}: AssetRiveProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <AssetPoster src={poster} alt={alt} fit={fit} visible={!loaded} />
      <AssetRiveCanvas
        src={src}
        fit={fit}
        artboard={artboard}
        animations={animations}
        stateMachines={stateMachines}
        autoplay={autoplay}
        onLoad={() => setLoaded(true)}
        className={assetMediaClass(fit, mediaClassName)}
      />
    </>
  );
}

export default AssetRive;
