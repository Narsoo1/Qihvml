const applyTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light");
  } else {
    document.body.classList.remove("light");
  }
};
applyTheme();

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  addDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { getMessaging, getToken } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging.js";

const firebaseConfig = {
  apiKey: "AIzaSyBgZX_GKkekzJ8KwxLaAsZiDKm8moTuWAA",
  authDomain: "room-chat-4f487.firebaseapp.com",
  projectId: "room-chat-4f487",
  storageBucket: "room-chat-4f487.appspot.com",
  messagingSenderId: "429375918482",
  appId: "1:429375918482:web:c52cbf150d45561024f14b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const messaging = getMessaging(app);

// Element UI
const messagesBox = document.getElementById("messages");
const input = document.getElementById("input");
const sendBtn = document.getElementById("sendBtn");
const backBtn = document.getElementById("backBtn");
const headerName = document.getElementById("headerName");
const typingStatus = document.getElementById("typingStatus");

// Chat info dari localStorage
let chatId = localStorage.getItem("chatId");
let chatWith = localStorage.getItem("chatWith");

if (!chatId || !chatWith) location.href = "home.html";
headerName.textContent = chatWith;

let currentUser = null;
let currentUsername = "";

// Fungsi untuk load semua pesan
async function loadChat() {
  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(messagesRef, orderBy("timestamp", "asc"));
  
  onSnapshot(q, snapshot => {
    messagesBox.innerHTML = "";
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const div = document.createElement("div");
      div.className = "msg " + (data.from === currentUsername ? "me" : "you");
      
      let time = "--:--";
      if (data.timestamp?.toDate) {
        time = new Date(data.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (data.clientTime) {
        time = new Date(data.clientTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      
      const check = data.from === currentUsername ? (data.seen ? "✔✔" : "✔") : "";
      
      const bubble = document.createElement("div");
      bubble.className = "bubble";
      bubble.setAttribute("data-id", docSnap.id);
      
      let pesanTeks = data.text;
      if (data.edited) pesanTeks += " (diedit)";
      
      bubble.innerHTML = `
        <div class="text">${pesanTeks}</div>
        <div class="meta">${time} <span class="check">${check}</span></div>
      `;
      
      div.appendChild(bubble);
      messagesBox.appendChild(div);
      
      // Update seen
      if (data.from !== currentUsername && !data.seen) {
        updateDoc(doc(db, "chats", chatId, "messages", docSnap.id), { seen: true });
      }
    });
    
    messagesBox.scrollTop = messagesBox.scrollHeight;
  });
}

// Autentikasi
onAuthStateChanged(auth, async user => {
  if (!user || !user.emailVerified) return location.href = "login.html";
  
  currentUser = user;
  const userDoc = await getDoc(doc(db, "users", user.uid));
  currentUsername = userDoc.exists() ? userDoc.data().username : user.email.split("@")[0];
  
  // Simpan token FCM
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: "BE-_jDlf4w4ZIfQBYi8-DJOb7opvtAfmtt3Od1dspuLBW3Dk8O-TIS_c4S-IG-pz9JIdf6JaBkX4sgEq0v2i9f4"
    });
    if (currentToken) {
      await setDoc(doc(db, "fcmTokens", user.uid), {
        token: currentToken,
        uid: user.uid,
        email: user.email
      });
    }
  } catch (e) {
    console.error("Gagal mendapatkan token FCM", e);
  }
  
  // Update readStatus
  await updateDoc(doc(db, "chats", chatId), {
    [`readStatus.${currentUsername}`]: Date.now()
  });
  
  loadChat();
  
  // Typing indicator
  onSnapshot(doc(db, "chats", chatId, "typing", chatWith), snap => {
    typingStatus.textContent = snap.exists() && snap.data().typing ? "Sedang mengetik..." : "";
  });
});

// Kirim pesan
sendBtn.onclick = async () => {
  const text = input.value.trim();
  if (!text) return;
  
  input.value = "";
  await setDoc(doc(db, "chats", chatId, "typing", currentUsername), { typing: false });
  
  await addDoc(collection(db, "chats", chatId, "messages"), {
    from: currentUsername,
    to: chatWith,
    text,
    seen: false,
    timestamp: serverTimestamp(),
    clientTime: new Date().toISOString(),
    edited: false
  });
  
  await updateDoc(doc(db, "chats", chatId), {
    lastMessage: text,
    lastTimestamp: Date.now(),
    [`readStatus.${currentUsername}`]: Date.now()
  });
};

// Deteksi sedang mengetik
input.addEventListener("input", async () => {
  const typing = input.value.trim().length > 0;
  await setDoc(doc(db, "chats", chatId, "typing", currentUsername), { typing });
});

// Kembali ke home
backBtn.onclick = () => {
  localStorage.removeItem("chatId");
  localStorage.removeItem("chatWith");
  location.href = "home.html";
};

// Mencegah kembali ke chat setelah keluar
window.addEventListener("pageshow", () => {
  if (!localStorage.getItem("chatId")) location.href = "home.html";
});

// Fitur edit chat
messagesBox.addEventListener("click", async function(e) {
  const bubble = e.target.closest(".bubble");
  if (!bubble) return;
  
  const msgId = bubble.getAttribute("data-id");
  const parent = bubble.closest(".msg");
  const isMe = parent && parent.classList.contains("me");
  if (!isMe) return;
  
  const textDiv = bubble.querySelector(".text");
  const oldText = textDiv.textContent.replace(" (diedit)", "");
  
  bubble.innerHTML = `
    <input type="text" class="edit-input" value="${oldText}" style="width: 100%; padding: 6px; border-radius: 6px; border: none; font-size: 14px;">
    <div class="meta">
      <button class="save-edit" style="margin-right: 8px;">Simpan</button>
      <button class="cancel-edit">Batal</button>
    </div>
  `;
  
  bubble.querySelector(".save-edit").onclick = async () => {
    const newText = bubble.querySelector(".edit-input").value.trim();
    if (!newText || newText === oldText) {
      loadChat();
      return;
    }
    
    await updateDoc(doc(db, "chats", chatId, "messages", msgId), {
      text: newText,
      edited: true
    });
    
    // Update pesan terakhir jika ini adalah terakhir
    await updateDoc(doc(db, "chats", chatId), {
      lastMessage: newText,
      lastTimestamp: Date.now()
    });
  };
  
  bubble.querySelector(".cancel-edit").onclick = () => {
    loadChat();
  };
});