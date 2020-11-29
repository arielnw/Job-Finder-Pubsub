# PubSub
## About
Aplikasi PubSub ini memudahkan orang untuk mencari pekerjaan. Subscribers akan berlangganan suatu topic, kemudian jika Publisher menambahkan suatu pekerjaan terkait topic tersebut, subscribers akan mendapatkan notifikasi dan list pekerjaan di page Subscribers. Aplikasi PubSub ini menggunakan server Node/WS/Express dan WebSocket client API.
## Usage
1. Cara menjalankan server
```
npm install
npm install -g web-push
web-push generate-vapid-keys ( !!NOTE!! : generate vapid keys anda sendiri, kemudian ubah vapid keys di index.      js dan service.js)
node index.js
```
2. Buka localhost:8080/sub.html dan localhost:8080/pub.html
3. Pastikan telah unregister service workers pada localhost:8080/sub.html di Console browser section Application, lalu reload page
4. Pada halaman Subscribers, ketikkan topic yang diinginkan, lalu klik subscribe
5. Masukkan topic dan detail jobs pada Publisher, jika topic Publisher dan Subscribers sama, akan muncul pekerjaan baru pada Job List.
6. Tekan Ctrl + C untuk memutus server.
