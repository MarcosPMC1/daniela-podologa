"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useRef, useState } from "react";

interface LocationMapProps {
  embedLink: string;
  title: string;
}

export function LocationMap({ embedLink, title }: LocationMapProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" } // Start loading 200px before it enters the viewport
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {!isLoaded && (
        <Skeleton className="absolute inset-0 w-full h-full bg-zinc-200" />
      )}
      {isInView && (
        <iframe
          src={embedLink}
          className={`w-full h-full transition-opacity duration-700 ease-in-out ${isLoaded ? "opacity-100" : "opacity-0"
            }`}
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          title={title}
          onLoad={() => setIsLoaded(true)}
        />
      )}
    </div>
  );
}
