import React, {FC, useCallback, useRef, useState} from 'react';
// own modules
import ImageMagnifierArea from "./ImageMagnifierArea";
import {useResizeObserver} from "../hooks/useResizeObserver";

type TSizes = {width: number, height: number};

interface IImageMagnifierProps {
    imageSrc: string,
    approximation?: number,
    maxLengthSide?: number,
    maxHeightContent: number,
    maxSizeMagnifier: { width: string, height: string }
}

const ImageMagnifier: FC<IImageMagnifierProps> = ({imageSrc, approximation, maxLengthSide, maxHeightContent, maxSizeMagnifier}) => {
    const magnifierAreaRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const [isActiveMagnifier, setIsActiveMagnifier] = useState<boolean>(false);
    const [imageSizes, setImageSizes] = useState<TSizes | null>(null);
    const [magnifierAreaSizes, setMagnifierAreaSizes] = useState<{width: number, height: number, left: number, top: number}>({
        width: parseFloat(maxSizeMagnifier.width),
        height: parseFloat(maxSizeMagnifier.height),
        left: 0,
        top: 0,
    });
    const resizeImageObserverRef = useResizeObserver((target) => {
        setImageSizes({width: target.getBoundingClientRect().width, height: target.getBoundingClientRect().height});

        if (!magnifierAreaSizes) return;
        if (target.getBoundingClientRect().width > magnifierAreaSizes.width) {
            setMagnifierAreaSizes({
                ...magnifierAreaSizes,
                width: target.getBoundingClientRect().width
            })
        }
        if (target.getBoundingClientRect().height > magnifierAreaSizes.height) {
            setMagnifierAreaSizes({
                ...magnifierAreaSizes,
                height: target.getBoundingClientRect().height
            })
        }
    })
    const resizeMagnifierObserverRef = useResizeObserver((target) => {
        setMagnifierAreaSizes({
            ...magnifierAreaSizes,
            width: target.getBoundingClientRect().width,
            height: target.getBoundingClientRect().height
        })
    })

    const onMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        if (!imageRef.current) throw new Error("imageRef.current image cannot be null");
        if (!containerRef.current) throw new Error("containerRef.current image magnifier cannot be null");
        if (!magnifierAreaRef.current) throw new Error("magnifierAreaRef.current image cannot be null");

        setIsActiveMagnifier(true);

        const maxMagnifierAreaLeft = imageRef.current.getBoundingClientRect().width - (magnifierAreaRef.current.getBoundingClientRect().width);
        const maxMagnifierAreaTop = imageRef.current.getBoundingClientRect().height - (magnifierAreaRef.current.getBoundingClientRect().height);

        const magnifierAreaLeft = event.pageX - containerRef.current.getBoundingClientRect().left - (magnifierAreaRef.current.getBoundingClientRect().width * 0.5);
        const magnifierAreaTop = event.pageY - containerRef.current.getBoundingClientRect().top - (magnifierAreaRef.current.getBoundingClientRect().height * 0.5);

        setMagnifierAreaSizes({
            ...magnifierAreaSizes,
            left: maxMagnifierAreaLeft > (magnifierAreaLeft > 0 ? magnifierAreaLeft : 0) ? (magnifierAreaLeft > 0 ? magnifierAreaLeft : 0) : maxMagnifierAreaLeft,
            top: maxMagnifierAreaTop > (magnifierAreaTop > 0 ? magnifierAreaTop : 0) ? (magnifierAreaTop > 0 ? magnifierAreaTop : 0) : maxMagnifierAreaTop
        })
    }, [])

    return (
        <>
            <div ref={containerRef} onMouseMove={onMouseMove} onMouseLeave={() => setIsActiveMagnifier(false)} style={{maxWidth: "100%", position: "relative"}}>
                <img ref={el => {
                    resizeImageObserverRef.current = el;
                    imageRef.current = el;
                }} src={imageSrc} alt="image" style={{display: "block", maxHeight: maxHeightContent, maxWidth: "100%"}}/>
                <div
                    ref={el => {
                        magnifierAreaRef.current = el;
                        resizeMagnifierObserverRef.current = el;
                    }}
                    style={{
                        display: isActiveMagnifier ? "block" : "none",
                        position: "absolute",
                        left: magnifierAreaSizes.left,
                        top: magnifierAreaSizes.top,
                        width: maxSizeMagnifier.width,
                        height: maxSizeMagnifier.height,
                        border: "solid 2px red",
                        backgroundColor: "rgb(255 0 0 / 30%)"
                    }}
                />
            </div>

            {imageSizes &&
                <ImageMagnifierArea
                    isActive={(magnifierAreaSizes && isActiveMagnifier)}
                    imageSrc={imageSrc}
                    imageSizes={imageSizes}
                    magnifierAreaSizes={magnifierAreaSizes}
                    approximation={approximation}
                    maxLengthSide={maxLengthSide}
                />
            }
        </>
    );
};

export default ImageMagnifier;