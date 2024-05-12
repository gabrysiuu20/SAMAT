using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using static System.Net.Mime.MediaTypeNames;

namespace samatAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class VirtualMachineController : ControllerBase
    {

        private readonly ILogger<VirtualMachineController> _logger;

        public VirtualMachineController(ILogger<VirtualMachineController> logger)
        {
            _logger = logger;
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

        [HttpGet("CopyFile")]

        public async Task<string> CopyFile()
        {
            var fileName = await Exec("cp /home/vm/test.txt /home/vm/test2.txt");


            return string.Join(Environment.NewLine, fileName.Output, fileName.Errors);
        }


        [HttpGet("StartVm")]

        public async Task<string> StartVirtualMachine()
        {
            // ps -ef | grep qemu-system-x86
                
            // Logic to start a virtual machine
            // This example assumes you have qemu-system-x86 installed and in the system PATH
            var fileName = await Exec("sudo virsh start AndroidUAM");

            return string.Join(Environment.NewLine, fileName.Output, fileName.Errors);
        }


        [HttpGet("StopVm")]

        public async Task<string> StopVirtualMachine()
        {

                // Logic to stop a virtual machine
                // This example assumes you have qemu-system-x86 installed and in the system PATH
                var fileName = await Exec("sudo virsh destroy AndroidUAM");

                return string.Join(Environment.NewLine, fileName.Output, fileName.Errors);

        }
    }
}
