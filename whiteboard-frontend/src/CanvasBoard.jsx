import { useRef, useEffect } from "react";

export default function CanvasBoard({ onDrawingComplete, receivedDrawing }) {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const points = useRef([]);

  useEffect(() => {
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
    context.stroke();
  }

  function handleMouseUp() {
        if (!isDrawing.current) {
        return;
        }

        const drawingEvent = {
        type: "stroke",
        points: points.current,
        color: "black",
        thickness: 2,
        };

        console.log("Drawing complete:", drawingEvent);
        onDrawingComplete(drawingEvent);

        points.current = [];
        isDrawing.current = false;   

  }

  return (
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
  );
}