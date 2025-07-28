
    import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
    import {
      getAuth,
      signInWithEmailAndPassword,
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

    document.getElementById("loginForm").addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value.trim();
      const spinner = document.getElementById("spinner");

      spinner.style.display = "flex";

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (!user.emailVerified) {
          await signOut(auth);
          showToast("Email belum diverifikasi. Cek inbox Anda.");
          spinner.style.display = "none";
          return;
        }

        window.location.replace("home.html");
      } catch (error) {
        let msg = "pw ente salah.";
        if (error.code === "auth/user-not-found") msg = "Email tidak ditemukan.";
        else if (error.code === "auth/wrong-password") msg = "Password salah.";
        else if (error.code === "auth/invalid-email") msg = "Format email salah.";
        showToast(msg);
      } finally {
        spinner.style.display = "none";
      }
    });

    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode");

    if (mode === "resetPassword") {
      window.location.href = `/password.html?${window.location.search.slice(1)}`;
    }