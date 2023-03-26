import {useEffect, useRef} from "react";

const useResizeObserver = <T extends Element>(callback: (target: T, entry: ResizeObserverEntry) => void) => {
    const ref = useRef<T | null>(null);

    useEffect(() => {
        if (!ref.current) return;

        const observer = new ResizeObserver(entries => {
            callback(ref.current!, entries[0]);
        })
        observer.observe(ref.current);

        return () => observer.disconnect();
    }, [])

    return ref;
}

export {useResizeObserver};