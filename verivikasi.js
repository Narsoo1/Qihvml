import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
    import {
      getAuth,
      applyActionCode,
      signOut
    } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

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

    const urlParams = new URLSearchParams(window.location.search);
    const oobCode = urlParams.get('oobCode');
    const msgEl = document.getElementById("verifyMsg");

    function showToast(message) {
      const toast = document.createElement("div");
      toast.className = "toast show";
      toast.innerText = message;
      document.getElementById("toastContainer").appendChild(toast);
      setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
      }, 4000);
    }

    if (oobCode) {
      applyActionCode(auth, oobCode)
        .then(async () => {
          msgEl.innerText = "Email Anda berhasil diverifikasi!";
          showToast("Berhasil verifikasi email!");

          await signOut(auth);


          setTimeout(() => {
            window.location.replace("login.html");
          }, 2000);
        })
        .catch(() => {
          msgEl.innerText = "Link verifikasi tidak valid atau sudah kadaluarsa.";
          showToast("Gagal verifikasi email.");
        });
    } else {
      msgEl.innerText = "Kode verifikasi tidak ditemukan.";
      showToast("Kode tidak ditemukan.");
    }