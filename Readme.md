MVP Goal

A user can open the app, enter a room, draw on a canvas, 
and another user in the same room sees the drawing in real time.

Included

Single board per room
Canvas drawing (mouse only)
Real-time sync (WebSocket)
Room via URL (/board/:roomId)
Random username (no auth)

Excluded

Persistence
Undo/redo
Tools (only pen)
Permissions

The contract between frontend and backend

DrawingEvent {
  type: "stroke",
  points: [{ x, y }],
  color: string,
  thickness: number
}

Events

JoinRoom(roomId)
ReceiveDrawing(drawingEvent)
SendDrawing(drawingEvent)