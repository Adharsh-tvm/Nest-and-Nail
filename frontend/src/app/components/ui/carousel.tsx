"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/app/components/ui/button";

type CarouselApi = {
    scrollNext: () => void;
    scrollPrev: () => void;
    canScrollNext: boolean;
    canScrollPrev: boolean;
};

interface CarouselProps {
    children: React.ReactNode;
    className?: string;
    setApi?: (api: CarouselApi) => void;
}

interface CarouselContextProps {
    carouselRef: React.RefObject<HTMLDivElement>;
    scrollNext: () => void;
    scrollPrev: () => void;
    canScrollNext: boolean;
    canScrollPrev: boolean;
}

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
    const context = React.useContext(CarouselContext);
    if (!context) {
        throw new Error("useCarousel must be used within a <Carousel />");
    }
    return context;
}

const Carousel = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(({ className, children, setApi, ...props }, ref) => {
    const carouselRef = React.useRef<HTMLDivElement>(null);
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(true);

    const scrollPrev = React.useCallback(() => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: -carouselRef.current.offsetWidth, behavior: "smooth" });
        }
    }, []);

    const scrollNext = React.useCallback(() => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: carouselRef.current.offsetWidth, behavior: "smooth" });
        }
    }, []);

    const handleScroll = React.useCallback(() => {
        if (!carouselRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;

        // Tolerance for float comparison
        const isAtStart = scrollLeft <= 1;
        const isAtEnd = Math.abs(scrollWidth - clientWidth - scrollLeft) <= 1;

        setCanScrollPrev(!isAtStart);
        setCanScrollNext(!isAtEnd);
    }, []);

    React.useEffect(() => {
        const container = carouselRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            // Initial check
            handleScroll();
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, [handleScroll]);

    // Expose API if requested
    React.useEffect(() => {
        if (setApi) {
            setApi({
                scrollNext,
                scrollPrev,
                canScrollNext,
                canScrollPrev
            });
        }
    }, [setApi, scrollNext, scrollPrev, canScrollNext, canScrollPrev]);

    return (
        <CarouselContext.Provider
            value={{
                carouselRef,
                scrollNext,
                scrollPrev,
                canScrollNext,
                canScrollPrev,
            }}
        >
            <div
                ref={ref}
                className={cn("relative", className)}
                role="region"
                aria-roledescription="carousel"
                {...props}
            >
                {children}
            </div>
        </CarouselContext.Provider>
    );
});
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    const { carouselRef } = useCarousel();

    // Merge refs
    const mergedRef = React.useCallback((node: HTMLDivElement | null) => {
        // Handle internal ref
        if (carouselRef) {
            (carouselRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
        // Handle external ref if any
        if (typeof ref === 'function') {
            ref(node);
        } else if (ref) {
            (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
    }, [carouselRef, ref]);

    return (
        <div
            ref={mergedRef}
            className={cn(
                "flex",
                "-ml-4",
                "overflow-x-auto snap-x snap-mandatory no-scrollbar",
                // Hide scrollbar:
                "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']",
                className
            )}
            {...props}
        />
    );
});
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    return (
        <div
            ref={ref}
            role="group"
            aria-roledescription="slide"
            className={cn(
                "min-w-0 shrink-0 grow-0 basis-full pl-4 snap-center",
                className
            )}
            {...props}
        />
    );
});
CarouselItem.displayName = "CarouselItem";

const CarouselPrevious = React.forwardRef<
    HTMLButtonElement,
    React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { scrollPrev, canScrollPrev } = useCarousel();

    return (
        <Button
            ref={ref}
            variant={variant}
            size={size}
            className={cn(
                "absolute h-8 w-8 rounded-full",
                "top-1/2 -translate-y-1/2",
                "left-2",
                className
            )}
            disabled={!canScrollPrev}
            onClick={scrollPrev}
            {...props}
        >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Previous slide</span>
        </Button>
    );
});
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef<
    HTMLButtonElement,
    React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { scrollNext, canScrollNext } = useCarousel();

    return (
        <Button
            ref={ref}
            variant={variant}
            size={size}
            className={cn(
                "absolute h-8 w-8 rounded-full",
                "top-1/2 -translate-y-1/2",
                "right-2",
                className
            )}
            disabled={!canScrollNext}
            onClick={scrollNext}
            {...props}
        >
            <ArrowRight className="h-4 w-4" />
            <span className="sr-only">Next slide</span>
        </Button>
    );
});
CarouselNext.displayName = "CarouselNext";

export {
    type CarouselApi,
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
};
