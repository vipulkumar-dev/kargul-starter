"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

interface VideoProps {
  src: string;
  mobileSrc?: string;
  className?: string;
  poster?: string;

  onLoadStart?: () => void;
  onLoadedData?: () => void;
  onError?: () => void;
}

function Video({
  src,
  mobileSrc,
  className,
  poster,

  onLoadStart,
  onLoadedData,
  onError,
  ...props
}: VideoProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  // Helper function to clear all video sources
  const clearAllVideoSources = React.useCallback((video: HTMLVideoElement) => {
    // Remove src attribute from video element
    video.removeAttribute("src");

    // Clear all source elements
    const sources = video.querySelectorAll("source");
    sources.forEach((source) => {
      source.removeAttribute("src");
    });

    // Trigger load to release resources
    video.load();
  }, []);

  // Helper function to restore video sources
  const restoreVideoSources = React.useCallback(
    (video: HTMLVideoElement) => {
      if (!video.dataset.originalSources) return;

      const sourcesData = JSON.parse(video.dataset.originalSources);
      const sources = video.querySelectorAll("source");

      sources.forEach((source, index) => {
        if (sourcesData[index]) {
          source.src = sourcesData[index].src;
          source.type = sourcesData[index].type;
          if (sourcesData[index].media) {
            source.media = sourcesData[index].media;
          }
        }
      });

      // Reload the video with new sources
      video.load();

      // Wait for the video to be ready before playing
      const onLoaded = () => {
        video.play().catch((err) => {
          console.log("Error playing video:", err);
          // If autoplay fails, remove the sources
          clearAllVideoSources(video);
        });
        video.removeEventListener("loadeddata", onLoaded);
      };

      video.addEventListener("loadeddata", onLoaded);
    },
    [clearAllVideoSources],
  );

  // Set up intersection observer for video play/pause
  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;

    // Store original sources for restoration
    if (!video.dataset.originalSources) {
      const sources = video.querySelectorAll("source");
      const sourcesData = Array.from(sources).map((source) => ({
        src: source.src,
        type: source.type,
        media: source.media || "",
      }));
      video.dataset.originalSources = JSON.stringify(sourcesData);
    }

    // Handle autoplay failure
    const handleAutoplayFailure = () => {
      console.log("Autoplay failed, removing video sources");
      clearAllVideoSources(video);
    };

    // Add event listener for autoplay failure
    video.addEventListener("error", handleAutoplayFailure);

    // Also check if play() promise is rejected
    const originalPlay = video.play;
    video.play = function () {
      return originalPlay.call(this).catch((error) => {
        console.log("Play promise rejected:", error);
        handleAutoplayFailure();
        throw error;
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Video is in view - restore sources and auto-play after load
            console.log("play");
            restoreVideoSources(video);
          } else {
            // Video is out of view - pause and clean sources
            console.log("pause");
            video.pause();
            clearAllVideoSources(video);
          }
        });
      },
      { threshold: 0, rootMargin: "200px" },
    );

    observer.observe(video);

    // Cleanup observer on unmount
    return () => {
      observer.disconnect();
      video.removeEventListener("error", handleAutoplayFailure);
    };
  }, [clearAllVideoSources, restoreVideoSources]);

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      preload="none"
      poster={poster}
      className={cn("auto_video absolute object-cover", className)}
      onLoadStart={onLoadStart}
      onLoadedData={onLoadedData}
      onError={onError}
      {...props}
    >
      <source src={src} type="video/webm" media="(min-width: 768px)" />
      <source
        src={mobileSrc || src}
        type="video/webm"
        media="(max-width: 769px)"
      />
      Your browser does not support the video tag.
    </video>
  );
}

export default Video;
