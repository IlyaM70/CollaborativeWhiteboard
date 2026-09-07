namespace WhiteboardApi.Models
{
	public class DrawingEvent
	{
		public string Type { get; set; } = "";
		public List<Point> Points { get; set; } = [];
		public string Color { get; set; } = "";
		public double Thickness { get; set; }
	}

	public class Point
	{
		public double X { get; set; }
		public double Y { get; set; }
	}
}
