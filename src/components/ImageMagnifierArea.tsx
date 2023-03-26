import React, {FC, useEffect, useState} from 'react';
import {createPortal} from "react-dom";
// own modules
import {useOriginalImageSizes} from "../hooks/useOriginalImageSizes";

type TSizes = {width: number, height: number};
interface IImageMagnifier {
    isActive: boolean,
    imageSrc: string,
    approximation?: number,
    imageSizes: TSizes,
    magnifierAreaSizes: {width: number, height: number, left: number, top: number},
    maxLengthSide?: number
}

const ImageMagnifierArea: FC<IImageMagnifier> = ({imageSrc, imageSizes, magnifierAreaSizes, approximation = 3, maxLengthSide = 500, isActive}) => {
    const originalImageSizes = useOriginalImageSizes(imageSrc);
    const [coefficientToDesiredSize, setCoefficientToDesiredSize] = useState<number>(1); // used to bring the width and height to the desired size(maxLengthSide)
    const [magnifierSizes, setMagnifierSizes] = useState<TSizes | null>(null);
    const [backgroundWidth, setBackgroundWidth] = useState<number>(0);
    const [backgroundHeight, setBackgroundHeight] = useState<number>(0);
    const [backgroundPositionX, setBackgroundPositionX] = useState<number>(0);
    const [backgroundPositionY, setBackgroundPositionY] = useState<number>(0);
    const [aspectRatioOriginalToMagnifierArea, setAspectRatioOriginalToMagnifierArea] = useState<TSizes | null>(null); // aspect ratio magnifier place to the original sizes of the image
    const [aspectRatioOriginalToOnPageImage, setAspectRatioOriginalToOnPageImage] = useState<TSizes | null>(null); // aspect ratio image on the page to the original sizes of the image

    useEffect(() => {
        if (!magnifierAreaSizes.width || !magnifierAreaSizes.height) return;

        setMagnifierSizes({
            width: magnifierAreaSizes.width * approximation,
            height: magnifierAreaSizes.height * approximation
        });
    }, [magnifierAreaSizes, approximation])
    useEffect(() => {
        if (!magnifierSizes) return;

        let coefficientToDesiredSize: number;
        if (magnifierSizes.width >= magnifierSizes.height) {
            coefficientToDesiredSize = maxLengthSide / magnifierSizes.width;
        }
        else {
            coefficientToDesiredSize = maxLengthSide / magnifierSizes.height;
        }

        setCoefficientToDesiredSize(coefficientToDesiredSize);
    }, [magnifierSizes, maxLengthSide])
    useEffect(() => {
        if (!originalImageSizes || !magnifierAreaSizes || !imageSizes) return;

        setAspectRatioOriginalToMagnifierArea({width: originalImageSizes.width / magnifierAreaSizes.width, height: originalImageSizes.height / magnifierAreaSizes.height});
        setAspectRatioOriginalToOnPageImage({width: originalImageSizes.width / imageSizes.width, height: originalImageSizes.height / imageSizes.height})
    }, [originalImageSizes, magnifierAreaSizes, imageSizes])
    useEffect(() => {
        if (!aspectRatioOriginalToMagnifierArea || !aspectRatioOriginalToOnPageImage || !magnifierAreaSizes.width || !magnifierAreaSizes.height) return;

        setBackgroundWidth( magnifierAreaSizes.width * approximation * (aspectRatioOriginalToMagnifierArea.width / aspectRatioOriginalToOnPageImage.width) );
        setBackgroundHeight( magnifierAreaSizes.height * approximation * (aspectRatioOriginalToMagnifierArea.height / aspectRatioOriginalToOnPageImage.height) );
        setBackgroundPositionX( magnifierAreaSizes.left * approximation );
        setBackgroundPositionY( magnifierAreaSizes.top * approximation );
    }, [aspectRatioOriginalToMagnifierArea, aspectRatioOriginalToOnPageImage])

    if (!aspectRatioOriginalToMagnifierArea || !aspectRatioOriginalToOnPageImage || !magnifierSizes
        || !coefficientToDesiredSize)
        return null;

    return createPortal(
        <div style={{
            display: isActive ? "block" : "none",
            backgroundColor: "white", position: "absolute", left: "40vw", top: "20vh",
            width: magnifierSizes.width * coefficientToDesiredSize,
            height: magnifierSizes.height * coefficientToDesiredSize,
            background: `url(${imageSrc})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${backgroundWidth * coefficientToDesiredSize}px ${backgroundHeight * coefficientToDesiredSize}px`,
            backgroundPositionX: `${-backgroundPositionX * coefficientToDesiredSize}px`,
            backgroundPositionY: `${-backgroundPositionY * coefficientToDesiredSize}px`
        }}/>, document.body
    );
};

export default ImageMagnifierArea;