export const SkeletonListItem = () => {
 return (
   <ul className="w-full rounded-md p-1 flex items-center justify-between gap-2 pr-3 animate-pulse bg-white">
     {/* Left: Avatar + Name placeholder */}
     <li className="flex items-center gap-3">
       <div className="w-8 h-8 rounded-full bg-neutral-200" /> {/* Avatar */}
       <div className="w-24 h-4 rounded bg-neutral-200" /> {/* Name */}
     </li>

     {/* Right: Action icons */}
     <div className="flex gap-4 items-center">
       <div className="w-4 h-4 bg-neutral-200 rounded" /> {/* Pencil */}
       <div className="w-4 h-4 bg-neutral-200 rounded" /> {/* Trash */}
       <div className="w-4 h-4 bg-neutral-200 rounded-full" /> {/* Star */}
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
