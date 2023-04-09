import React, { useEffect, useRef, useState } from "react";
import "../assets/css/Canva.css"

import FooterActionsBar from "./Footer";

const pixel_size = 10;

const Canva = () => {

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [pixelPlaceHolderData, setPixelPlaceHolderData] = useState({
    x: null,
    y: null,
    canvas_x: null,
    canvas_y: null,
    height: null,
    width: null,
    display: false
  })
  const [color, setColor] = useState("#000000")
  const [canvasScale, setCanvasScale] = useState(1)
  const [canvasMargins, setCanvasMargins] = useState({
    top: 0,
    left: 0
  })
  const [mouseScroll, setMouseScroll] = useState({
    x: 0,
    y: 0
  })
  const [mouseDown, setMouseDown] = useState(false)

  useEffect(() => {
    updatePixelPlaceholder()
  }, [canvasScale, canvasMargins])

  function updatePixelPlaceholder() {
    const canvasElPosition = canvasRef.current.getBoundingClientRect()

    const pixel_size = canvasElPosition.height / 100

    const {pixel_x, pixel_y} = getPixelCoordsOnCanvas({x: (window.innerWidth / 2) - ((window.innerWidth / 2) % pixel_size), y:(window.innerHeight / 2) - ((window.innerHeight / 2) % pixel_size)})

    setPixelPlaceHolderData(
      {
        x: getPixelCoordsOnCanvas({x: (window.innerWidth / 2), y: (window.innerHeight / 2), pixel_size}).pixel_x + (canvasElPosition.x % pixel_size),
        y: getPixelCoordsOnCanvas({x: (window.innerWidth / 2), y: (window.innerHeight / 2), pixel_size}).pixel_y + (canvasElPosition.y % pixel_size),
        canvas_x: pixel_x,
        canvas_y: pixel_y,
        height: pixel_size,
        width: pixel_size,
        display: canvasScale > 1.4 ? true : false
      }
    )
  }

  function drawPixel({x, y}: {x: number, y: number}) {
    const ctx = canvasRef.current.getContext("2d")

    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(x, y, pixel_size, pixel_size);
    ctx.fill();
  }

  function getPixelCoordsOnCanvas({x, y, pixel_size = 10}: {x: number, y: number, pixel_size?: number}) {
    const canvasElPosition = canvasRef.current.getBoundingClientRect()

    const top = canvasElPosition.height - canvasElPosition.bottom
    const left = canvasElPosition.width - canvasElPosition.right

    let x_coords = (x / canvasScale) + (left / canvasScale)
    let y_coords = (y / canvasScale) + (top / canvasScale)

    let pixel_x = x_coords - ((x_coords % pixel_size))
    let pixel_y = y_coords - ((y_coords % pixel_size))

    return {pixel_x, pixel_y}
  }


  function setPixelOnCanva({x, y}: {x: number, y: number}) {
    const {pixel_x, pixel_y} = getPixelCoordsOnCanvas({x, y})

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
      if (canvasScale <= 0.7) return
      setMouseScroll(scroll_origin)
      setCanvasScale((cCanvasScale) => {
        const newCanvasScale = Math.round((cCanvasScale -= 0.1) * 10) / 10
        return newCanvasScale
      })
    } else {
      if (canvasScale >= 2) return
      setMouseScroll(scroll_origin)
      setCanvasScale((cCanvasScale) => {
        const newCanvasScale = Math.round((cCanvasScale += 0.1) * 10) / 10
        return newCanvasScale
      })
    }
  }

  function handleMove(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    if (!mouseDown) return

    setCanvasMargins((cCanvasMargins) => {
      return {
        top: cCanvasMargins.top + e.movementY,
        left: cCanvasMargins.left + e.movementX
      }
    })

  }


  return (
    <div className="canva">
      <div className="location-container">
        <div className="location-coords">{`(${pixelPlaceHolderData.canvas_x / 10}, ${pixelPlaceHolderData.canvas_y / 10})`}</div>
        <div className="location-zoom">{Math.round(canvasScale * 10) / 10}x</div>
      </div>
      <div className="crosshair-container" style={
        {
          top: pixelPlaceHolderData.y,
          left: pixelPlaceHolderData.x,
          height: `${pixelPlaceHolderData.height}px`,
          width: `${pixelPlaceHolderData.width}px`,
          display: pixelPlaceHolderData.display ? "flex" : "flex"
        }
      }>
        <div className="bottom-borders"></div>
      </div>
      <div className="container">
        <canvas
          ref={canvasRef}
          height="1000"
          width="1000"
          onMouseDown={() => { setMouseDown(true) }} 
          onMouseUp={() => { setMouseDown(false) }}
          onMouseLeave={() => { setMouseDown(false) }}
          onMouseMove={handleMove}
          onWheel={handleScroll}
          style={{transform: `scale(${canvasScale})`, transformOrigin: `${mouseScroll.x}px ${mouseScroll.y}px`, marginTop: canvasMargins.top, marginLeft: canvasMargins.left}}
        ></canvas>
      </div>
      <FooterActionsBar color={color} setColor={setColor} setPixel={setPixelOnCanva} selectedPixelData={pixelPlaceHolderData} />
    </div>
  );
};

export default Canva;