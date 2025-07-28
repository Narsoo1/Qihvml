import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
  import {
    getAuth,
    confirmPasswordReset
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

  const submitBtn = document.getElementById("submitBtn");
  const newPasswordInput = document.getElementById("newPassword");

  function getOobCodeFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("oobCode");
  }

  submitBtn.addEventListener("click", async () => {
    const newPassword = newPasswordInput.value.trim();
    const oobCode = getOobCodeFromURL();

    if (!newPassword) {
      showToast("Password tidak boleh kosong.");
      return;
    }

    if (newPassword.length < 6) {
      showToast("Password minimal 6 karakter.");
      return;
    }

    if (!oobCode) {
      showToast("Link reset tidak valid.");
      return;
    }

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      showToast("Password berhasil diubah!");
      setTimeout(() => {
        window.location.href = "login.html";
      }, 2000);
    } catch (error) {
      console.error("Firebase error:", error);
      showToast("Gagal mengganti password: " + error.message);
    }
  });