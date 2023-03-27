import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
// own modules
import ApproximateArea from "./ApproximateArea";
import {useResizeObserver} from "../hooks/useResizeObserver";

type TSizes = {width: number, height: number};

interface IImageMagnifierProps {
    imageSrc: string,
    maxHeightContent: number,
    // size of the magnifier area on the image in px
    maxSizeMagnifierArea: { width: number, height: number },
    // absolute positioning of the magnifier relative to the left edge of the window
    leftPositioningMagnifier: string,
    // absolute positioning of the magnifier relative to the top edge of the window
    topPositioningMagnifier: string,
    // color of the magnifier place on the content, default is "rgb(0 0 0 / 30%)"
    colorMagnifierArea?: string,
    // border color of the magnifier place on the content, default is "none"
    borderMagnifierArea?: string,
    // box shadow of the magnifier place on the content, default is "none"
    boxShadowMagnifierArea?: string,
    approximation?: number,
    // max length of the approximate area in px, default is 600
    maxLengthSideApproximateArea?: number,
    alt?: string
}

const ImageMagnifier: FC<IImageMagnifierProps> = ({
                                                      imageSrc,
                                                      approximation,
                                                      maxLengthSideApproximateArea,
                                                      maxHeightContent,
                                                      maxSizeMagnifierArea,
                                                      leftPositioningMagnifier,
                                                      topPositioningMagnifier,
                                                      colorMagnifierArea,
                                                      boxShadowMagnifierArea,
                                                      borderMagnifierArea,
                                                      alt
}) => {
    const magnifierAreaRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const [isActiveMagnifier, setIsActiveMagnifier] = useState<boolean>(false);
    const [imageSizes, setImageSizes] = useState<TSizes | null>(null);
    const [magnifierAreaSizes, setMagnifierAreaSizes] = useState<TSizes>({
        width: maxSizeMagnifierArea.width,
        height: maxSizeMagnifierArea.height,
    });
    const [offsetMagnifierArea, setOffsetMagnifierArea] = useState<{left: number, top: number}>({left: 0, top: 0});
    const resizeImageObserverRef = useResizeObserver((target) => {
        setImageSizes({width: target.getBoundingClientRect().width, height: target.getBoundingClientRect().height});
    })

    useEffect(() => {
        // if image width or height is bigger than side of the magnifier area
        if (!imageSizes || !imageSizes.width || !imageSizes.height) return;

        if (imageSizes.width < magnifierAreaSizes.width) {
            setMagnifierAreaSizes({
                ...magnifierAreaSizes,
                width: imageSizes.width
            })
        }
        if (imageSizes.height < magnifierAreaSizes.height) {
            setMagnifierAreaSizes({
                ...magnifierAreaSizes,
                height: imageSizes.height
            })
        }
    }, [imageSizes])

    const onMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        if (!imageSizes) return;
        if (!containerRef.current) throw new Error("containerRef.current image magnifier cannot be null");
        if (!magnifierAreaRef.current) throw new Error("magnifierAreaRef.current image cannot be null");

        setIsActiveMagnifier(true);

        const maxMagnifierAreaLeft = imageSizes.width - magnifierAreaSizes.width;
        const maxMagnifierAreaTop = imageSizes.height - magnifierAreaSizes.height;

        const magnifierAreaLeft = event.pageX - containerRef.current.getBoundingClientRect().left - (magnifierAreaSizes.width * 0.5);
        const magnifierAreaTop = event.pageY - containerRef.current.getBoundingClientRect().top - (magnifierAreaSizes.height * 0.5);

        setOffsetMagnifierArea({
            left: maxMagnifierAreaLeft > (magnifierAreaLeft > 0 ? magnifierAreaLeft : 0) ? (magnifierAreaLeft > 0 ? magnifierAreaLeft : 0) : maxMagnifierAreaLeft,
            top: maxMagnifierAreaTop > (magnifierAreaTop > 0 ? magnifierAreaTop : 0) ? (magnifierAreaTop > 0 ? magnifierAreaTop : 0) : maxMagnifierAreaTop
        })
    }, [imageSizes, magnifierAreaSizes])

    return (
        <>
            <div ref={containerRef} onMouseMove={onMouseMove} onMouseLeave={() => setIsActiveMagnifier(false)} style={{maxWidth: "100%", position: "relative"}}>
                <img ref={el => {
                    resizeImageObserverRef.current = el;
                    imageRef.current = el;
                }} src={imageSrc} alt={alt} style={{display: "block", maxHeight: maxHeightContent, maxWidth: "100%"}}/>
                <div
                    ref={el => {
                        magnifierAreaRef.current = el;
                    }}
                    style={{
                        display: isActiveMagnifier ? "block" : "none",
                        position: "absolute",
                        left: offsetMagnifierArea ? offsetMagnifierArea.left : 0,
                        top: offsetMagnifierArea ? offsetMagnifierArea.top : 0,
                        width: magnifierAreaSizes.width,
                        height: magnifierAreaSizes.height,
                        border: borderMagnifierArea ? borderMagnifierArea : "none",
                        backgroundColor: colorMagnifierArea ? colorMagnifierArea : "rgb(0 0 0 / 30%)",
                        boxShadow: boxShadowMagnifierArea ? boxShadowMagnifierArea : "none"
                    }}
                />
            </div>

            {imageSizes &&
                <ApproximateArea
                    left={leftPositioningMagnifier}
                    top={topPositioningMagnifier}
                    isActive={isActiveMagnifier}
                    imageSrc={imageSrc}
                    imageSizes={imageSizes}
                    magnifierAreaSizes={{...magnifierAreaSizes, ...offsetMagnifierArea}}
                    approximation={approximation}
                    maxLengthSide={maxLengthSideApproximateArea}
                />
            }
        </>
    );
};

export default ImageMagnifier;