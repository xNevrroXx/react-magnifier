import React, {FC, useEffect, useState} from 'react';
import {createPortal} from "react-dom";
// own modules
import {useOriginalImageSizes} from "../hooks/useOriginalImageSizes";

type TSizes = {width: number, height: number};
interface IImageMagnifier {
    isActive: boolean,
    imageSrc: string,
    imageSizes: TSizes,
    left: string,
    top: string,
    approximation?: number,
    magnifierAreaSizes: {width: number, height: number, left: number, top: number},
    maxLengthSide?: number
}

const ApproximateArea: FC<IImageMagnifier> = ({imageSrc, imageSizes, magnifierAreaSizes, approximation = 3, maxLengthSide = 500, isActive, left, top}) => {
    const originalImageSizes = useOriginalImageSizes(imageSrc);
    const [coefficientToDesiredSize, setCoefficientToDesiredSize] = useState<number>(1); // used to bring the width and height to the desired size(maxLengthSide)
    const [approximateAreaSizes, setApproximateAreaSizes] = useState<TSizes | null>(null);
    const [backgroundWidth, setBackgroundWidth] = useState<number>(0);
    const [backgroundHeight, setBackgroundHeight] = useState<number>(0);
    const [backgroundPositionX, setBackgroundPositionX] = useState<number>(0);
    const [backgroundPositionY, setBackgroundPositionY] = useState<number>(0);
    const [aspectRatioOriginalToMagnifierArea, setAspectRatioOriginalToMagnifierArea] = useState<TSizes | null>(null); // aspect ratio magnifier are on the image to the original sizes of the image
    const [aspectRatioOriginalToOnPageImage, setAspectRatioOriginalToOnPageImage] = useState<TSizes | null>(null); // aspect ratio image on the page to the original sizes of the image

    useEffect(() => {
        // console.log("magnifierAreaSizes: ", magnifierAreaSizes);
        if (!magnifierAreaSizes.width || !magnifierAreaSizes.height) return;

        setApproximateAreaSizes({
            width: magnifierAreaSizes.width * approximation,
            height: magnifierAreaSizes.height * approximation
        });
    }, [magnifierAreaSizes, approximation])
    useEffect(() => {
        if (!approximateAreaSizes) return;

        let coefficientToDesiredSize: number;
        if (approximateAreaSizes.width >= approximateAreaSizes.height) {
            coefficientToDesiredSize = maxLengthSide / approximateAreaSizes.width;
        }
        else {
            coefficientToDesiredSize = maxLengthSide / approximateAreaSizes.height;
        }

        setCoefficientToDesiredSize(coefficientToDesiredSize);
    }, [approximateAreaSizes, maxLengthSide])
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

    // console.log(coefficientToDesiredSize)
    if (!aspectRatioOriginalToMagnifierArea || !aspectRatioOriginalToOnPageImage || !approximateAreaSizes || !coefficientToDesiredSize)
        return null;

    return createPortal(
        <div style={{
            display: isActive ? "block" : "none",
            position: "absolute",
            left: left,
            top: top,
            width: approximateAreaSizes.width * coefficientToDesiredSize,
            height: approximateAreaSizes.height * coefficientToDesiredSize,
            background: `url(${imageSrc})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${backgroundWidth * coefficientToDesiredSize}px ${backgroundHeight * coefficientToDesiredSize}px`,
            backgroundPositionX: `${-backgroundPositionX * coefficientToDesiredSize}px`,
            backgroundPositionY: `${-backgroundPositionY * coefficientToDesiredSize}px`
        }}/>, document.body
    );
};

export default ApproximateArea;