 import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
    import {
      getAuth,
      sendPasswordResetEmail
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

    const resetForm = document.getElementById("resetForm");
    const resetEmail = document.getElementById("resetEmail");

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

    resetForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = resetEmail.value.trim();

      if (!email) {
        showToast("Email tidak boleh kosong.");
        return;
      }

      try {
        const actionCodeSettings = {
  url: 'https://qih1.vercel.app/password.html',
  handleCodeInApp: true
};
await sendPasswordResetEmail(auth, email, actionCodeSettings);
        showToast("Link reset dikirim. Cek email!");
        setTimeout(() => {
          window.location.href = "login.html";
        }, 3000);
      } catch (error) {
        if (error.code === "auth/user-not-found") {
          showToast("Email tidak ditemukan.");
        } else if (error.code === "auth/invalid-email") {
          showToast("Email tidak valid.");
        } else {
          showToast("Gagal mengirim reset: " + error.message);
        }
      }
    });