
# SAMAT - Secure Android Malware Analysis Tool

Aplikacja SAMAT umożliwia łatwe utworzenie jednorazowej maszyny wirtualnej, a następnie zainstalowanie w maszynie pliku APK i jego przeanalizowanie w zakresie analizy sygnatur, zmian w plikach oraz danych przesyłanych przez sieć.

## Funkcjonalności

• Łatwe tworzenie jednorazowej maszyny wirtualnej (piaskownicy) za pośrednictwem Internetu
• Przekazywanie obrazu na żywo z maszyny wirtualnej do przeglądarki
• Możliwość wgrywania plików do piaskownicy
• Podstawowy nadzór nad strukturą systemu plików
• Podstawowy nadzór nad danymi przesyłanymi przez sieć

## Instalacja

1. Sklonuj repozytorium
2. Zainstaluj wymagane biblioteki:
   \`\`\`
   npm install
   \`\`\`
3. Zainstaluj narzędzia administracyjne oraz obsługę maszyn wirtualnych i kontenerów:
   \`\`\`
   sudo apt install cockpit cockpit-machines cockpit-podman cockpit-networkmanager podman-compose cockpit-pcp nfs-common redir squid-openssl -y
   \`\`\`
4. Uruchom aplikację:
   \`\`\`
   npm start
   \`\`\`

## Konfiguracja Serwera

### Pobierz Pliki ISO

Ten projekt zakłada, że pobrałeś pliki BlissOS oraz Android-x86 dla architektury x86_64 w formacie ISO.

### Uruchom wirtualizację i hugepages na serwerze

Dodaj następujące komendy do konfiguracji systemu, aby włączyć wirtualizację i hugepages:

\`\`\`
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
\`\`\`

### Uruchom websockify

Aby uruchomić websockify, wykonaj poniższe komendy:

\`\`\`
sudo podman run --detach --restart always -it -p 7000:80 docker.io/kamehb/websockify 80 10.88.0.1:5900
sudo podman run --detach --restart always -it -p 7001:80 docker.io/kamehb/websockify 80 10.88.0.1:5902
\`\`\`

### Uruchom maszyny wirtualne

Aby uruchomić maszyny wirtualne, wykonaj poniższe komendy:

\`\`\`
sudo virsh create AndroidUAM.xml
sudo virsh create BlissUAM.xml
\`\`\`

### Wygeneruj nowy certyfikat CA, do SSL bumpingu

Aby wygenerować nowy certyfikat CA, wykonaj poniższą komendę:

\`\`\`
sudo openssl req -new -newkey rsa:2048 -days 365 -nodes -x509 -keyout squidCA.pem -out squidCA.pem
\`\`\`

### Przekonwertuj certyfikat CA

Aby przekonwertować certyfikat CA, wykonaj poniższą komendę:

\`\`\`
sudo openssl x509 -in squidCA.pem -outform DER -out squid.der
\`\`\`

### Stwórz bazę certyfikatów do SSL bumpingu

Aby stworzyć bazę certyfikatów do SSL bumpingu, wykonaj poniższą komendę:

\`\`\`
sudo /usr/lib/squid/security_file_certgen -c -s /var/lib/squid/ssl_db -M 20MB
\`\`\`

### Dodaj konfigurację SSL bumpingu do Squid

Aby dodać konfigurację SSL bumpingu do Squid, wykonaj poniższą komendę:

\`\`\`
sudo bash -c 'echo >> /etc/squid/squid.conf << EOF
http_port 3128 ssl-bump generate-host-certificates=on dynamic_cert_mem_cache_size=4MB cert=/etc/squid/squidCA.pem
acl all src all
http_access allow all
EOF'
\`\`\`

### Uruchom ponownie Squid

Aby uruchomić ponownie Squid, wykonaj poniższą komendę:

\`\`\`
sudo service squid restart
\`\`\`

## Autorzy

Filip Sroczyński
Michał Malinowski
Gabriel Rebelski
Michał Wnuk
