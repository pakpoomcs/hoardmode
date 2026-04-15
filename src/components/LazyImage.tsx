import { useEffect, useRef, useState } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
}

/**
 * IntersectionObserver-based lazy loader.
 * Images are not fetched until they enter the viewport —
 * keeps the initial bundle render fast regardless of roster size.
 */
export function LazyImage({ src, alt, className = '', placeholder }: LazyImageProps) {
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <img
      ref={ref}
      src={inView ? src : placeholder ?? ''}
      alt={alt}
      className={`lazy-image ${loaded ? 'lazy-image--loaded' : 'lazy-image--loading'} ${className}`}
      onLoad={() => setLoaded(true)}
    />
  );
}
