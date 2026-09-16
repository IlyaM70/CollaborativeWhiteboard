using Microsoft.OpenApi.Models;
using WhiteboardApi;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
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

// Allow the React client to communicate with the ASP.NET Core backend.
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

if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

app.UseCors("client");

app.MapHub<WhiteboardHub>("/whiteboardHub");

app.MapControllers();

app.Run();