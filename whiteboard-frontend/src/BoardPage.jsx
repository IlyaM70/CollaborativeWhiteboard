import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { connection } from "../socket";
import CanvasBoard from "./CanvasBoard";

export default function BoardPage() {

  const {roomId} = useParams();
  const navigate = useNavigate();
  
  const [receivedDrawing, setReceivedDrawing] = useState(null);
  const [receivedClear, setReceivedClear] = useState(0);
  const [connectionState, setConnectionState] = useState(connection.state);
  const [newRoomId, setNewRoomId] = useState("");


  // Effect to handle SignalR connection and events
  useEffect(() => {
    async function start() {
      try {
        await connection.start();

        setConnectionState(connection.state);

        connection.onreconnecting(() => {
          setConnectionState(connection.state);          
        });

        connection.onreconnected(() => {
          setConnectionState(connection.state);
        });

        connection.onclose(() => {
          setConnectionState(connection.state);
        });

        connection.on("ReceiveDrawing", (drawingEvent) => {          
          setReceivedDrawing(drawingEvent);
        });

        connection.on("ReceiveClear", () => {          
          setReceivedClear((prev) => prev + 1);
        });

        await connection.invoke("JoinRoom", roomId);   

        
      } catch (err) {
        console.error("Connection error:", err);
      }
    }

    start();
  }, [roomId]);

  ///////////////////

  function onDrawingComplete(drawingEvent) {    
    connection.invoke("SendDrawing", roomId, drawingEvent);
  }

  function onClearCanvas() {    
    connection.invoke("ClearBoard", roomId);
  }

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