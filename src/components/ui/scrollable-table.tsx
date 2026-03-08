import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ScrollableTableProps {
  children: React.ReactNode;
  className?: string;
}

export function ScrollableTable({ children, className }: ScrollableTableProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftShadow, setShowLeftShadow] = useState(false);
  const [showRightShadow, setShowRightShadow] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftShadow(scrollLeft > 0);
      setShowRightShadow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    const element = scrollRef.current;
    if (element) {
      element.addEventListener('scroll', checkScroll);
      return () => element.removeEventListener('scroll', checkScroll);
    }
  }, []);

  return (
    <div className="relative">
      {/* Left scroll indicator */}
      {showLeftShadow && (
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      )}
      
      {/* Right scroll indicator */}
      {showRightShadow && (
        <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      )}
      
      {/* Scrollable content */}
      <div
        ref={scrollRef}
        className={cn("overflow-x-auto", className)}
        onScroll={checkScroll}
      >
        {children}
      </div>
      
      {/* Mobile scroll hint */}
      {showRightShadow && (
        <div className="lg:hidden absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded pointer-events-none">
          Scroll →
        </div>
      )}
    </div>
  );
}