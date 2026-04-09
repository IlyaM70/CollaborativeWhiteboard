using Microsoft.OpenApi.Models;
using WhiteboardApi;

var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services.AddControllers();

// SignalR
builder.Services.AddSignalR();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
	c.SwaggerDoc("v1", new OpenApiInfo
	{
		Title = "Whiteboard API",
		Version = "v1"
	});
});

// CORS (React Vite)
builder.Services.AddCors(options =>
{
	options.AddPolicy("client", policy =>
	{
		policy
			.WithOrigins("http://localhost:5173")
			.AllowAnyHeader()
			.AllowAnyMethod()
			.AllowCredentials();
	});
});

var app = builder.Build();

// Dev tooling
if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

app.UseCors("client");

app.UseRouting();

// SignalR hub
app.MapHub<WhiteboardHub>("/whiteboardHub");

// controllers
app.MapControllers();

app.Run();