using Microsoft.AspNetCore.SignalR;
namespace WhiteboardApi
{
	public class WhiteboardHub: Hub
	{
		public async Task JoinRoom (string roomId)
		{
			await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
			await Clients.Caller.SendAsync("JoinedRoom", roomId);
		}
	}
}
