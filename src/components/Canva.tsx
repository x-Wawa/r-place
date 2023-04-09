import React, { useEffect, useRef, useState } from "react";
import "../assets/css/Canva.css"

const pixel_height = 10;
const pixel_width = 10;

const Canva = () => {

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [pixelPlaceHolderCoords, setPixelPlaceHolderCoords] = useState({
    x: null,
    y: null
  })

  const [canvasScale, setCanvasScale] = useState(1)
  const [mouseScroll, setMouseScroll] = useState({
    x: 0,
    y: 0
  })

  function updatePixelPlaceholder() {
    const canvasElPosition = canvasRef.current.getBoundingClientRect()

    const canvas_center = {
      x: canvasElPosition.width - canvasElPosition.right + (window.innerWidth / 2),
      y: canvasElPosition.height - canvasElPosition.bottom + (window.innerHeight / 2)
    }

    setPixelPlaceHolderCoords(canvas_center)

    return canvas_center
  }

  function drawPixel({x, y, color = "#000000"}: {x: number, y: number, color?: string}) {
    const ctx = canvasRef.current.getContext("2d")

    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 10, 10);
    ctx.fill();
  }

  function setPixelOnCanva(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {

    const canvasElPosition = e.currentTarget.getBoundingClientRect()

    const top = canvasElPosition.height - canvasElPosition.bottom
    const left = canvasElPosition.width - canvasElPosition.right

    let x_coords = (e.clientX / canvasScale) + (left / canvasScale)
    let y_coords = (e.clientY / canvasScale) + (top / canvasScale)

    let pixel_x = x_coords - ((x_coords % pixel_height))
    let pixel_y = y_coords - ((y_coords % pixel_width))

    drawPixel({x: pixel_x, y: pixel_y})
  }

  function handleScroll(e: React.WheelEvent<HTMLCanvasElement>) {
    const canvasElPosition = e.currentTarget.getBoundingClientRect()

    const top = canvasElPosition.height - canvasElPosition.bottom
    const left = canvasElPosition.width - canvasElPosition.right

    const scroll_origin = {
      x: e.clientX + left,
      y: e.clientY + top
    }
    
    if (e.deltaY > 0) {
      setMouseScroll(scroll_origin)
      setCanvasScale((cCanvasScale) => (cCanvasScale -= 0.1))
    } else {
      setMouseScroll(scroll_origin)
      setCanvasScale((cCanvasScale) => (cCanvasScale += 0.1))
    }
    updatePixelPlaceholder()
  }


  return (
    <>
      <div className="canva-location-container">
        <div className="canva-location-coords">{`(${Math.round(pixelPlaceHolderCoords.x / 10)}, ${Math.round(pixelPlaceHolderCoords.y / 10)})`}</div>
        <div className="canva-location-zoom">{Math.round(canvasScale * 10) / 10}x</div>
      </div>
      <div className="canva-container">
        <canvas
          ref={canvasRef}
          height="1000"
          width="1000"
          onClick={(e) => {
            setPixelOnCanva(e)
          }}
          onWheel={handleScroll}
          style={{transform: `scale(${canvasScale})`, transformOrigin: `${mouseScroll.x}px ${mouseScroll.y}px`}}
        ></canvas>
      </div>
    </>
  );
};

export default Canva;