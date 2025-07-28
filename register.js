<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
  import {
    getAuth,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signOut,
    deleteUser
  } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
  import {
    getFirestore,
    doc,
    setDoc
  } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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

  const showToast = (message) => {
    const toast = document.createElement("div");
    toast.className = "toast show";
    toast.textContent = message;
    document.getElementById("toastContainer").appendChild(toast);
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  };

  document.getElementById("registerBtn").onclick = async () => {
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value.trim();

    if (!email || !password) {
      showToast("Email dan password wajib diisi.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;


      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        username: email.split("@")[0].toLowerCase()
      });

      await sendEmailVerification(user, {
  url: 'https://qih1.vercel.app/verifikasi.html', // 
  handleCodeInApp: true
});

showToast("done silahkan login 🐈.");

setTimeout(async () => {
  await signOut(auth);
  window.location.replace("login.html?registered=true");
}, 1500);

    } catch (error) {
      console.error("REGISTRATION ERROR:", error.code, error.message);
      let errorMsg = "Gagal daftar.";
      if (error.code === "auth/email-already-in-use") {
        errorMsg = "Email sudah terdaftar.";
      } else if (error.code === "auth/invalid-email") {
        errorMsg = "Format email tidak valid.";
      } else if (error.code === "auth/weak-password") {
        errorMsg = "Password minimal 6 karakter.";
      }
      showToast(errorMsg);
    }
  };
</script>