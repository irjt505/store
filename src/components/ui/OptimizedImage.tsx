"use client";

import Image, { type ImageProps } from "next/image";

interface OptimizedImageProps extends Omit<ImageProps, "sizes"> {
  priority?: boolean;
  sizes?: string;
}

export function OptimizedImage({
  priority = false,
  quality = 85,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  placeholder = "blur",
  className,
  ...props
}: OptimizedImageProps) {
  return (
    <Image
      quality={quality}
      sizes={sizes}
      priority={priority}
      loading={priority ? undefined : "lazy"}
      placeholder={props.blurDataURL ? placeholder : undefined}
      className={className}
      {...props}
    />
  );
}
