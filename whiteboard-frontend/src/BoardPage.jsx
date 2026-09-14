import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { connection } from "../socket";
import CanvasBoard from "./CanvasBoard";
import { useNavigate } from "react-router-dom";

export default function BoardPage() {

  const {roomId} = useParams();

  const [receivedDrawing, setReceivedDrawing] = useState(null);
  const [receivedClear, setReceivedClear] = useState(0);
  const [connectionState, setConnectionState] = useState(connection.state);


  // Effect to handle SignalR connection and events
  useEffect(() => {
    async function start() {
      try {
        await connection.start();
        console.log("Connected to SignalR");

        setConnectionState(connection.state);

        connection.onreconnecting(() => {
          setConnectionState(connection.state);
          console.log("Connection state changed:", connection.state);
        });

        connection.onreconnected(() => {
          setConnectionState(connection.state);
          console.log("Connection state changed:", connection.state);
        });

        connection.onclose(() => {
          setConnectionState(connection.state);
          console.log("Connection state changed:", connection.state);
        });

        connection.on("JoinedRoom", (room) => {
          console.log("Joined room:", room);
        });

        connection.on("ReceiveDrawing", (drawingEvent) => {
          console.log("Received drawing:", drawingEvent);
          setReceivedDrawing(drawingEvent);
        });

        connection.on("ReceiveClear", () => {
          console.log("Received clear event");
          setReceivedClear((prev) => prev + 1);
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

  function onClearCanvas() {
    console.log("Sending clear event");
    connection.invoke("ClearBoard", roomId);
  }

  const navigate = useNavigate();
  const [newRoomId, setNewRoomId] = useState("");
  function handleRoomChange() {
    if (newRoomId.trim() == "") return;

    navigate(`/board/${newRoomId}`);
  }


    return (
    <>
      <h1>Whiteboard</h1>
      <div>{connectionState}</div>
      <div>This is the room: {roomId}</div>
      <div>Connnected users: </div>
      <label>
        If you want to change the room, type a new room ID and press the button. This will create a new room if it doesn't exist.
        <input type="text" value={newRoomId} onChange={(e) => setNewRoomId(e.target.value)} />
        <button onClick = {handleRoomChange}>Change room</button>
      </label>
      <CanvasBoard
       roomId={roomId}
       onDrawingComplete={onDrawingComplete}
       receivedDrawing={receivedDrawing}
       onClearCanvas={onClearCanvas}
       receivedClear={receivedClear} />
    </>
  );
}