using Microsoft.AspNetCore.SignalR;
using WhiteboardApi.Models;
namespace WhiteboardApi
{
	public class WhiteboardHub: Hub
	{
		public async Task JoinRoom (string roomId)
		{
			await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
			await Clients.Caller.SendAsync("JoinedRoom", roomId);
		}

		public async Task SendDrawing(string roomId, DrawingEvent drawingEvent)
		{
			await Clients.Group(roomId).SendAsync("ReceiveDrawing", drawingEvent);
		}
	}
}
