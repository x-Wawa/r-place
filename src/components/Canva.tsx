import React, { useRef } from "react";
import "../assets/css/Canva.css"

const pixel_height = 10;
const pixel_width = 10;

const Canva = () => {

  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    let x_coords = e.clientX + left
    let y_coords = e.clientY + top

    let pixel_x = x_coords - ((x_coords % pixel_height))
    let pixel_y = y_coords - ((y_coords % pixel_width))

    drawPixel({x: pixel_x, y: pixel_y})
  }


  return (
    <div className="canva-container">
      <canvas
        ref={canvasRef}
        height="1000"
        width="1000"
        onClick={(e) => {
          setPixelOnCanva(e)
        }}
      ></canvas>
    </div>
  );
};

export default Canva;