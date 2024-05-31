
# SAMAT - Secure Android Malware Analysis Tool

Aplikacja SAMAT umożliwia łatwe utworzenie jednorazowej maszyny wirtualnej, a następnie zainstalowanie w maszynie pliku APK i jego przeanalizowanie w zakresie analizy sygnatur, zmian w plikach oraz danych przesyłanych przez sieć.

## Funkcjonalności

•	Łatwe tworzenie jednorazowej maszyny wirtualnej (piaskownicy) za pośrednictwem Internetu\
•	Przekazywanie obrazu na żywo z maszyny wirtualnej do przeglądarki\
•	Możliwość wgrywania plików do piaskownicy\
•	Podstawowy nadzór nad strukturą systemu plików\
•	Podstawowy nadzór nad danymi przesyłanymi przez sieć


## Instalacja

1. Sklonuj repozytorium
2. Zainstaluj wymagane biblioteki:
   ```
   npm install
   ```
3. Zainstaluj narzędzia administracyjne oraz obsługę maszyn wirtualnych i kontenerów
   ```
   sudo apt install cockpit cockpit-machines cockpit-podman cockpit-networkmanager podman-compose cockpit-pcp nfs-common redir -y
   ```
4. Uruchom aplikację:
    ```
    npm start
    ```

## Autorzy
Filip Sroczyński\
Michał Malinowski\
Gabriel Rebelski\
Michał Wnuk

## Licencja

[MIT](https://choosealicense.com/licenses/mit/)
