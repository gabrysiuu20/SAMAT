# Ten projekt zakłada, że pobrałeś pliki BlissOS oraz Android-x86 dla architektury x86_64 w formacie ISO.

# Uruchom wirtualizację i hugepages na serwerze
sudo sed -i 's/^GRUB_CMDLINE_LINUX_DEFAULT/#&/' /etc/default/grub
sudo bash -c 'cat >> /etc/default/grub << EOF
GRUB_CMDLINE_LINUX_DEFAULT="quiet intel_iommu=on iommu=pt hugepagesz=2M kvm.ignore_msrs=1 kvm.report_ignored_msrs=0"
EOF'
sudo update-grub
sudo update-initramfs -u

sudo bash -c 'cat >> /etc/fstab << EOF
hugetlbfs /hugepages hugetlbfs mode=1770,gid=64055 0 0
EOF'

sudo bash -c 'cat >> /etc/fstab << EOF
vm.nr_overcommit_hugepages = 24000
vm.hugetlb_shm_group = 64055
EOF'

sudo reboot

# Uruchom websockify
sudo podman run --detach --restart always -it -p 7000:80 docker.io/kamehb/websockify 80 10.88.0.1:5900
sudo podman run --detach --restart always -it -p 7001:80 docker.io/kamehb/websockify 80 10.88.0.1:5902

# Uruchom maszyny wirtualne
sudo virsh create AndroidUAM.xml
sudo virsh create BlissUAM.xml

# Wygeneruj nowy certyfikat CA, do SSL bumpingu
sudo openssl req -new -newkey rsa:2048 -days 365 -nodes -x509 -keyout squidCA.pem -out squidCA.pem

# Przekonwertuj certyfikat CA
sudo openssl x509 -in squidCA.pem -outform DER -out squid.der

# Stwórz bazę certyfikatów do SSL bumpingu
sudo /usr/lib/squid/security_file_certgen -c -s /var/lib/squid/ssl_db -M 20MB

# Dodaj konfigurację SSL bumpingu do Squid
sudo bash -c 'echo >> /etc/squid/squid.conf < EOF
http_port 3128 ssl-bump generate-host-certificates=on dynamic_cert_mem_cache_size=4MB cert=/etc/squid/squidCA.pem
acl all src all
http_access allow all
EOF'

# Uruchom ponownie Squid
sudo service squid restart


