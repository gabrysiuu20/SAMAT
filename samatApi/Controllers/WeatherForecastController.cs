using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using static System.Net.Mime.MediaTypeNames;

namespace samatAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<WeatherForecastController> _logger;

        public WeatherForecastController(ILogger<WeatherForecastController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "GetWeatherForecast")]
        public IEnumerable<WeatherForecast> Get()
        {
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();
        }
        internal readonly struct Status
        {
            public string Errors { get;  }
            public string Output { get; }

            public Status(string? output = null, string? errors = null)
            {
                Errors = errors ?? string.Empty;
                Output = output ?? string.Empty;
            }
        }

        internal async Task<Status> Exec(string command)
        {
            var process = new Process();
            process.StartInfo.FileName = "/bin/bash";
            process.StartInfo.Arguments = string.Concat("-c \"", command.Replace("\"", "\\\""), "\"");
            process.StartInfo.UseShellExecute = false;
            process.StartInfo.RedirectStandardOutput = true;
            process.StartInfo.RedirectStandardError = true;
            process.Start();
            await process.WaitForExitAsync();
            return new Status(await process.StandardOutput.ReadToEndAsync(), await process.StandardError.ReadToEndAsync());
        }

        [HttpGet("HelloWorld")]
        public async Task<string> HelloWorld()
        {
            var connect = await Exec("adb connect 192.168.199.161");
            var ret = await Exec("adb shell ls");
            var disconnect = await Exec("adb disconnect 192.168.199.161");
            return string.Join(Environment.NewLine, ret.Output, ret.Errors);
        }
        [HttpPost("Upload")]

        public async Task<IActionResult> OnPostUploadAsync(IFormFile formFile)
        {


                if (formFile.Length > 0)
                {
                    var filePath = Path.GetTempFileName();

                    using (var stream = System.IO.File.Create(filePath))
                    {
                        await formFile.CopyToAsync(stream);
                    }
                }
         

            // Process uploaded files
            // Don't rely on or trust the FileName property without validation.

            return Ok();
        }
    }
}
