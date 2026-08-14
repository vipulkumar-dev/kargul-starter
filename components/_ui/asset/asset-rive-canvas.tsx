"use client";

import { Alignment, Fit, Layout, useRive } from "@rive-app/react-canvas";
import type { AssetFit } from "./asset-types";

const RIVE_FIT: Record<AssetFit, Fit> = {
  cover: Fit.Cover,
  contain: Fit.Contain,
  fill: Fit.Fill,
  none: Fit.None,
};

export type AssetRiveCanvasProps = {
  src: string;
  fit?: AssetFit;
  artboard?: string;
  animations?: string | string[];
  stateMachines?: string | string[];
  autoplay?: boolean;
  className?: string;
  onLoad?: () => void;
};

function AssetRiveCanvas({
  src,
  fit = "cover",
  artboard,
  animations,
  stateMachines,
  autoplay = true,
  className,
  onLoad,
}: AssetRiveCanvasProps) {
  const { RiveComponent } = useRive({
    src,
    artboard,
    animations,
    stateMachines,
    autoplay,
    layout: new Layout({ fit: RIVE_FIT[fit], alignment: Alignment.Center }),
    onLoad,
  });

  return <RiveComponent className={className} />;
}

export default AssetRiveCanvas;
