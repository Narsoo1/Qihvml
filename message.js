// message.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBgZX_GKkekzJ8KwxLaAsZiDKm8moTuWAA",
  authDomain: "room-chat-4f487.firebaseapp.com",
  projectId: "room-chat-4f487",
  storageBucket: "room-chat-4f487.appspot.com", // ✅ sudah diperbaiki
  messagingSenderId: "429375918482",
  appId: "1:429375918482:web:c52cbf150d45561024f14b"
};


const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
const db = getFirestore(app);
const auth = getAuth(app);


Notification.requestPermission().then(permission => {
  if (permission === "granted") {
  
    getToken(messaging, {
      vapidKey: "BE-_jDlf4w4ZIfQBYi8-DJOb7opvtAfmtt3Od1dspuLBW3Dk8O-TIS_c4S-IG-pz9JIdf6JaBkX4sgEq0v2i9f4"
    }).then((currentToken) => {
      if (currentToken) {
        console.log("✅ Token FCM:", currentToken);
        
        // ✅ Simpan token ke Firestore berdasarkan UID user login
        onAuthStateChanged(auth, (user) => {
          if (user) {
            setDoc(doc(db, "fcmTokens", user.uid), {
              token: currentToken
            }).then(() => {
              console.log("✅ Token disimpan ke Firestore.");
            }).catch((error) => {
              console.error("❌ Gagal simpan token:", error);
            });
          } else {
            console.warn("⚠️ User belum login. Token tidak disimpan.");
          }
        });
        
      } else {
        console.warn("⚠️ Token tidak tersedia.");
      }
    }).catch((err) => {
      console.error("❌ Gagal mengambil token FCM:", err);
    });
    
  } else {
    console.warn("❌ Izin notifikasi ditolak oleh pengguna.");
  }
});


onMessage(messaging, (payload) => {
  console.log("📩 Pesan diterima di foreground:", payload);
  
  const { title, body } = payload.notification || {};
  if (title && body) {
    new Notification(title, {
      body: body,
      icon: "/faqih.png"
    });
  }
});