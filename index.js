const WebSocketServer = require('ws').Server;
const express = require('express');
const path = require('path');
const server = require('http').createServer();
const PubSubManager = require('./pubsub');
const bodyParser = require('body-parser');
const webpush = require('web-push')

const app = express();
const pubSubManager = new PubSubManager();

//menggunakan dummyDb untuk menyimpan data pekerjaan, hanya menyimpan selama server berjalan
const dummyDb = { subscription: null } 
const saveToDatabase = async subscription => {
  dummyDb.subscription = subscription
}

var messageAja = "some";

const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());
app.post('/save-subscription', async (req, res) => {
    console.log('save subscription')
    const subscription = req.body
    console.log('test' , req.body)
    await saveToDatabase(subscription) //untuk menyimpan subscription ke database
    console.log(dummyDb)
    res.json({ message: 'success' })
  })
 
//harus generate vapidKeys masing-masing  
const vapidKeys = {
    publicKey:
    'BKe7QVrXqizkTe63HuKDOWAEwlty0T5QKtAXIMEITgYh84PWN95SkLicTZI-UREozAL3Kqtd5uBUYR8vMFvUbXM',
    privateKey: '3k7E7DVmtzHB0x58Hv_lUDFZBWXKSGHVslgbua3MR28',
}

//Setting vapidKeys yang telah digenerate
webpush.setVapidDetails(
    'mailto:myuserid@email.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)

//fungsi untuk mengirim notifikasi ke subscribers
const sendNotification = (subscription, dataToSend='') => {
    try {
        console.log('end point', subscription.endpoint)
        webpush.sendNotification(subscription, dataToSend)
    } catch (error) {
        console.log(error)
    }
}

    //Untuk mengetes pengiriman notification
app.get('/send-notification', (req, res) => {
    if (dummyDb.subscription) {
        
    const subscription = dummyDb.subscription 
    //mendapatkan data subscription dari dummyDb
    const message = messageAja
    sendNotification(subscription, message)
    res.json({ message: 'message sent' })
    } else {
    res.json({ message: 'message cannot send' })
        
    }
})


//Untuk menampilkan notifikasi sesuai dengan job details yang dikirimkan
app.use(express.static(path.join(__dirname, '/public')));
const wss = new WebSocketServer({ server: server });
wss.on('connection', (ws, req) => {
    console.log(`Connection request from: ${req.connection.remoteAddress}`);
    ws.on('message', (data) => {
        console.log('data: ' + data);
        const json = JSON.parse(data);
        console.log('json: ' + json);
        const request = json.request;
        const message = json.message;
        const channel = json.channel;
        messageAja = message;
        switch (request) {
            case 'PUBLISH':
                pubSubManager.publish(ws, channel, message);
                // sendNotif()
                break;
            case 'SUBSCRIBE':
                pubSubManager.subscribe(ws, channel);
                break;
        }
    });
    ws.on('close', () => {
        console.log('Stopping client connection.');
    });
});

  
server.on('request', app);
server.listen(8080, () => {
    console.log('Server listening on http://localhost:8080');
});