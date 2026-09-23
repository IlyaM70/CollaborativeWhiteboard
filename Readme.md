MVP Goal

A user can open the app, enter a room, draw on a canvas, 
and another user in the same room sees the drawing in real time.

Included

Single board per room
Canvas drawing (mouse only)
Real-time sync (WebSocket)
Room via URL (/board/:roomId)

Excluded

Auth
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

Backend

The backend is an ASP.NET Core application using SignalR for real-time
communication between users in the same whiteboard room.

SignalR API

Client → Server

JoinRoom(roomId)
    Adds the current connection to the specified room.

SendDrawing(roomId, drawingEvent)
    Broadcasts a drawing event to all users in the room.

ClearBoard(roomId)
    Broadcasts a clear event to all users in the room.

Server → Client

JoinedRoom(roomId)
    Confirms that the client joined the room.

ReceiveDrawing(drawingEvent)
    Delivers a drawing event from the room.

ReceiveClear()
    Tells clients to clear their canvas.

Persistence

The MVP does not use a database. Drawings exist only on the clients'
HTML canvas and are not restored when a user joins or refreshes the page.
