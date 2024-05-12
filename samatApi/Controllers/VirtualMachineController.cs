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
            // libvirt+   13211       1  8 May08 ?        05:40:57 /usr/bin/qemu-system-x86_64 -name guest=AndroidUAM,debug-threads=on -S -object {"qom-type":"secret","id":"masterKey0","format":"raw","file":"/var/lib/libvirt/qemu/domain-2-AndroidUAM/master-key.aes"} -blockdev {"driver":"file","filename":"/usr/share/OVMF/OVMF_CODE_4M.ms.fd","node-name":"libvirt-pflash0-storage","auto-read-only":true,"discard":"unmap"} -blockdev {"node-name":"libvirt-pflash0-format","read-only":true,"driver":"raw","file":"libvirt-pflash0-storage"} -blockdev {"driver":"file","filename":"/var/lib/libvirt/qemu/nvram/AndroidUAM_VARS.fd","node-name":"libvirt-pflash1-storage","auto-read-only":true,"discard":"unmap"} -blockdev {"node-name":"libvirt-pflash1-format","read-only":false,"driver":"raw","file":"libvirt-pflash1-storage"} -machine pc-q35-7.2,usb=off,vmport=off,smm=on,dump-guest-core=off,memory-backend=pc.ram,pflash0=libvirt-pflash0-format,pflash1=libvirt-pflash1-format -accel kvm -cpu host,migratable=on -global driver=cfi.pflash01,property=secure,value=on -m 6144 -object {"qom-type":"memory-backend-ram","id":"pc.ram","size":6442450944} -overcommit mem-lock=off -smp 2,maxcpus=4,sockets=1,dies=1,cores=2,threads=2 -uuid e105fcc8-878f-41e0-a742-ae9dc68355a4 -no-user-config -nodefaults -chardev socket,id=charmonitor,fd=35,server=on,wait=off -mon chardev=charmonitor,id=monitor,mode=control -rtc base=utc,driftfix=slew -global kvm-pit.lost_tick_policy=delay -no-hpet -no-shutdown -global ICH9-LPC.disable_s3=1 -global ICH9-LPC.disable_s4=1 -boot strict=on -device {"driver":"pcie-root-port","port":16,"chassis":1,"id":"pci.1","bus":"pcie.0","multifunction":true,"addr":"0x2"} -device {"driver":"pcie-root-port","port":17,"chassis":2,"id":"pci.2","bus":"pcie.0","addr":"0x2.0x1"} -device {"driver":"pcie-root-port","port":18,"chassis":3,"id":"pci.3","bus":"pcie.0","addr":"0x2.0x2"} -device {"driver":"pcie-root-port","port":19,"chassis":4,"id":"pci.4","bus":"pcie.0","addr":"0x2.0x3"} -device {"driver":"pcie-root-port","port":20,"chassis":5,"id":"pci.5","bus":"pcie.0","addr":"0x2.0x4"} -device {"driver":"pcie-root-port","port":21,"chassis":6,"id":"pci.6","bus":"pcie.0","addr":"0x2.0x5"} -device {"driver":"pcie-root-port","port":22,"chassis":7,"id":"pci.7","bus":"pcie.0","addr":"0x2.0x6"} -device {"driver":"pcie-root-port","port":23,"chassis":8,"id":"pci.8","bus":"pcie.0","addr":"0x2.0x7"} -device {"driver":"pcie-root-port","port":24,"chassis":9,"id":"pci.9","bus":"pcie.0","multifunction":true,"addr":"0x3"} -device {"driver":"pcie-root-port","port":25,"chassis":10,"id":"pci.10","bus":"pcie.0","addr":"0x3.0x1"} -device {"driver":"pcie-root-port","port":26,"chassis":11,"id":"pci.11","bus":"pcie.0","addr":"0x3.0x2"} -device {"driver":"pcie-root-port","port":27,"chassis":12,"id":"pci.12","bus":"pcie.0","addr":"0x3.0x3"} -device {"driver":"pcie-root-port","port":28,"chassis":13,"id":"pci.13","bus":"pcie.0","addr":"0x3.0x4"} -device {"driver":"pcie-root-port","port":29,"chassis":14,"id":"pci.14","bus":"pcie.0","addr":"0x3.0x5"} -device {"driver":"pcie-root-port","port":30,"chassis":15,"id":"pci.15","bus":"pcie.0","addr":"0x3.0x6"} -device {"driver":"pcie-pci-bridge","id":"pci.16","bus":"pci.7","addr":"0x0"} -device {"driver":"qemu-xhci","p2":15,"p3":15,"id":"usb","bus":"pci.2","addr":"0x0"} -device {"driver":"virtio-serial-pci","id":"virtio-serial0","bus":"pci.3","addr":"0x0"} -blockdev {"driver":"file","filename":"/var/lib/libvirt/images/AndroidUAM.qcow2","node-name":"libvirt-2-storage","auto-read-only":true,"discard":"unmap"} -blockdev {"node-name":"libvirt-2-format","read-only":false,"discard":"unmap","driver":"qcow2","file":"libvirt-2-storage","backing":null} -device {"driver":"virtio-blk-pci","bus":"pci.4","addr":"0x0","drive":"libvirt-2-format","id":"virtio-disk0","bootindex":1} -device {"driver":"ide-cd","bus":"ide.0","id":"sata0-0-0"} -netdev {"type":"tap","fd":"36","vhost":true,"vhostfd":"38","id":"hostnet0"} -device {"driver":"virtio-net-pci","netdev":"hostnet0","id":"net0","mac":"52:54:00:6a:ea:b1","bus":"pci.1","addr":"0x0"} -chardev pty,id=charserial0 -device {"driver":"isa-serial","chardev":"charserial0","id":"serial0","index":0} -chardev socket,id=charchannel0,fd=34,server=on,wait=off -device {"driver":"virtserialport","bus":"virtio-serial0.0","nr":1,"chardev":"charchannel0","id":"channel0","name":"org.qemu.guest_agent.0"} -chardev spicevmc,id=charchannel1,name=vdagent -device {"driver":"virtserialport","bus":"virtio-serial0.0","nr":2,"chardev":"charchannel1","id":"channel1","name":"com.redhat.spice.0"} -device {"driver":"usb-tablet","id":"input0","bus":"usb.0","port":"1"} -audiodev {"id":"audio1","driver":"spice"} -vnc 0.0.0.0:0,audiodev=audio1 -spice port=5901,addr=0.0.0.0,disable-ticketing=on,image-compression=off,seamless-migration=on -device {"driver":"virtio-vga","id":"video0","max_outputs":1,"bus":"pcie.0","addr":"0x1"} -device {"driver":"ich9-intel-hda","id":"sound0","bus":"pcie.0","addr":"0x1b"} -device {"driver":"hda-duplex","id":"sound0-codec0","bus":"sound0.0","cad":0,"audiodev":"audio1"} -device {"driver":"i6300esb","id":"watchdog0","bus":"pci.16","addr":"0x1"} -watchdog-action reset -chardev spicevmc,id=charredir0,name=usbredir -device {"driver":"usb-redir","chardev":"charredir0","id":"redir0","bus":"usb.0","port":"2"} -chardev spicevmc,id=charredir1,name=usbredir -device {"driver":"usb-redir","chardev":"charredir1","id":"redir1","bus":"usb.0","port":"3"} -device {"driver":"virtio-balloon-pci","id":"balloon0","bus":"pci.5","addr":"0x0"} -object {"qom-type":"rng-random","id":"objrng0","filename":"/dev/urandom"} -device {"driver":"virtio-rng-pci","rng":"objrng0","id":"rng0","bus":"pci.6","addr":"0x0"} -sandbox on,obsolete=deny,elevateprivileges=deny,spawn=deny,resourcecontrol=deny -msg timestamp=on
                
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
