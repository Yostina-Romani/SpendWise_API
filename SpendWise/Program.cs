using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SpendWise.Data;
using SpendWise.Models;
using SpendWise.Services;
using SpendWise.Services.Interfaces;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// =========================
// Services
// =========================

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// =========================
// Database
// =========================

var connectionString =
    builder.Configuration.GetConnectionString("DefaultConnection");

if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException(
        "Database connection string 'DefaultConnection' is not configured."
    );
}

builder.Services.AddDbContext<dbcontext>(options =>
    options.UseSqlServer(connectionString)
);


// =========================
// Identity
// =========================

builder.Services
    .AddIdentityCore<Applicationuser>()
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<dbcontext>()
    .AddDefaultTokenProviders()
    .AddSignInManager();


// =========================
// JWT Configuration
// =========================

var jwtKey = builder.Configuration["jwt:key"];
var jwtIssuer = builder.Configuration["jwt:issuer"];
var jwtAudience = builder.Configuration["jwt:audience"];

if (string.IsNullOrWhiteSpace(jwtKey))
{
    throw new InvalidOperationException(
        "JWT key is not configured."
    );
}

if (string.IsNullOrWhiteSpace(jwtIssuer))
{
    throw new InvalidOperationException(
        "JWT issuer is not configured."
    );
}

if (string.IsNullOrWhiteSpace(jwtAudience))
{
    throw new InvalidOperationException(
        "JWT audience is not configured."
    );
}


// =========================
// Authentication
// =========================

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme =
            JwtBearerDefaults.AuthenticationScheme;

        options.DefaultChallengeScheme =
            JwtBearerDefaults.AuthenticationScheme;

        options.DefaultSignInScheme =
            IdentityConstants.ExternalScheme;
    })

    // JWT
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,

                ValidIssuer = jwtIssuer,
                ValidAudience = jwtAudience,

                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(jwtKey)
                    ),

                ClockSkew = TimeSpan.FromMinutes(1)
            };
    })

    // External authentication cookie
    .AddCookie(IdentityConstants.ExternalScheme)

    // Google
    .AddGoogle(options =>
    {
        options.ClientId =
            builder.Configuration[
                "Authentication:Google:ClientId"
            ] ?? throw new InvalidOperationException(
                "Google ClientId is not configured."
            );

        options.ClientSecret =
            builder.Configuration[
                "Authentication:Google:ClientSecret"
            ] ?? throw new InvalidOperationException(
                "Google ClientSecret is not configured."
            );

        options.CallbackPath =
            "https://spendwise-api.runasp.net/api/Auth/google-callback";
    });


// =========================
// Authorization
// =========================

builder.Services.AddAuthorization();


// =========================
// CORS
// =========================

var frontendUrl =
    builder.Configuration["Frontend:Url"];

if (string.IsNullOrWhiteSpace(frontendUrl))
{
    throw new InvalidOperationException(
        "Frontend URL is not configured."
    );
}

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy
            .WithOrigins(frontendUrl)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});


// =========================
// Application Services
// =========================

builder.Services.AddScoped<IEmailservice, Emailservice>();

builder.Services.AddScoped<ITokenService, TokenService>();

builder.Services.AddScoped<IProfileService, ProfileService>();

builder.Services.AddScoped<IBudgetService, BudgetService>();


// =========================
// Build Application
// =========================

var app = builder.Build();


// =========================
// Seed Identity
// =========================

using (var scope = app.Services.CreateScope())
{
    var roleManager =
        scope.ServiceProvider
            .GetRequiredService<RoleManager<IdentityRole>>();

    var userManager =
        scope.ServiceProvider
            .GetRequiredService<UserManager<Applicationuser>>();

    await IdentitySeeder.RoleIsentityAsync(
        roleManager,
        userManager
    );
}


// =========================
// Swagger
// Development only
// =========================

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();

    app.UseSwaggerUI();
}


// =========================
// Middleware
// =========================

// HTTPS
app.UseHttpsRedirection();

// Static Files
app.UseStaticFiles();

// CORS
app.UseCors("FrontendPolicy");

// Authentication
app.UseAuthentication();

// Authorization
app.UseAuthorization();

// Controllers
app.MapControllers();


// =========================
// Run
// =========================

app.Run();