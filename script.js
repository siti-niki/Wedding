document.addEventListener("DOMContentLoaded", () => {
  
  // 1. KONFIGURASI RSVP (GOOGLE SHEETS)
  const DEFAULT_SHEET_ID = "1Pts3QAJ_R46zkpSYc-zZ1jgQgbtR-ZjtWgwU9eheSxU";
  const DEFAULT_SHEET_NAME = "RSVP";
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzd3gJrWY8-Qb1WGAzuU_Xl5tTjNUK9ceR3t_vP1o3yPio9sq3wwgBaKuZrTRG-BFppYA/exec";
  
  const urlParams = new URLSearchParams(window.location.search);
  const SHEET_ID = urlParams.get("sheetId") || DEFAULT_SHEET_ID;
  const SHEET_NAME = urlParams.get("sheetName") || DEFAULT_SHEET_NAME;
  
  // Ambil nama tamu dari URL untuk sapaan di cover
  const guest = urlParams.get('to');
  const guestNameElem = document.getElementById("guestName");
    if (guest && guestNameElem) {
      guestNameElem.textContent = guest;
      }
  
  // 2. Inisialisasi Elemen
  const cover = document.getElementById("cover");
  const opening = document.getElementById("opening");
  const btnOpen = document.getElementById("btnOpen");
  const music = document.getElementById("music");
  const musicControl = document.getElementById("musicControl");
  const musicIcon = document.getElementById("musicIcon");
  const autoScrollBtn = document.getElementById("autoScrollBtn");
  
  // 3. Animasi Awal pada Cover (langsung muncul saat load)
  document.querySelectorAll("#cover .scale-in").forEach(el => {
    el.classList.add("show");
  });
  
  // 4. Logika Buka Undangan
  btnOpen.addEventListener("click", () => {
    // Cover naik/menghilang
    cover.classList.add("hide");
    
    // Putar Musik (Browser mewajibkan interaksi user seperti klik ini)
    if (music) {
      music.play().then(() => {
        musicControl.classList.add("playing");
        musicControl.style.display = "flex";
        setTimeout(() => { musicControl.style.opacity = "1"; }, 200);
        // Set icon ke Pause (dua garis vertikal)
        musicIcon.innerHTML = '<rect x="15" y="10" width="10" height="44" fill="white"/><rect x="39" y="10" width="10" height="44" fill="white"/>';
      }).catch(error => console.log("Autoplay musik tertahan:", error));
    }
    
    // Munculkan konten utama
    setTimeout(() => {
      opening.classList.add("show");
      // Aktifkan scroll pada body
      document.body.classList.add("opened");
      
      // Trigger animasi teks pada bagian opening
      document.querySelectorAll("#opening .scale-in").forEach(el => {
        el.classList.add("show");
      });
    }, 300);
  });
  
  // 5. Kontrol Musik (Play/Pause)
  if (musicControl) {
    musicControl.addEventListener("click", () => {
      if (music.paused) {
        music.play();
        musicControl.classList.add("playing");
        musicIcon.innerHTML = '<rect x="15" y="10" width="10" height="44" fill="white"/><rect x="39" y="10" width="10" height="44" fill="white"/>';
      } else {
        music.pause();
        musicControl.classList.remove("playing");
        musicIcon.innerHTML = '<polygon points="16,12 56,32 16,52" fill="white"/>';
      }
    });
  }
  
  // 6. Animasi Muncul saat Scroll (Intersection Observer)
  const observerOptions = { threshold: 0.1 };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  }, observerOptions);
  
  // Amati semua elemen dengan class scale-in (selain di cover)
  document.querySelectorAll("section:not(#cover) .scale-in").forEach(el => {
    observer.observe(el);
  });
  
  // 7. Hitung Mundur (Countdown)
  const targetDate = new Date("January 4, 2026 08:00:00").getTime();
  const countdownInterval = setInterval(() => {
    const now = new Date().getTime();
    const distance = targetDate - now;
    
    if (distance < 0) {
      clearInterval(countdownInterval);
      const msg = document.getElementById("countdown-message");
      if (msg) msg.textContent = "Acara Sedang Berlangsung!";
      return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    if (document.getElementById("days")) {
      document.getElementById("days").textContent = String(days).padStart(2, '0');
      document.getElementById("hours").textContent = String(hours).padStart(2, '0');
      document.getElementById("minutes").textContent = String(minutes).padStart(2, '0');
      document.getElementById("seconds").textContent = String(seconds).padStart(2, '0');
    }
  }, 1000);
  
  // 8. Logika Auto Scroll
  let autoScrollActive = false;
  let autoScrollInterval = null;
  
  function startAutoScroll() {
    autoScrollInterval = setInterval(() => {
      window.scrollBy(0, 1.8); // Kecepatan scroll halus
    }, 12);
  }
  
  function stopAutoScroll() {
    clearInterval(autoScrollInterval);
    autoScrollInterval = null;
  }
  
  if (autoScrollBtn) {
    autoScrollBtn.addEventListener("click", () => {
      autoScrollActive = !autoScrollActive;
      if (autoScrollActive) {
        startAutoScroll();
        autoScrollBtn.textContent = "Scroll Otomatis: ON";
      } else {
        stopAutoScroll();
        autoScrollBtn.textContent = "Scroll Otomatis: OFF";
      }
    });
  }
  
  // Berhenti auto scroll jika user melakukan interaksi manual (scroll/sentuh)
  const handleManualInteraction = () => {
    if (autoScrollActive) {
      autoScrollActive = false;
      stopAutoScroll();
      if (autoScrollBtn) autoScrollBtn.textContent = "Scroll Otomatis: OFF";
    }
  };
  
  window.addEventListener("wheel", handleManualInteraction);
  window.addEventListener("touchmove", handleManualInteraction);
  
  // 9. Salin Nomor Rekening
  document.querySelectorAll(".copy-btn").forEach(button => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target");
      const textToCopy = document.getElementById(targetId).textContent;
      
      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = button.textContent;
        button.textContent = "Tersalin!";
        button.classList.add("copied");
        setTimeout(() => {
          button.textContent = originalText;
          button.classList.remove("copied");
        }, 2000);
      });
    });
  });
  
  // 10. SISTEM RSVP (KIRIM & AMBIL DATA)
  
  const rsvpForm = document.getElementById("rsvpForm");
  const rsvpMessage = document.getElementById("message");
  
  if (rsvpForm) {
  rsvpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const nama = document.getElementById("nama").value.trim();
    const kehadiran = document.getElementById("kehadiran").value;
    const ucapan = document.getElementById("ucapan").value.trim();
    
    if (!nama || !kehadiran) {
      rsvpMessage.textContent = "Nama & Kehadiran wajib diisi!";
      rsvpMessage.style.color = "#ffb3b3";
      return;
    }
    
    rsvpMessage.textContent = "Mengirim ucapan...";
    rsvpMessage.style.color = "#333";
    
    const formData = new FormData();
    formData.append("sheetId", SHEET_ID);
    if (SHEET_NAME) formData.append("sheetName", SHEET_NAME);
    formData.append("nama", nama);
    formData.append("kehadiran", kehadiran);
    formData.append("ucapan", ucapan);
    
    fetch(SCRIPT_URL, {
        method: "POST",
        body: formData
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          rsvpMessage.textContent = "✅ Ucapan berhasil dikirim!";
          rsvpMessage.style.color = "#90ee90";
          rsvpForm.reset();
          loadRSVP();
        } else {
          throw new Error(data.message || "Gagal menyimpan data");
        }
      })
      .catch((err) => {
        console.error("❌ Error:", err);
        rsvpMessage.textContent = "Gagal mengirim ke spreadsheet.";
        rsvpMessage.style.color = "#ffb3b3";
      });
  });
  }
  
  function loadRSVP() {
  const params = new URLSearchParams({ sheetId: SHEET_ID });
  if (SHEET_NAME) params.append("sheetName", SHEET_NAME);
  
  fetch(`${SCRIPT_URL}?${params.toString()}`)
    .then(res => res.json())
    .then(data => {
      const records = data.filter(r => r.nama && r.kehadiran);
      const list = document.getElementById("messagesList");
      const hadirCount = document.getElementById("hadirCount");
      const tidakCount = document.getElementById("tidakHadirCount");
      const totalCount = document.getElementById("totalCount");
      
      const totalGuests = records.length;
      const totalHadir = records.filter(r => r.kehadiran === "Attend").length;
      const totalTidak = records.filter(r => r.kehadiran === "Not Attend").length;
      
      if (totalCount) totalCount.textContent = totalGuests;
      if (hadirCount) hadirCount.textContent = totalHadir;
      if (tidakCount) tidakCount.textContent = totalTidak;
      
      const latestData = records.slice(-20).reverse();
      if (list) {
        list.innerHTML = "";
        latestData.forEach((r, i) => {
          const div = document.createElement("div");
          div.classList.add("ucapan-item");
          div.style.opacity = 0;
          div.innerHTML = `
                            <div class="ucapan-header">
                                <div class="ucapan-name">
                                    ${r.kehadiran === "Attend" ? `<span class="badge-verify">✔</span>` : ""}
                                    <strong>${r.nama}</strong>
                                </div>
                                <span class="ucapan-status">${r.kehadiran}</span>
                            </div>
                            <div class="ucapan-time">${r.timestamp || ""}</div>
                            <p class="ucapan-text">${r.ucapan || ""}</p>
                        `;
          list.appendChild(div);
          setTimeout(() => (div.style.opacity = 1), 40 * i);
        });
      }
      
      const infoText = `Menampilkan ${latestData.length} Dari ${records.length} Pesan`;
      const infoElem = document.getElementById("ucapanInfo");
      if (infoElem) infoElem.textContent = infoText;
    })
    .catch(err => console.error("Gagal mengambil data RSVP:", err));
  }

  // Jalankan load RSVP pertama kali
  loadRSVP();
  // Update otomatis setiap 10 detik agar tidak terlalu berat
  setInterval(loadRSVP, 10000);
  
});
