import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: number; // Default size can be 48px
}

const Avatar: React.FC<AvatarProps> = ({ src, alt = "Avatar", size = 48 }) => {
  return src ? (
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

export default Avatar;
