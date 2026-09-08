import { useEffect, useState } from "react";
import { connection } from "../socket";
import CanvasBoard from "./CanvasBoard";

export default function BoardPage({ roomId = "test-room" }) {

  const [receivedDrawing, setReceivedDrawing] = useState(null);

  useEffect(() => {
    async function start() {
      try {
        await connection.start();
        console.log("Connected to SignalR");

        connection.on("JoinedRoom", (room) => {
          console.log("Joined room:", room);
        });

        connection.on("ReceiveDrawing", (drawingEvent) => {
          console.log("Received drawing:", drawingEvent);
          setReceivedDrawing(drawingEvent);
        });

        await connection.invoke("JoinRoom", roomId);     

        
      } catch (err) {
        console.error("Connection error:", err);
      }
    }

    start();
  }, [roomId]);

  function onDrawingComplete(drawingEvent) {
    console.log("Sending drawing event:", drawingEvent);
    connection.invoke("SendDrawing", roomId, drawingEvent);
  }

    return (
    <div>
      <h1>Whiteboard</h1>
      <CanvasBoard onDrawingComplete={onDrawingComplete} receivedDrawing={receivedDrawing} />
    </div>
  );
}