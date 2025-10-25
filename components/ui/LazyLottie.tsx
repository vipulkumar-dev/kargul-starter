"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import lottie from "lottie-web"; // import the underlying lottie-web
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LazyLottieProps {
  poster?: string;
  posterAlt?: string;
  posterFill?: boolean;
  rootMargin?: string;
  threshold?: number;
  fallback?: React.ReactNode;
  loading?: React.ReactNode;
  className?: string;
  // All other props passed to Lottie component
  [key: string]: unknown;
}

const LazyLottie: React.FC<LazyLottieProps> = ({
  poster,
  posterAlt = "Loading animation",
  posterFill = true,
  rootMargin = "50px",
  threshold = 0.1,
  fallback,
  loading,
  className,
  ...lottieProps
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [isLottieReady, setIsLottieReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [animationDataState, setAnimationDataState] = useState<object | null>(
    null,
  );

  // Set global quality once
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      lottie &&
      typeof lottie.setQuality === "function"
    ) {
      // Choose “low”, “medium”, “high” or a number > 1
      lottie.setQuality("low");

      // If you prefer medium:
      // lottie.setQuality("medium");
      // Or a numeric factor:
      // lottie.setQuality(2);
    }
  }, []);

  // Wait for full page load
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (document.readyState === "complete") {
      setIsPageLoaded(true);
    } else {
      const onLoad = () => {
        setIsPageLoaded(true);
      };
      window.addEventListener("load", onLoad);
      return () => window.removeEventListener("load", onLoad);
    }
  }, []);

  // Load the animation JSON when conditions are met
  const loadAnimationData = useCallback(async () => {
    if (!isPageLoaded) return;

    // If animationData is passed as prop, use it directly
    if (lottieProps.animationData) {
      setAnimationDataState(lottieProps.animationData as object);
      setIsLottieReady(true);
      return;
    }

    // Otherwise, fetch from path
    if (lottieProps.path && typeof lottieProps.path === "string") {
      try {
        const resp = await fetch(lottieProps.path as string);
        if (!resp.ok) {
          throw new Error(`Failed to load animation: ${resp.status}`);
        }
        const data = await resp.json();
        setAnimationDataState(data);
        setIsLottieReady(true);
      } catch (err) {
        console.error("Error loading Lottie animation:", err);
        setHasError(true);
        if (typeof lottieProps.onError === "function") {
          (lottieProps.onError as (e: unknown) => void)(err);
        }
      }
    }
  }, [isPageLoaded, lottieProps]);

  const handleLottieLoaded = useCallback(() => {
    setIsLottieReady(true);
  }, []);

  // Observe intersection to play / pause
  useEffect(() => {
    if (!isLottieReady || !lottieRef.current || !containerRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            lottieRef.current?.play();
          } else {
            lottieRef.current?.pause();
          }
        });
      },
      { rootMargin, threshold },
    );

    observerRef.current.observe(containerRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [isLottieReady, rootMargin, threshold]);

  // Trigger load when page loaded
  useEffect(() => {
    if (isPageLoaded && !isLottieReady) {
      loadAnimationData();
    }
  }, [isPageLoaded, isLottieReady, loadAnimationData]);

  // Before both page load & animation fetched: show placeholder / poster
  if (!isPageLoaded || !isLottieReady) {
    return (
      <div
        ref={containerRef}
        className={cn("flex items-center justify-center", className)}
      >
        {loading ? (
          loading
        ) : poster ? (
          <Image src={poster} alt={posterAlt} fill={posterFill} />
        ) : (
          <div className="animate-pulse rounded bg-gray-200" />
        )}
      </div>
    );
  }

  if (hasError) {
    return (
      <div
        ref={containerRef}
        className={cn("flex items-center justify-center", className)}
      >
        {fallback || (
          <div className="text-red-500">Failed to load animation</div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn("lazy-lottie-container", className)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {animationDataState && (
        <Lottie
          lottieRef={lottieRef}
          animationData={animationDataState}
          onLoad={handleLottieLoaded}
          {...lottieProps}
        />
      )}
    </div>
  );
};

export default LazyLottie;
