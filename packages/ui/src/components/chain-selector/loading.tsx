export const SkeletonListItem = () => {
  return (
    <ul className="w-full rounded-md p-1 flex items-center justify-between gap-2 pr-3 animate-pulse ">
      <li className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-neutral-100" /> {/* Avatar */}
        <div className="flex flex-col gap-1">
          <div className="w-24 h-4 rounded-md bg-neutral-100" /> {/* Name */}
          <div className="w-16 h-3 rounded-md bg-neutral-100" /> {/* Desc */}
        </div>
      </li>

      <div className="flex gap-4 items-end">
        <div className="w-4 h-4 bg-neutral-100 rounded-full" /> {/* Star */}
      </div>
    </ul>
  );
};

export const SkeletonList = ({ count = 5 }: { count?: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonListItem key={`skeleton_${index}`} />
      ))}
    </>
  );
};
