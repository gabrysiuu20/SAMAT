using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

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
            public string Errors { get; }
            public string Output { get; }

            public Status(string? output = null, string? errors = null)
            {
                Errors = errors ?? string.Empty;
                Output = output ?? string.Empty;
            }
        }

        /// <summary>
        /// Uruchamia polecenia w bash.
        /// </summary>
        /// <param name="command">Wype�nij polecenie do uruchomienia</param>
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
        /// <summary>
        /// Wy�wietla system plik�w na maszynie wirutalnej z Androidem
        /// </summary>
        [HttpGet("ShowFileSystem")]
        public async Task<string> ShowFileSystem()
        {
            var connect = await Exec("adb connect 192.168.199.161");
            var before = await Exec("adb shell  \"find /data -print | sort | sed 's;[^/]*/;|---;g;s;---|; |;g' > /mnt/sdcard/Download/info_after.txt\"");
            var ret = await Exec("adb shell diff /mnt/sdcard/Download/info_before.txt /mnt/sdcard/Download/info_after.txt");
            var disconnect = await Exec("adb disconnect 192.168.199.161");
            return string.Join(Environment.NewLine, ret.Output, ret.Errors);
        }

        [HttpGet("ShowProxy")]
        public async Task<string> ShowProxy()
        {
            var ret = await Exec("cat /var/log/squid/access.log | grep '192.168.199.158' | tail -n 1000 ");
            return string.Join(Environment.NewLine, ret.Output, ret.Errors);

        }

        /// <summary>
        /// Wyświetla listę uprawnień do wybranego APK
        /// </summary>
        [HttpGet("ShowPermissions")]
        public async Task<string> ShowPermissions(string appName)
        {
            string trimAppName = appName.Trim();
            string pattern = "[^a-zA-Z0-9 ]";
            string result = System.Text.RegularExpressions.Regex.Replace(trimAppName, pattern, "");
            Console.WriteLine($"Your variable value: {result.Substring(0,5)}");
            var connect = await Exec("adb connect 192.168.199.161");
            var additional = await Exec($"adb shell pm list packages | grep -i {result.Substring(0,5)}");
            int dotIndicatingAppName = additional.Output.LastIndexOf('.');
            string ourApp = additional.Output.Substring(dotIndicatingAppName+1);      
            var ret = await Exec($"adb shell dumpsys package {ourApp} | grep granted=true -m 1000 | awk \'{{print $1}}\'");
            Console.WriteLine($"Your variable value: {ret.Output}");
            var disconnect = await Exec("adb disconnect 192.168.199.161");
            return string.Join(string.Empty, ret.Output.Trim(), ret.Errors);
        }
    
        /// <summary>
        /// Instalowanie APK
        /// </summary>
        private async Task<string> InstallApk(string appName)
        {
            var connect = await Exec("adb connect 192.168.199.161");
            await Exec("adb root");
            var before = await Exec("adb shell  \"find /data -print | sort | sed 's;[^/]*/;|---;g;s;---|; |;g' > /mnt/sdcard/Download/info_before.txt\"");
            var ret = await Exec($"adb install /home/vm/{appName}");
            Console.WriteLine($"Your variable value: {ret.Output}");
            var disconnect = await Exec("adb disconnect 192.168.199.161");
            return string.Join(Environment.NewLine, ret.Output, ret.Errors);
            //return before.Errors ;
        }
        /// <summary>
        /// Wgrywa plik apk na serwer
        /// </summary>
        /// <param name="formFile">Wybierz plik</param>
        [HttpPost("Upload")]
        [DisableRequestSizeLimit]
        //[RequestFormLimits(MultipartBodyLengthLimit = 209715200)]
        public async Task<IActionResult> OnPostUploadAsync(IFormFile formFile, string appName)
        {
            if (formFile == null || formFile.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }


            using (var stream = new FileStream($"/home/vm/{appName}", FileMode.Create))
            {
                await formFile.CopyToAsync(stream);
            }
            var install = await InstallApk(appName);


            return Ok(install);



        }

        /// <summary>
        /// Podmienia obraz dysku twardego maszyny wirtualnej
        /// </summary>
        [HttpGet("CopyFile")]

        public async Task<string> CopyFile()
        {
            await StopVirtualMachine();
            var fileName = await Exec("cp /home/vm/AndroidUAM.qcow2 /var/lib/libvirt/images/AndroidUAM.qcow2");
            await StartVirtualMachine();

            return string.Join(Environment.NewLine, fileName.Output, fileName.Errors);
        }

        /// <summary>
        /// Uruchamia maszyne wirtualn�
        /// </summary>
        [HttpGet("StartVm")]

        public async Task<string> StartVirtualMachine()
        {
            // ps -ef | grep qemu-system-x86

            // Logic to start a virtual machine
            // This example assumes you have qemu-system-x86 installed and in the system PATH
            var fileName = await Exec("sudo virsh start AndroidUAM");

            return string.Join(Environment.NewLine, fileName.Output, fileName.Errors);
        }

        /// <summary>
        /// Zatrzymuje maszyne wirtualn�
        /// </summary>
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
