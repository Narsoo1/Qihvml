  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
  import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
  
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
  
  const errorMsg = document.getElementById('errorMsg');
  
  window.onload = () => {
    if (!navigator.onLine) {
      errorMsg.innerText = "Internet aktifkan king.";
      errorMsg.classList.remove("hidden");
      return;
    }
    
    errorMsg.classList.add("hidden");
    errorMsg.innerText = "";
    
    onAuthStateChanged(auth, async (user) => {
      await new Promise(resolve => setTimeout(resolve, 2000)); 
      
      if (user && user.emailVerified) {
        window.location.href = "home.html";
      } else {
        window.location.href = "login.html";
      }
    });
  };
  
  window.addEventListener("offline", () => {
    errorMsg.innerText = "Tidak ada koneksi internet.";
    errorMsg.classList.remove("hidden");
  });