using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Reflection.PortableExecutable;

namespace samatAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class VirtualMachineController : ControllerBase
    {
        private string ipmachine;
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
        /// <param name="command">Wype³nij polecenie do uruchomienia</param>
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
        /// Wyœwietla system plików na maszynie wirutalnej z Androidem
        /// </summary>
        [HttpGet("ShowFileSystem")]
        public async Task<string> ShowFileSystem(int machine = 1)
        {
            ipmachine = machine == 1 ? "192.168.199.161" : "192.168.199.167";
            await Exec("adb disconnect");
            var connect = await Exec($"adb connect {ipmachine}");
            var before = await Exec("adb shell  \"find /data -print | sort | sed 's;[^/]*/;|---;g;s;---|; |;g' > /mnt/sdcard/Download/info_after.txt\"");
            var ret = await Exec("adb shell diff /mnt/sdcard/Download/info_before.txt /mnt/sdcard/Download/info_after.txt");
            var disconnect = await Exec($"adb disconnect {ipmachine}");
            return string.Join(Environment.NewLine, ret.Output, ret.Errors);
        }

        [HttpGet("ShowProxy")]
        public async Task<string> ShowProxy(int machine = 1)
        {
            ipmachine = machine == 1 ? "192.168.199.161" : "192.168.199.167";
            //var ret = await Exec("cat /var/log/squid/access.log | grep '192.168.199.158' | tail -n 1000 ");
            //var ret = await Exec("cat /home/vm/access1.log");
            var ret = (await System.IO.File.ReadAllTextAsync("/var/log/squid/access.log")).Split(Environment.NewLine).Where(x => x.Contains(ipmachine));
            //return string.Join(Environment.NewLine, ret.Output, ret.Errors);
            return string.Concat(ret.Skip(Math.Max(0, ret.Count() - 1000)));
        }

        [HttpGet("ShowPermissions")]
        public async Task<string> ShowPermissions(int machine=1)
        {
            ipmachine = machine == 1 ? "192.168.199.161" : "192.168.199.167";
            var package = await Exec("aapt dump badging /home/vm/virus.apk | grep \"package: name='\" | sed -E \"s/.*package: name='([^']*)'.*/\\1/\"");
            await Exec("adb disconnect");
            var connect = await Exec($"adb connect {ipmachine}");
            var permissions = await Exec($"adb shell dumpsys package {package.Output}");
            var ret = permissions.Output.Split(Environment.NewLine).Select(x => x.Split(':').First().Trim()).Where(x => x.StartsWith("android.permission")).Distinct();
            var disconnect = await Exec($"adb disconnect {ipmachine}");
            return string.Join(Environment.NewLine, string.Join(Environment.NewLine,ret), permissions.Errors);

        }


        /// <summary>
        /// Instalowanie APK
        /// </summary>

        private async Task<string> InstallApk()
        {
            await Exec("adb disconnect");
            var connect = await Exec($"adb connect {ipmachine}");
            await Exec("adb root");
            var before = await Exec("adb shell  \"find /data -print | sort | sed 's;[^/]*/;|---;g;s;---|; |;g' > /mnt/sdcard/Download/info_before.txt\"");
            var ret = await Exec("adb install /home/vm/virus.apk");

            var disconnect = await Exec($"adb disconnect {ipmachine}");
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
        public async Task<IActionResult> OnPostUploadAsync(IFormFile formFile, int machine=1)
        {
            ipmachine = machine == 1 ? "192.168.199.161" : "192.168.199.167";
            if (formFile == null || formFile.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }


            using (var stream = new FileStream("/home/vm/virus.apk", FileMode.Create))
            {
                await formFile.CopyToAsync(stream);
            }
            var install = await InstallApk();


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
        /// Uruchamia maszyne wirtualn¹
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
        /// Zatrzymuje maszyne wirtualn¹
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
