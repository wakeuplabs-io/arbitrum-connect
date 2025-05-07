import React, { useState, useEffect } from "react";
import { Check } from "lucide-react"; // adjust import based on your icon library

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: number; // Default size can be 48px
  checked?: boolean;
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
  checked = false,
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

  return (
    <div
      className="relative inline-block"
      style={{ width: size, height: size }}
    >
      {isImageValid ? (
        <img
          src={normalizedSrc}
          alt={alt}
          width={size}
          height={size}
          className="rounded-full object-cover w-full h-full"
        />
      ) : (
        <div className="bg-gray-300 rounded-full w-full h-full" />
      )}
      {checked && (
        <div className="absolute bottom-0 right-0 h-4 w-4 flex justify-center items-center rounded-full border-2 border-green-500 bg-green-500">
          <Check strokeWidth={3} color="white" className="mt-0.5" />
        </div>
      )}
    </div>
  );
};

export default ChainAvatar;
