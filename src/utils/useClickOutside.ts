import { useEffect } from "react";

export function useOnClickOutside(
    ref: React.RefObject<HTMLDivElement>,
    handler: (event: MouseEvent | TouchEvent) => void
) {
    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {

            const clickedElementId = (event.target as HTMLElement).id;
            if (clickedElementId === "features-dropdown-button" || clickedElementId === "features-span" || clickedElementId === "features-svg") {
                return;
            }

            // Do nothing if clicking ref's element or descendent elements
            if (!ref.current || ref.current.contains(event.target as Node)) {
                return;
            }

            handler(event);
        };

        document.addEventListener("mousedown", listener);

        return () => {
            document.removeEventListener("mousedown", listener);
        };
    }, [ref, handler]);
}
