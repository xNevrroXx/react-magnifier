import React from "react";
// own modules
import ImageMagnifier from "./components/ImageMagnifier";

const imageSrc = "/img1.png";
function App() {
    return (
        <div className="App">
            <div style={{width: "50rem", height: "50rem", display: "flex", justifyContent: "center", alignItems: "center"}}>
                <div style={{width: "40rem", height: "40rem", display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <ImageMagnifier
                        imageSrc={imageSrc}
                        maxLengthSideApproximateArea={600}
                        maxHeightContent={600}
                        maxSizeMagnifierArea={{width: 200, height: 200}}
                        leftPositioningMagnifier="30vw"
                        topPositioningMagnifier="10vw"
                    />
                </div>
            </div>
        </div>
    )
}

export default App
