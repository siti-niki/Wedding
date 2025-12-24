        document.addEventListener("DOMContentLoaded", () => {

            const urlParams = new URLSearchParams(window.location.search);
            const guest = urlParams.get('to');
            if (guest) document.getElementById("guestName").textContent = guest;

            const cover = document.getElementById("cover");
            const opening = document.getElementById("opening");
            const btnOpen = document.getElementById("btnOpen");

            // Animasi awal pada cover
            document.querySelectorAll("#cover .scale-in").forEach(el => {
                el.classList.add("show");
            });

            btnOpen.addEventListener("click", () => {

                // 1. Cover naik
                cover.classList.add("hide");

                // 2. Opening muncul
                setTimeout(() => {
                    opening.classList.add("show");

                    // 3. Setelah opening kelihatan → aktifkan scroll + animasi teks
                    setTimeout(() => {
                        document.body.classList.add("opened");

                        document.querySelectorAll("#opening .scale-in").forEach(el => {
                            el.classList.add("show");
                        });

                    }, 700);

                }, 300);

            });

        });

        // Animasi muncul saat discroll
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {

                    // KALO SECTION BRIDEGROOM → ubah display jadi block
                    if (entry.target.id === "bridegroom") {
                        entry.target.classList.add("show");
                    }

                    // animasi scale-in biasa
                    entry.target.classList.add("show");
                }
            });
        });
        const bridegroomSection = document.getElementById("bridegroom");
        observer.observe(bridegroomSection);
        document.querySelectorAll(".scale-in").forEach(el => observer.observe(el));
        observer.observe(document.getElementById("bridegroom"));

        // Target event: 17 November 2024 09:00 WIB
        const targetDate = new Date("2026-01-04T08:00:00").getTime();

        function updateCountdown() {
            const now = new Date().getTime();
            let diff = targetDate - now;

            // Jika sudah lewat → nilai jadi 0, tampilkan pesan
            if (diff <= 0) {
                diff = 0;
                document.getElementById("countdown-message").innerText =
                    "Hari Pernikahan Telah Tiba!";
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            document.getElementById("days").innerText = String(days).padStart(2, "0");
            document.getElementById("hours").innerText = String(hours).padStart(2, "0");
            document.getElementById("minutes").innerText = String(minutes).padStart(2, "0");
            document.getElementById("seconds").innerText = String(seconds).padStart(2, "0");
        }

        setInterval(updateCountdown, 1000);
        updateCountdown();
        // ==== POPUP GALLERY ====
        const popup = document.getElementById("popupGallery");
        const popupImage = document.getElementById("popupImage");
        const closePopup = document.querySelector(".closePopup");
        const nextBtn = document.querySelector(".next");
        const prevBtn = document.querySelector(".prev");

        let galleryImages = [...document.querySelectorAll(".zoom-photo")];
        let currentIndex = 0;

        function openPopup(index) {
            currentIndex = index;
            popupImage.src = galleryImages[currentIndex].src;
            popup.style.display = "flex";
        }

        function closePopupFunc() {
            popup.style.display = "none";
        }

        function nextImage() {
            currentIndex = (currentIndex + 1) % galleryImages.length;
            popupImage.src = galleryImages[currentIndex].src;
        }

        function prevImage() {
            currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
            popupImage.src = galleryImages[currentIndex].src;
        }

        // Klik setiap foto
        galleryImages.forEach((img, idx) => {
            img.addEventListener("click", () => openPopup(idx));
        });

        // Tutup popup
        closePopup.addEventListener("click", closePopupFunc);

        // Panah kiri & kanan
        nextBtn.addEventListener("click", nextImage);
        prevBtn.addEventListener("click", prevImage);

        // Klik di luar gambar untuk tutup
        popup.addEventListener("click", (e) => {
            if (e.target === popup) closePopupFunc();
        });
        // ===== COPY REKENING =====
        document.querySelectorAll(".copy-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                let targetId = btn.getAttribute("data-target");
                let text = document.getElementById(targetId).textContent;

                navigator.clipboard.writeText(text);

                btn.textContent = "Copied!";
                setTimeout(() => btn.textContent = "Copy", 1200);
            });
        });
        // Animasi scale-in pada RSVP
        const scaleTargets = document.querySelectorAll("#rsvp .scale-in");

        const scaleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                }
            });
        }, {
            threshold: 0.3
        });

        scaleTargets.forEach(el => scaleObserver.observe(el));
        /* ==========================
           KONFIGURASI UMUM
           ========================== */
        const DEFAULT_SHEET_ID = "1Ea30xRm9JGPyAXT-w--eEm589-fc30ky6DQaBpIfF30"; // default spreadsheet kamu
        const DEFAULT_SHEET_NAME = ""; // kosong = ambil sheet pertama
        const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyi4JnOqX1zpZVOOFqXDsV2Mo20xKCK1O1DIvorL88t_bFJhJRTUeQFl1-76gQzh1MDwg/exec"; // ganti dgn URL Apps Script universal kamu

        // 🔹 Ambil sheetId & sheetName dari URL (kalau ada)
        const urlParams = new URLSearchParams(window.location.search);
        const SHEET_ID = urlParams.get("sheetId") || DEFAULT_SHEET_ID;
        const SHEET_NAME = urlParams.get("sheetName") || DEFAULT_SHEET_NAME;

        // ==========================
        // RSVP FORM
        // ==========================
        const form = document.getElementById("rsvpForm");
        const message = document.getElementById("message");

        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const nama = document.getElementById("nama").value.trim();
            const kehadiran = document.getElementById("kehadiran").value;
            const ucapan = document.getElementById("ucapan").value.trim();

            if (!nama || !kehadiran) {
                message.textContent = "Name & Attendance are required!";
                message.style.color = "#ffb3b3";
                return;
            }

            message.textContent = "Sending data...";
            message.style.color = "#333";

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
                        message.textContent = "✅ Data successfully sent!";
                        message.style.color = "#90ee90";
                        form.reset();
                        loadRSVP();
                    } else {
                        throw new Error(data.message || "Failed to save data");
                    }
                })
                .catch((err) => {
                    console.error("❌ Error:", err);
                    message.textContent = "Failed to send to spreadsheet.";
                    message.style.color = "#ffb3b3";
                });
        });

        // FETCH & DISPLAY MESSAGES
        // ==========================
        function loadRSVP() {
            const params = new URLSearchParams({
                sheetId: SHEET_ID
            });
            if (SHEET_NAME) params.append("sheetName", SHEET_NAME);

            fetch(`${SCRIPT_URL}?${params.toString()}`)
                .then(res => res.json())
                .then(data => {

                    // Filter empty data
                    const records = data.filter(r => r.nama && r.kehadiran);

                    const list = document.getElementById("messagesList");
                    const hadirCount = document.getElementById("hadirCount");
                    const tidakCount = document.getElementById("tidakHadirCount");
                    const totalCount = document.getElementById("totalCount"); // ✅ tambahan

                    // === Hitung total / hadir / tidak hadir ===
                    const totalGuests = records.length;
                    const totalHadir = records.filter(r => r.kehadiran === "Attend").length;
                    const totalTidak = records.filter(r => r.kehadiran === "Not Attend").length;

                    // === Tampilkan ke HTML ===
                    totalCount.textContent = totalGuests; // ✅ TOTAL GUEST FIXED
                    hadirCount.textContent = totalHadir;
                    tidakCount.textContent = totalTidak;

                    // === Only last 20 messages ===
                    const latestData = records.slice(-20).reverse();

                    // Clear list
                    list.innerHTML = "";

                    // Update info above the box
                    const infoText = `Showing ${latestData.length} of ${records.length} messages`;
                    document.getElementById("ucapanInfo").textContent = infoText;

                    // ============ NEW MESSAGE CARD ==============
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
                })
                .catch(err => console.error("Failed to fetch data:", err));
        }

        // Auto-run when page loads
        document.addEventListener("DOMContentLoaded", () => {
            loadRSVP();
            setInterval(loadRSVP, 5000); // auto update every 5 seconds
        });
        // === MUSIK ===
        const music = document.getElementById("music");
        const musicControl = document.getElementById("musicControl");
        const musicIcon = document.getElementById("musicIcon");
        const openButton = document.getElementById("openButton"); // tombol buka undangan (opsional)

        // --- Fungsi play / pause ---
        function playMusic() {
            if (!music.paused) return; // kalau udah main, skip
            music.play().then(() => {
                musicControl.classList.add("playing");
                musicIcon.innerHTML =
                    '<rect x="16" y="12" width="10" height="40"/><rect x="38" y="12" width="10" height="40"/>';
                removeListeners();
            }).catch((err) => {
                console.log("Autoplay diblokir:", err);
            });
        }

        function pauseMusic() {
            music.pause();
            musicControl.classList.remove("playing");
            musicIcon.innerHTML = '<polygon points="16,12 56,32 16,52"></polygon>';
        }

        // --- Klik ikon musik manual ---
        musicControl.addEventListener("click", () => {
            music.paused ? playMusic() : pauseMusic();
        });

        // --- Klik tombol buka undangan (kalau ada) ---
        if (openButton) {
            openButton.addEventListener("click", () => {
                playMusic();
            });
        }

        // --- Fungsi interaksi pertama: scroll atau klik ---
        function triggerFirstPlay() {
            playMusic();
        }

        // --- Listener: play musik saat user scroll atau klik pertama kali ---
        const firstPlayEvents = ["scroll", "click", "mousemove", "keydown"];
        firstPlayEvents.forEach(evt => {
            document.addEventListener(evt, triggerFirstPlay, {
                once: true
            });
        });

        // --- Bersihkan listener setelah musik jalan ---
        function removeListeners() {
            firstPlayEvents.forEach(evt => {
                document.removeEventListener(evt, triggerFirstPlay);
            });
        }

        // --- Tampilkan ikon musik setelah halaman siap ---
        document.addEventListener("DOMContentLoaded", () => {
            // Tampilkan tombol musik lebih cepat
            const musicControl = document.getElementById("musicControl");
            if (musicControl) {
                musicControl.style.display = "flex";
                musicControl.style.opacity = "0";
                musicControl.style.transition = "opacity 0.6s ease";
                setTimeout(() => (musicControl.style.opacity = "1"), 200);
            }
        });
        let autoScrollActive = false;
        let autoScrollInterval = null;

        function startAutoScroll() {
            autoScrollInterval = setInterval(() => {
                window.scrollBy(0, 1.8); // kecepatan scroll
            }, 12); // jeda interval
        }

        function stopAutoScroll() {
            clearInterval(autoScrollInterval);
            autoScrollInterval = null;
        }

        document.getElementById("autoScrollBtn").addEventListener("click", () => {
            autoScrollActive = !autoScrollActive;

            if (autoScrollActive) {
                startAutoScroll();
                autoScrollBtn.textContent = "Auto Scroll: ON";
            } else {
                stopAutoScroll();
                autoScrollBtn.textContent = "Auto Scroll: OFF";
            }
        });

        // Hentikan auto scroll kalau user scroll manual
        window.addEventListener("wheel", () => {
            if (autoScrollActive) {
                autoScrollActive = false;
                stopAutoScroll();
                autoScrollBtn.textContent = "Auto Scroll: OFF";
            }
        });

        window.addEventListener("touchmove", () => {
            if (autoScrollActive) {
                autoScrollActive = false;
                stopAutoScroll();
                autoScrollBtn.textContent = "Auto Scroll: OFF";
            }
        });
