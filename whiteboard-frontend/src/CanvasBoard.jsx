import { useRef, useEffect, useState } from "react";

export default function CanvasBoard({ roomId, onDrawingComplete, receivedDrawing, onClearCanvas, receivedClear }) {

  // Refs to manage canvas and drawing state
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const points = useRef([]);

  // State for color and thickness
  const [color, setColor] = useState("black");
  const [thickness, setThickness] = useState(2);

  // Effect to handle drawing received from other users
  useEffect(() => {
    // Do not draw if receivedDrawing is null or has no points
    if (!receivedDrawing || !receivedDrawing.points || receivedDrawing.points.length === 0) {
        return;
    }

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.beginPath();
    context.moveTo(receivedDrawing.points[0].x, receivedDrawing.points[0].y);
    context.strokeStyle = receivedDrawing.color;
    context.lineWidth = receivedDrawing.thickness;

    for (let i = 1; i < receivedDrawing.points.length; i++) {
        context.lineTo(receivedDrawing.points[i].x, receivedDrawing.points[i].y);
    }
    context.stroke();
    
  }, [receivedDrawing]);


//Everything to do with clearing the canvas

  function clearCanvas() {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
  // Effect to handle clear event received from other users
  useEffect(() => {
    if (receivedClear) {
      clearCanvas();
    }
  }, [receivedClear]);

  function handleClearCanvas() {
    clearCanvas();
    onClearCanvas(); // Notify parent component to send clear event to other users
  }

  useEffect(() => {
    clearCanvas();
  }, [roomId]);

////////////////////////////////////////////////////////
  function getPoint(event) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  function handleMouseDown(event) {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const point = getPoint(event);

    isDrawing.current = true;
    points.current.push(point);

    context.beginPath();
    context.moveTo(point.x, point.y);
  }

  function handleMouseMove(event) {
    if (!isDrawing.current) {
      return;
    }

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const point = getPoint(event);
    points.current.push(point);

    context.lineTo(point.x, point.y);
    context.strokeStyle = color;
    context.lineWidth = thickness;
    context.stroke();
  }

  function handleMouseUp() {
        if (!isDrawing.current) {
        return;
        }

        const drawingEvent = {
        type: "stroke",
        points: points.current,
        color: color,
        thickness: thickness,
        };

        console.log("Drawing complete:", drawingEvent);
        onDrawingComplete(drawingEvent);

        points.current = [];
        isDrawing.current = false;   

  }



  return (
    <>
    <div style={{ marginBottom: "20px" }}>
      <label>
        Color:
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </label>
      <label>
        Thickness:
        <input
          type="range"
          min="1"
          max="10"
          value={thickness}
          onChange={(e) => setThickness(parseInt(e.target.value))}
        />
      </label>
      <button style={{color: "white", backgroundColor: "red"}} onClick={handleClearCanvas}>
        Clear
      </button>
    </div>

    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      style={{ border: "1px solid black" }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
    </>
  );
}