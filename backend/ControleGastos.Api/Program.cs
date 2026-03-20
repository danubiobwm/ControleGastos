using Microsoft.EntityFrameworkCore;
using ControleGastos.Api.Data;
using ControleGastos.Api.Services;

var builder = WebApplication.CreateBuilder(args);



var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

if (string.IsNullOrEmpty(connectionString))
{
    throw new InvalidOperationException("ERRO: A ConnectionString 'DefaultConnection' não foi configurada corretamente.");
}

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));


builder.Services.AddScoped<IFinanceiroService, FinanceiroService>();

builder.Services.AddControllers();


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("DefaultPolicy", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

var globalLogger = app.Services.GetRequiredService<ILogger<Program>>();


app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Controle de Gastos v1");
    c.RoutePrefix = "swagger"; // Acessível em http://localhost:5000/swagger
});

app.UseCors("DefaultPolicy");
app.UseAuthorization();


using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var db = services.GetRequiredService<AppDbContext>();
    var migrationLogger = services.GetRequiredService<ILogger<Program>>();

    int retries = 5;
    while (retries > 0)
    {
        try
        {
            migrationLogger.LogInformation("Verificando banco de dados...");
            db.Database.Migrate();
            migrationLogger.LogInformation("Banco de dados pronto e migrado.");
            break;
        }
        catch (Exception ex)
        {
            retries--;
            migrationLogger.LogWarning(ex, $"Aguardando banco de dados... Tentativas restantes: {retries}");

            if (retries == 0)
            {
                migrationLogger.LogCritical("Não foi possível conectar ao banco de dados após várias tentativas.");
                throw;
            }
            Thread.Sleep(5000);
        }
    }
}

app.MapControllers();

globalLogger.LogInformation("API Controle de Gastos Residencial iniciada com sucesso!");

app.Run();