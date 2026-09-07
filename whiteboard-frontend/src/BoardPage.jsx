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

        await connection.invoke("JoinRoom", roomId);
      } catch (err) {
        console.error("Connection error:", err);
      }
    }

    start();
  }, [roomId]);

  return <div>Connected (check console)</div>;
}