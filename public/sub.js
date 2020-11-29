//fungsi untuk mengecek apakah browser yang dipakai support service worker
const check = () => {
  if (!('serviceWorker' in navigator)) {
    throw new Error('No Service Worker support!')
  }
  if (!('PushManager' in window)) {
    throw new Error('No Push API Support!')
  }
}

//fungsi untuk register service worker dengan menggunakan fungsi di file service.js
const registerServiceWorker = async () => {
  const swRegistration = await navigator.serviceWorker.register('service.js')
  return swRegistration
}

//fungsi untuk memunculkan notification permission
const requestNotificationPermission = async () => {
  const permission = await window.Notification.requestPermission()
  // permission dapat dibagi menjadi tiga, yaitu 'granted', 'default', 'denied'
  // granted: user menyetujui request
  // default: user menutup jendela notification permission dengan mengklik x (close) 
  // denied: user menolak request
  if (permission !== 'granted') {
    throw new Error('Permission not granted for Notification')
  }
}

//fungsi untuk memunculkan notifikasi dan subscribe
const main = async () => {
  check()
  const swRegistration = await registerServiceWorker()
  const permission = await requestNotificationPermission()
  subscribe()
}

//fungsi untuk mengambil data channel pada halaman subscribe dan menampilkan data job list 
function subscribe() {
  var message = document.getElementById('message');
  var channel = document.getElementById('channel').value;
  var host = window.document.location.host.replace(/:.*/, '');
  var ws = new WebSocket('ws://' + host + ':8080');
  ws.onopen = function () {
      ws.send(JSON.stringify({
          request: 'SUBSCRIBE',
          message: '',
          channel: channel
      }));
      ws.onmessage = function(event){
          data = JSON.parse(event.data);
          message.innerHTML = data.message;
      };
  };  
}
