import React, { useState, useEffect } from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: number; // Default size can be 48px
}

const ChainAvatar: React.FC<AvatarProps> = ({ src, alt = "Avatar", size = 48 }) => {
  const [isImageValid, setIsImageValid] = useState<boolean>(!!src);

  useEffect(() => {
    if (src) {
      const img = new Image();
      img.src = src;
      img.onload = () => setIsImageValid(true);
      img.onerror = () => setIsImageValid(false);
    } else {
      setIsImageValid(false);
    }
  }, [src]);
  return isImageValid ? (
    <img
      src={src}
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
