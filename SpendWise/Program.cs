using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SpendWise.Data;
using SpendWise.Models;
using SpendWise.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// =========================
// Add services to the container
// =========================

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// =========================
// Database
// =========================

builder.Services.AddDbContext<dbcontext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

// =========================
// Identity
// =========================

builder.Services.AddIdentityCore<Applicationuser>().AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<dbcontext>().AddDefaultTokenProviders().AddSignInManager();

// =========================
// JWT Authentication
// =========================

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme =
        JwtBearerDefaults.AuthenticationScheme;

    options.DefaultChallengeScheme =
        JwtBearerDefaults.AuthenticationScheme;
    options.DefaultSignInScheme = IdentityConstants.ExternalScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,

        ValidIssuer = builder.Configuration["jwt:issuer"],
        ValidAudience = builder.Configuration["jwt:audience"],

        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(
                builder.Configuration["jwt:key"]!
            )
        )
    };
}).AddCookie(IdentityConstants.ExternalScheme).AddGoogle(options =>
{
    options.ClientId = builder.Configuration["Authentication:Google:ClientId"]!;
    options.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"]!;
    options.CallbackPath = "/api/Auth/google-callback";
});




// =========================
// Authorization
// =========================

builder.Services.AddAuthorization();

// =========================
// CORS
// =========================

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy
            .WithOrigins("http://127.0.0.1:5500")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

//email services
builder.Services.AddScoped<IEmailservice, Emailservice>();

var app = builder.Build();

// =========================
// Seed Identity
// =========================
using (var scope=app.Services.CreateScope())
{
    var rolemanager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var usermanager = scope.ServiceProvider.GetRequiredService<UserManager<Applicationuser>>();
    await IdentitySeeder.RoleIsentityAsync(rolemanager, usermanager);

}
// =========================
// Check JWT Key
// =========================

Console.WriteLine(
    $"JWT Key exists: {!string.IsNullOrEmpty(builder.Configuration["jwt:key"])}"
);

// =========================
// HTTP Request Pipeline
// =========================

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// CORS
app.UseCors("FrontendPolicy");

// HTTPS Redirection
// Temporarily disabled because we are testing on HTTP localhost
// app.UseHttpsRedirection();

// Authentication
app.UseAuthentication();

// Authorization
app.UseAuthorization();

app.UseStaticFiles();

// Controllers
app.MapControllers();
app.Run();