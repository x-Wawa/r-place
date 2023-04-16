import React from "react";
import "../assets/css/Footer.css"


const FooterActionsBar = ({color, setColor, setPixel, selectedPixelData}: {color: string, setColor: React.Dispatch<React.SetStateAction<string>>, setPixel: ({ x, y }: { x: number; y: number; }) => void, selectedPixelData: any}) => {


  return (
    <div className="footer-container">
      <div className="pixel-placer-container">
        <div
          className="place-pixel button"
          onClick={(e) => {
            e.currentTarget.classList.add("place-pixel-active")
            setPixel({x: selectedPixelData.x, y: selectedPixelData.y})
          }}
          onAnimationEnd={(e) => {
            e.currentTarget.classList.remove("place-pixel-active")
          }}
        >Place !</div>
        <input
          type="color"
          className="colors-picker button"
          value={color}
          onChange={(e) => {
          setColor(e.target.value)
        }}/>
      </div>
    </div>
  );
};

export default FooterActionsBar;