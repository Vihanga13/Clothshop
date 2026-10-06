import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', ...props }) => {
  return (
    <div
      className={`
        animate-pulse bg-[#E0D8C3]
        border-2 border-black rounded-lg
        shadow-neo-sm
        ${className}
      `}
      {...props}
    />
  );
};

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="border-3 border-black rounded-lg bg-white p-3 shadow-neo flex flex-col gap-3">
      <Skeleton className="w-full aspect-square" />
      <div className="flex justify-between items-center gap-2">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-12" />
      </div>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="mt-2 flex items-center justify-between gap-3 pt-2 border-t-2 border-black">
        <Skeleton className="h-7 w-20" />
        <Skeleton className="h-9 w-28" />
      </div>
    </div>
  );
};
