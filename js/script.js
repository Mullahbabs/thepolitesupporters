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
    const final = 1100824;
    const timer = setInterval(() => {
      let curr = parseInt(totalEl.textContent.replace(/[^0-9]/g, "")) || 0;
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
  const hasSeenPopup = sessionStorage.getItem("politeSupporters_popupSeen");

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
      cryptoCurrencies[Math.floor(Math.random() * cryptoCurrencies.length)];
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
  ticker.querySelector(".ticker-header").addEventListener("click", (e) => {
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

// ===== Disability Pride Month Ticker =====
(function () {
  const prideMessages = [
    {
      icon: "fa-solid fa-calendar",
      text: "Celebrating July as — Disability pride month!",
    },
    {
      icon: "fa-solid fa-wheelchair",
      text: "Disability is not inability — it's a different ability!",
    },
    {
      icon: "fa-solid fa-hands",
      text: "Celebrating every mind, every body, every voice",
    },
    {
      icon: "fa-solid fa-brain",
      text: "Neurodiversity is a superpower, not a disorder",
    },
    {
      icon: "fa-solid fa-eye-slash",
      text: "Not all disabilities are visible — choose kindness always",
    },
    {
      icon: "fa-solid fa-ear-deaf",
      text: "Inclusion is not just a word — it's an action",
    },
    {
      icon: "fa-solid fa-heart",
      text: "Every child deserves understanding & acceptance",
    },
    { icon: "fa-solid fa-star", text: "Different, not less — Temple Grandin" },
    {
      icon: "fa-solid fa-infinity",
      text: "The beauty of humanity lies in our diversity",
    },
    {
      icon: "fa-solid fa-rainbow",
      text: "Proud to support all abilities this Disability Pride Month",
    },
    {
      icon: "fa-solid fa-hand-sparkles",
      text: "Breaking barriers, building bridges of inclusion",
    },
    {
      icon: "fa-solid fa-seedling",
      text: "Every accommodation is a step toward equity",
    },
    {
      icon: "fa-solid fa-globe",
      text: "An inclusive world benefits everyone — not just the few",
    },
    {
      icon: "fa-solid fa-people-arrows",
      text: "Allyship in action: Listen. Learn. Support. Amplify.",
    },
    {
      icon: "fa-solid fa-trophy",
      text: "Celebrating achievements of the disability community worldwide",
    },
    {
      icon: "fa-solid fa-scale-balanced",
      text: "Accessibility is a right, not a privilege",
    },
  ];

  const tickerTrack = document.getElementById("prideTickerTrack");
  const prideTickerWrapper = document.querySelector(".pride-ticker-wrapper");
  const closeBtn = document.getElementById("closePrideTicker");

  // Check if ticker was previously closed
  const tickerClosed = sessionStorage.getItem("prideTicker_closed");

  function createPrideMessages() {
    if (!tickerTrack) return;

    // Clear existing messages
    tickerTrack.innerHTML = "";

    // Create and append messages
    prideMessages.forEach((msg) => {
      const messageEl = document.createElement("span");
      messageEl.className = "pride-message";
      messageEl.innerHTML = `
        <i class="${msg.icon}"></i>
        <span>${msg.text}</span>
      `;
      tickerTrack.appendChild(messageEl);
    });

    // Duplicate messages for seamless infinite scroll
    prideMessages.forEach((msg) => {
      const messageEl = document.createElement("span");
      messageEl.className = "pride-message";
      messageEl.innerHTML = `
        <i class="${msg.icon}"></i>
        <span>${msg.text}</span>
      `;
      tickerTrack.appendChild(messageEl);
    });
  }

  function showTicker() {
    if (prideTickerWrapper && !tickerClosed) {
      // Small delay for dramatic entrance
      setTimeout(() => {
        prideTickerWrapper.classList.add("show");
      }, 2000);
    }
  }

  function hideTicker() {
    if (prideTickerWrapper) {
      prideTickerWrapper.classList.remove("show");
      sessionStorage.setItem("prideTicker_closed", "true");

      // Optional: Show a small indicator that ticker was hidden
      // Could add a small button to restore it
    }
  }

  // Close button functionality
  if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      hideTicker();

      // Optional: Create a small restore button
      createRestoreButton();
    });
  }

  // Optional: Click on ticker to pause/resume
  if (prideTickerWrapper) {
    prideTickerWrapper.addEventListener("click", (e) => {
      const track = document.getElementById("prideTickerTrack");
      if (track && e.target !== closeBtn && !closeBtn.contains(e.target)) {
        if (track.style.animationPlayState === "paused") {
          track.style.animationPlayState = "running";
        } else {
          track.style.animationPlayState = "paused";
        }
      }
    });
  }

  // Create a small restore button if user closes the ticker
  function createRestoreButton() {
    // Remove existing restore button if any
    const existingBtn = document.getElementById("restorePrideTicker");
    if (existingBtn) existingBtn.remove();

    const restoreBtn = document.createElement("button");
    restoreBtn.id = "restorePrideTicker";
    restoreBtn.innerHTML = '<i class="fa-solid fa-rainbow"></i>';
    restoreBtn.title = "Show Disability Pride Month message";
    restoreBtn.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      z-index: 9999;
      background: linear-gradient(135deg, #E40303, #FFED00, #008026, #24408E, #732982);
      color: white;
      border: 2px solid white;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      transition: all 0.3s ease;
      animation: pulseButton 2s infinite;
    `;

    restoreBtn.addEventListener("click", () => {
      sessionStorage.removeItem("prideTicker_closed");
      prideTickerWrapper.classList.add("show");
      restoreBtn.remove();
    });

    document.body.appendChild(restoreBtn);

    // Auto-remove restore button after 5 minutes
    setTimeout(() => {
      if (restoreBtn.parentNode) {
        restoreBtn.remove();
      }
    }, 300000);
  }

  // Add pulse animation for restore button
  const pulseStyle = document.createElement("style");
  pulseStyle.textContent = `
    @keyframes pulseButton {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
  `;
  document.head.appendChild(pulseStyle);

  // Initialize
  createPrideMessages();
  showTicker();

  // Reset ticker at midnight (for new day)
  function scheduleMidnightReset() {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const timeUntilMidnight = midnight - now;

    setTimeout(() => {
      sessionStorage.removeItem("prideTicker_closed");
      // Reload or reinitialize ticker
      location.reload();
    }, timeUntilMidnight);
  }

  scheduleMidnightReset();

  console.log(
    "🌈 Disability Pride Month Ticker initialized - Celebrating all abilities!",
  );
})();

// ===== EmailJS Configuration =====
(function() {
  // Initialize EmailJS with your Public Key
  // Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS public key
  emailjs.init('YOUR_PUBLIC_KEY');

  // ===== Contact Form Handling =====
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoading = submitBtn.querySelector('.btn-loading');
  const successModal = document.getElementById('successModal');
  const closeSuccessBtn = document.getElementById('closeSuccessModal');
  const referenceId = document.getElementById('referenceId');
  const charCount = document.getElementById('charCount');
  const messageTextarea = document.getElementById('message');

  // Character counter for message box
  if (messageTextarea && charCount) {
    messageTextarea.addEventListener('input', function() {
      const length = this.value.length;
      charCount.textContent = `${length}/1000`;
      
      if (length > 900) {
        charCount.style.color = '#e74c3c';
      } else {
        charCount.style.color = '#8b6b58';
      }
    });
  }

  // Form validation
  function validateForm() {
    let isValid = true;
    
    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('.input-wrapper input, .input-wrapper select, .input-wrapper textarea').forEach(el => el.classList.remove('error'));
    
    // Full Name validation
    const fullName = document.getElementById('fullName').value.trim();
    if (!fullName) {
      document.getElementById('fullNameError').textContent = 'Full name is required';
      document.getElementById('fullName').classList.add('error');
      isValid = false;
    } else if (fullName.length < 3) {
      document.getElementById('fullNameError').textContent = 'Name must be at least 3 characters';
      document.getElementById('fullName').classList.add('error');
      isValid = false;
    }
    
    // Email validation
    const email = document.getElementById('email').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      document.getElementById('emailError').textContent = 'Email address is required';
      document.getElementById('email').classList.add('error');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      document.getElementById('emailError').textContent = 'Please enter a valid email address';
      document.getElementById('email').classList.add('error');
      isValid = false;
    }
    
    // Phone validation (optional)
    const phone = document.getElementById('phone').value.trim();
    if (phone && phone.length < 10) {
      document.getElementById('phoneError').textContent = 'Please enter a valid phone number';
      document.getElementById('phone').classList.add('error');
      isValid = false;
    }
    
    // Enquiry type validation
    const enquiryType = document.getElementById('enquiryType').value;
    if (!enquiryType) {
      document.getElementById('enquiryTypeError').textContent = 'Please select an enquiry type';
      document.getElementById('enquiryType').classList.add('error');
      isValid = false;
    }
    
    // Message validation
    const message = document.getElementById('message').value.trim();
    if (!message) {
      document.getElementById('messageError').textContent = 'Message is required';
      document.getElementById('message').classList.add('error');
      isValid = false;
    } else if (message.length < 10) {
      document.getElementById('messageError').textContent = 'Message must be at least 10 characters';
      document.getElementById('message').classList.add('error');
      isValid = false;
    }
    
    return isValid;
  }

  // Generate reference ID
  function generateReferenceId() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `TPS-${timestamp}-${random}`;
  }

  // Show loading state
  function setLoading(isLoading) {
    if (isLoading) {
      submitBtn.disabled = true;
      btnText.style.display = 'none';
      btnLoading.style.display = 'inline-flex';
    } else {
      submitBtn.disabled = false;
      btnText.style.display = 'inline';
      btnLoading.style.display = 'none';
    }
  }

  // Show success modal
  function showSuccessModal(refId) {
    referenceId.textContent = refId;
    successModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Close success modal
  function closeSuccessModal() {
    successModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Handle form submission
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector('.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
      return;
    }
    
    // Set loading state
    setLoading(true);
    
    // Prepare form data
    const formData = {
      fullName: document.getElementById('fullName').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim() || 'Not provided',
      enquiryType: document.getElementById('enquiryType').value,
      enquiryTypeLabel: document.getElementById('enquiryType').selectedOptions[0].text,
      message: document.getElementById('message').value.trim(),
      referenceId: generateReferenceId(),
      submittedAt: new Date().toLocaleString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      })
    };
    
    try {
      // Replace with your actual EmailJS Service ID and Template ID
      const response = await emailjs.send(
        'YOUR_SERVICE_ID',      // Replace with your EmailJS service ID
        'YOUR_TEMPLATE_ID',     // Replace with your EmailJS template ID
        {
          from_name: formData.fullName,
          from_email: formData.email,
          phone: formData.phone,
          enquiry_type: formData.enquiryTypeLabel,
          message: formData.message,
          reference_id: formData.referenceId,
          submitted_at: formData.submittedAt,
          to_email: 'hope@politesupporters.org' // Your receiving email
        }
      );
      
      console.log('Email sent successfully:', response);
      
      // Show success modal
      showSuccessModal(formData.referenceId);
      
      // Reset form
      contactForm.reset();
      if (charCount) charCount.textContent = '0/1000';
      
    } catch (error) {
      console.error('Failed to send email:', error);
      
      // Show error message to user
      alert('Sorry, there was an error sending your message. Please try again or email us directly at hope@politesupporters.org');
      
    } finally {
      setLoading(false);
    }
  });

  // Close modal handlers
  closeSuccessBtn.addEventListener('click', closeSuccessModal);
  
  successModal.addEventListener('click', function(e) {
    if (e.target === successModal) {
      closeSuccessModal();
    }
  });
  
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && successModal.classList.contains('active')) {
      closeSuccessModal();
    }
  });

  // Real-time validation (clear errors on input)
  const inputs = document.querySelectorAll('#contactForm input, #contactForm select, #contactForm textarea');
  inputs.forEach(input => {
    input.addEventListener('input', function() {
      this.classList.remove('error');
      const errorEl = document.getElementById(this.id + 'Error');
      if (errorEl) errorEl.textContent = '';
    });
    
    input.addEventListener('change', function() {
      this.classList.remove('error');
      const errorEl = document.getElementById(this.id + 'Error');
      if (errorEl) errorEl.textContent = '';
    });
  });

  console.log('✅ Contact form initialized with EmailJS');
})();
