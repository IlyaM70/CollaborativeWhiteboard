import { useEffect } from "react";
import { connection } from "../socket";

export default function BoardPage({ roomId = "test-room" }) {
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
        });

        await connection.invoke("JoinRoom", roomId);

        await connection.invoke("SendDrawing", roomId, {
          type: "stroke",
          points: [
            { x: 10, y: 20 },
            { x: 20, y: 30 },
            { x: 30, y: 40 }
          ],
          color: "black",
          thickness: 2
        });

        
      } catch (err) {
        console.error("Connection error:", err);
      }
    }

    start();
  }, [roomId]);

  return <div>Connected (check console)</div>;
}