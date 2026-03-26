import { useState, useRef, useEffect } from "react";

interface VideoBlockProps {
  src: string;
  className?: string;
}

const VideoBlock = ({ src, className = "" }: VideoBlockProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Lazy load video when it enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHasIntersected(true);
      },
      { threshold: 0.25 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-h-[450px] rounded-lg overflow-hidden bg-black"
    >
      {/* Skeleton */}
      {!isLoaded && <div className="absolute inset-0 animate-pulse bg-gray-300" />}

      {/* Video */}
      {hasIntersected && (
        <video
          src={src}
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${className} ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
};

export default VideoBlock;