(function () {
        const slides = document.querySelectorAll(".carousel-slide");
        const dots = document.querySelectorAll(".dot");
        let current = 0;
        function showSlide(i) {
          slides.forEach((s) => s.classList.remove("active"));
          dots.forEach((d) => d.classList.remove("active"));
          slides[i].classList.add("active");
          dots[i].classList.add("active");
          current = i;
        }
        dots.forEach((d) =>
          d.addEventListener("click", (e) =>
            showSlide(parseInt(e.target.dataset.index)),
          ),
        );
        setInterval(() => showSlide((current + 1) % slides.length), 5000);

        const bars = document.querySelectorAll(".progress-bar");
        const obs = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting)
                e.target.style.width = e.target.dataset.percent + "%";
            });
          },
          { threshold: 0.5 },
        );
        bars.forEach((b) => obs.observe(b));

        const donateModal = document.getElementById("donationModal");
        const blogModal = document.getElementById("blogModal");
        const closeDonateBtn = document.getElementById("closeDonateModalBtn");
        const closeBlogBtn = document.getElementById("closeBlogModalBtn");
        const blogContent = document.getElementById("blogArticleContent");

        document.querySelectorAll(".open-donate-modal").forEach((btn) => {
          btn.addEventListener("click", () => {
            const donateModal = document.getElementById("donationModal");
            donateModal.classList.add("active");

            // Reset to Bitcoin tab by default
            document
              .querySelectorAll(".crypto-tab")
              .forEach((t) => t.classList.remove("active"));
            document
              .querySelectorAll(".crypto-panel")
              .forEach((p) => p.classList.remove("active"));

            const defaultTab = document.querySelector(
              '.crypto-tab[data-crypto="bitcoin"]',
            );
            const defaultPanel = document.getElementById("bitcoinPanel");

            if (defaultTab) defaultTab.classList.add("active");
            if (defaultPanel) defaultPanel.classList.add("active");
          });
        });
        closeDonateBtn.addEventListener("click", () =>
          donateModal.classList.remove("active"),
        );

        document.querySelectorAll(".open-blog-modal").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            const card = e.target.closest(".blog-card");
            const articleId = card ? card.dataset.article : null;
            let html = "";
            if (articleId === "1") {
              html = `<h2>How Early Therapy Changed Amina's World</h2><span class="blog-date"><i class="far fa-calendar"></i> June 12, 2025</span><p>Amina was diagnosed with autism at age 3. Her parents struggled to find affordable therapy until they connected with The Polite Supporters. Through our speech therapy program, Amina began to communicate using words and gestures. Today, she attends a mainstream school and has made friends. "We never thought this day would come," says her mother. Your donations make stories like Amina's possible.</p>`;
            } else if (articleId === "2") {
              html = `<h2>Emergency Relief Reaches 500 Displaced Families</h2><span class="blog-date"><i class="far fa-calendar"></i> June 5, 2025</span><p>Following the recent insurgency in the northeast, our emergency response team mobilized quickly. We distributed food packages, clean water, clothing, and medical kits to 500 families living in temporary camps. "The situation was desperate," recalls field coordinator Ibrahim. "But thanks to our supporters, we brought hope and essential supplies." The relief effort continues as we plan longer-term shelter solutions.</p>`;
            } else if (articleId === "3") {
              html = `<h2>Training Teachers to Support Dyslexic Learners</h2><span class="blog-date"><i class="far fa-calendar"></i> May 28, 2025</span><p>Last month, we held a two-day workshop for 100 primary school teachers focused on inclusive education for dyslexic children. Participants learned about multisensory teaching methods, assistive technology, and creating dyslexia-friendly classrooms. "I now understand that these children are not lazy; they just learn differently," shared one teacher. Each trained teacher impacts dozens of students every year.</p>`;
            }
            blogContent.innerHTML = html;
            blogModal.classList.add("active");
          });
        });
        closeBlogBtn.addEventListener("click", () =>
          blogModal.classList.remove("active"),
        );

        window.addEventListener("click", (e) => {
          if (e.target === donateModal) donateModal.classList.remove("active");
          if (e.target === blogModal) blogModal.classList.remove("active");
        });

        const totalEl = document.getElementById("totalDonated");
        if (totalEl) {
          const final = 284763;
          const timer = setInterval(() => {
            let curr =
              parseInt(totalEl.textContent.replace(/[^0-9]/g, "")) || 0;
            if (curr < final) {
              totalEl.textContent =
                "$" + Math.min(curr + 15000, final).toLocaleString();
            } else clearInterval(timer);
          }, 90);
        }
      })();

      // ===== Welcome Popup Logic =====
      (function () {
        const popup = document.getElementById("welcomePopup");
        const closeBtn = document.getElementById("closePopupBtn");
        const understandBtn = document.getElementById("understandBtn");
        const learnMoreBtn = document.getElementById("learnMoreBtn");

        // Check if user has already seen the popup
        const hasSeenPopup = sessionStorage.getItem(
          "politeSupporters_popupSeen",
        );

        if (!hasSeenPopup) {
          // Show popup after a short delay for better UX
          setTimeout(() => {
            popup.classList.add("active");
            document.body.style.overflow = "hidden"; // Prevent background scroll
          }, 1500);
        }

        function closePopup() {
          popup.classList.remove("active");
          document.body.style.overflow = "";
          sessionStorage.setItem("politeSupporters_popupSeen", "true");
        }

        closeBtn.addEventListener("click", closePopup);
        understandBtn.addEventListener("click", closePopup);

        learnMoreBtn.addEventListener("click", () => {
          // Scroll to active project or crypto section (customize as needed)
          closePopup();
          const activeProject = document.getElementById("active-project");
          if (activeProject) {
            setTimeout(() => {
              activeProject.scrollIntoView({ behavior: "smooth" });
            }, 300);
          }
        });

        // Close on overlay click
        popup.addEventListener("click", (e) => {
          if (e.target === popup) {
            closePopup();
          }
        });

        // Close on Escape key
        document.addEventListener("keydown", (e) => {
          if (e.key === "Escape" && popup.classList.contains("active")) {
            closePopup();
          }
        });

        // ===== Floating Donation Ticker =====
        const tickerList = document.getElementById("tickerList");
        const ticker = document.getElementById("donationTicker");
        const toggleBtn = document.getElementById("toggleTicker");

        // Sample donation data (in production, this could come from an API)
        const cryptoCurrencies = ["BTC", "ETH", "USDT", "SOL", "ADA", "DOT"];
        const donationAmounts = [
          { min: 10, max: 50 },
          { min: 50, max: 200 },
          { min: 200, max: 500 },
          { min: 500, max: 1000 },
          { min: 1000, max: 5000 },
        ];

        function generateDonorId() {
          const chars =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
          let id = "DNR-";
          for (let i = 0; i < 8; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
          }
          return id;
        }

        function generateDonation() {
          const crypto =
            cryptoCurrencies[
              Math.floor(Math.random() * cryptoCurrencies.length)
            ];
          const amountRange =
            donationAmounts[Math.floor(Math.random() * donationAmounts.length)];
          const amount = (
            Math.random() * (amountRange.max - amountRange.min) +
            amountRange.min
          ).toFixed(2);
          const donorId = generateDonorId();

          return { donorId, amount, crypto };
        }

        function createTickerItem(donation) {
          const item = document.createElement("div");
          item.className = "ticker-item";
          item.innerHTML = `
      <span class="donor-id">${donation.donorId}</span>
      <span class="donation-amount">
        ${donation.amount} 
        <span class="crypto-icon">
          <i class="fab fa-${donation.crypto.toLowerCase() === "btc" ? "bitcoin" : "ethereum"}"></i>
        </span>
        ${donation.crypto}
      </span>
    `;
          return item;
        }

        // Initialize ticker with sample donations
        function initializeTicker() {
          const donations = [];
          for (let i = 0; i < 15; i++) {
            donations.push(generateDonation());
          }

          // Add items to ticker (duplicate for seamless scroll)
          donations.forEach((donation) => {
            tickerList.appendChild(createTickerItem(donation));
          });
          donations.forEach((donation) => {
            tickerList.appendChild(createTickerItem(donation));
          });
        }

        // Add new donations periodically
        function addLiveDonation() {
          const donation = generateDonation();
          const item = createTickerItem(donation);
          tickerList.appendChild(item);

          // Add subtle highlight effect
          item.style.background = "rgba(180, 95, 58, 0.1)";
          setTimeout(() => {
            item.style.background = "";
          }, 2000);

          // Remove old items to prevent memory issues (keep reasonable amount)
          while (tickerList.children.length > 30) {
            tickerList.removeChild(tickerList.firstChild);
          }
        }

        // Toggle ticker minimize/maximize
        toggleBtn.addEventListener("click", () => {
          ticker.classList.toggle("minimized");
          const icon = toggleBtn.querySelector("i");
          if (ticker.classList.contains("minimized")) {
            icon.classList.remove("fa-chevron-down");
            icon.classList.add("fa-chevron-up");
          } else {
            icon.classList.remove("fa-chevron-up");
            icon.classList.add("fa-chevron-down");
          }
        });

        // Click header to toggle
        ticker
          .querySelector(".ticker-header")
          .addEventListener("click", (e) => {
            if (e.target !== toggleBtn && !toggleBtn.contains(e.target)) {
              ticker.classList.toggle("minimized");
            }
          });

        // Initialize
        initializeTicker();

        // Add new donation every 8-15 seconds
        setInterval(
          () => {
            addLiveDonation();
          },
          Math.random() * 7000 + 8000,
        );

        // Initial batch of donations with staggered timing
        setTimeout(() => addLiveDonation(), 3000);
        setTimeout(() => addLiveDonation(), 6000);
        setTimeout(() => addLiveDonation(), 10000);
      })();

      // ===== Crypto Tab Switching =====
      document.querySelectorAll(".crypto-tab").forEach((tab) => {
        tab.addEventListener("click", function () {
          // Remove active class from all tabs and panels
          document
            .querySelectorAll(".crypto-tab")
            .forEach((t) => t.classList.remove("active"));
          document
            .querySelectorAll(".crypto-panel")
            .forEach((p) => p.classList.remove("active"));

          // Add active class to clicked tab
          this.classList.add("active");

          // Show corresponding panel
          const crypto = this.dataset.crypto;
          const panel = document.getElementById(crypto + "Panel");
          if (panel) {
            panel.classList.add("active");
          }
        });
      });

      // ===== Copy Wallet Address Function =====
      function copyWallet(walletId) {
        const walletElement = document.getElementById(walletId);
        const messageElement = document.getElementById(walletId + "Message");

        if (walletElement) {
          const walletAddress = walletElement.textContent.trim();

          // Modern clipboard API
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard
              .writeText(walletAddress)
              .then(() => {
                showCopyMessage(messageElement);
              })
              .catch(() => {
                // Fallback method
                fallbackCopy(walletElement, messageElement);
              });
          } else {
            // Fallback for older browsers
            fallbackCopy(walletElement, messageElement);
          }
        }
      }

      function fallbackCopy(element, messageElement) {
        const range = document.createRange();
        range.selectNode(element);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);

        try {
          document.execCommand("copy");
          showCopyMessage(messageElement);
        } catch (err) {
          console.error("Copy failed:", err);
        }

        window.getSelection().removeAllRanges();
      }

      function showCopyMessage(messageElement) {
        if (messageElement) {
          // Remove any existing show class
          messageElement.classList.remove("show");

          // Trigger reflow
          void messageElement.offsetWidth;

          // Add show class
          messageElement.classList.add("show");

          // Remove after animation
          setTimeout(() => {
            messageElement.classList.remove("show");
          }, 2000);
        }
      }

      // Make copyWallet function globally accessible
      window.copyWallet = copyWallet;