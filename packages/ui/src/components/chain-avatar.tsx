import React, { useState, useEffect } from "react";

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: number; // Default size can be 48px
}

/**
 * Normalizes a URL, ensuring paths starting with / are correctly resolved against the base URL
 */
const normalizeImageUrl = (url?: string): string => {
  if (!url) return "";

  // If it's an absolute URL (starts with http or https), return as is
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // If it's a relative URL starting with /, concatenate with the origin
  if (url.startsWith("/")) {
    return `${window.location.origin}${url}`;
  }

  // Otherwise return as is (for data URLs or other formats)
  return url;
};

const ChainAvatar: React.FC<AvatarProps> = ({
  src,
  alt = "Avatar",
  size = 48,
}) => {
  const [isImageValid, setIsImageValid] = useState<boolean>(!!src);
  const normalizedSrc = normalizeImageUrl(src);

  useEffect(() => {
    if (normalizedSrc) {
      const img = new Image();
      img.src = normalizedSrc;
      img.onload = () => setIsImageValid(true);
      img.onerror = () => setIsImageValid(false);
    } else {
      setIsImageValid(false);
    }
  }, [normalizedSrc]);

  return isImageValid ? (
    <img
      src={normalizedSrc}
      alt={alt}
      width={size}
      height={size}
      className="rounded-full object-cover"
    />
  ) : (
    <div
      className="bg-gray-300 rounded-full"
      style={{ width: size, height: size }}
    />
  );
};

export default ChainAvatar;
