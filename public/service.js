// urlB64ToUint8Array adalah fungsi untuk mengkodedata ke base64 public key
// untuk buffer Array yang dibutuhkan untuk opsi subscription
const urlB64ToUint8Array = base64String => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
    const rawData = atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  // fungsi saveSubscription akan menyimpan subscription pada backend
const saveSubscription = async subscription => {
    const SERVER_URL = 'http://localhost:8080/save-subscription'
    const response = await fetch(SERVER_URL, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    })
    return response.json()
  }

  self.addEventListener('activate', async () => {
    // Fungsi ini dipanggil jika services worker aktif
    console.log('activated')
    try {
      const applicationServerKey = urlB64ToUint8Array(
        'BKe7QVrXqizkTe63HuKDOWAEwlty0T5QKtAXIMEITgYh84PWN95SkLicTZI-UREozAL3Kqtd5uBUYR8vMFvUbXM'
      )
      const options = { applicationServerKey, userVisibleOnly: true }
      const subscription = await self.registration.pushManager.subscribe(options)
      console.log('subscription', subscription)
        const response = await saveSubscription(subscription)
        console.log(response)
    } catch (err) {
        console.log('Error', err)
    }
  })

  //fungsi untuk push data dari server ke client side
  self.addEventListener('push', function(event) {
    if (event.data) {
      console.log("New Job Added! ", event.data.text());
      showLocalNotification("New Job Added!", event.data.text(),  self.registration);
    } else {
      console.log("Push event but no data");
    }
  });

  //untuk membuat interface localNotification
  const showLocalNotification = (title, body, swRegistration) => {
    const options = {
      body 
      // disini dapat menambahkan properties seperti icon, image, vibrate, dll.
    };
    swRegistration.showNotification(title, options);
  };