import {useEffect, useRef, useState} from "react";

type TSizes = {width: number, height: number};
const useOriginalImageSizes = (imageSrc: string) => {
    const [originalImageSizes, setOriginalImageSizes] = useState<TSizes | null>();

    useEffect(() => {
        if (!imageSrc) return;

        const img = new Image();
        img.addEventListener("load", onLoad)
        img.src = imageSrc;

        function onLoad (this: HTMLImageElement) {
            setOriginalImageSizes({width: this.width, height: this.height});
        }

        return () => img.removeEventListener("load", onLoad);
    }, [imageSrc])

    return originalImageSizes;
}

export {useOriginalImageSizes};