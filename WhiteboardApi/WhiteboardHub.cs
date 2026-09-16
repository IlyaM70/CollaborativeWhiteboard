using Microsoft.AspNetCore.SignalR;
using WhiteboardApi.Models;
namespace WhiteboardApi
{
	/// <summary>
	/// SignalR hub responsible for real-time whiteboard communication.
	///
	/// Client → Server:
	/// - JoinRoom(roomId)
	/// - SendDrawing(roomId, drawingEvent)
	/// - ClearBoard(roomId)
	///
	/// Server → Client:
	/// - JoinedRoom(roomId)
	/// - ReceiveDrawing(drawingEvent)
	/// - ReceiveClear()
	///
	/// The MVP does not persist drawings. All whiteboard state exists only
	/// in connected clients' canvases.
	/// </summary>
	public class WhiteboardHub: Hub
	{
		/// <summary>
		/// Adds the current connection to a SignalR room.
		/// </summary>
		/// <param name="roomId">Identifier of the room to join.</param>
		public async Task JoinRoom (string roomId)
		{
			await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
			await Clients.Caller.SendAsync("JoinedRoom", roomId);
		}

		public async Task SendDrawing(string roomId, DrawingEvent drawingEvent)
		{
			await Clients.OthersInGroup(roomId).SendAsync("ReceiveDrawing", drawingEvent);
		}

		public async Task ClearBoard(string roomId)
		{
			await Clients.OthersInGroup(roomId).SendAsync("ReceiveClear");
		}
	}
}
