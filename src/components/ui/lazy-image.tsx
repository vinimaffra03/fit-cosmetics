"use client";

import { useState, useRef, useEffect } from 'react';
import { Skeleton } from './skeleton';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  className?: string;
  skeletonClassName?: string;
}

export function LazyImage({ 
  src, 
  alt, 
  fallback = '/placeholder.jpg',
  className,
  skeletonClassName,
  ...props 
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <div className={className}>
      {!isLoaded && isInView && (
        <Skeleton className={skeletonClassName || "w-full h-full"} />
      )}
      
      {isInView && (
        <img
          ref={imgRef}
          src={hasError ? fallback : src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          {...props}
        />
      )}
    </div>
  );
}
