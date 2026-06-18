const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
  const wasActive = /\bactive\b/.test(navLinks.className);
  navLinks.classList.toggle("active");
  hamburger.innerHTML = !wasActive
    ? '<i class="fas fa-times"></i>'
    : '<i class="fas fa-bars"></i>';
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
    hamburger.innerHTML = '<i class="fas fa-bars"></i>';
  });
});

const backToTopBtn = document.querySelector(".back-to-top");

window.addEventListener("scroll", () => {
  if (window.pageYOffset > 300) {
    backToTopBtn.classList.add("active");
  } else {
    backToTopBtn.classList.remove("active");
  }
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: "smooth",
      });
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const digits = document.querySelectorAll(".phone-digit");
  const fullPhone = document.getElementById("full-phone");
  const errorMsg = document.querySelector(".phone-error");
  const hearAboutSelect = document.getElementById("how-did-you-hear");
  const otherSourceContainer = document.getElementById(
    "other-source-container",
  );

  errorMsg.style.display = "none";

  hearAboutSelect.addEventListener("change", function () {
    if (this.value === "Other") {
      otherSourceContainer.style.display = "block";
      document.getElementById("other-source").setAttribute("required", "");
    } else {
      otherSourceContainer.style.display = "none";
      document.getElementById("other-source").removeAttribute("required");
    }
  });

  digits.forEach((digit) => {
    digit.addEventListener("input", function (e) {
      if (this.value.length === 1) {
        const nextId = this.getAttribute("data-next");
        if (nextId) document.getElementById(nextId).focus();
      }
      updateFullPhone();
    });

    digit.addEventListener("keydown", function (e) {
      if (e.key === "Backspace" && this.value.length === 0) {
        const prevId = this.getAttribute("data-prev");
        if (prevId) document.getElementById(prevId).focus();
      }
    });
  });

  function updateFullPhone() {
    let phoneNumber = "";
    digits.forEach((digit) => {
      phoneNumber += digit.value;
    });
    fullPhone.value = phoneNumber;

    errorMsg.style.display = phoneNumber.length === 10 ? "none" : "block";
  }

  const contactForm = document.getElementById("message-form");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      updateFullPhone();

      if (fullPhone.value.length !== 10) {
        e.preventDefault();
        errorMsg.style.display = "block";
        digits[0].focus();
        return;
      }

      const submitBtn = contactForm.querySelector(".submit-btn");
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      fetch(contactForm.action, {
        method: contactForm.method,
        body: new FormData(contactForm),
        headers: {
          Accept: "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            // Success message
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            contactForm.reset();
            otherSourceContainer.style.display = "none";
          } else {
            throw new Error("Network response was not ok");
          }
        })
        .catch((error) => {
          submitBtn.innerHTML =
            '<i class="fas fa-exclamation-triangle"></i> Error Sending';
          console.error("Error:", error);
        })
        .finally(() => {
          setTimeout(() => {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
          }, 3000);
        });
    });
  }

  const animateOnScroll = () => {
    const elements = document.querySelectorAll(
      ".about-content, .skill-category, .project-card, .testimonial-card",
    );

    elements.forEach((element) => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.3;

      if (elementPosition < screenPosition) {
        element.style.opacity = "1";
        element.style.transform = "translateY(0)";
      }
    });
  };
  document
    .querySelectorAll(
      ".about-content, .skill-category, .project-card, .testimonial-card",
    )
    .forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    });

  window.addEventListener("scroll", animateOnScroll);
  window.addEventListener("load", animateOnScroll);
});

// Payment Modal Functions
let selectedAmount = 0;

function openPaymentModal(type) {
  const modalId = type + "Modal";
  document.getElementById(modalId).style.display = "block";
  document.body.style.overflow = "hidden";

  // Generate QR code if opening QR modal
  if (type === "qr") {
    generateQRCode(100); // Default amount
  }
}

function closePaymentModal(modalId) {
  document.getElementById(modalId).style.display = "none";
  document.body.style.overflow = "auto";
  selectedAmount = 0;

  // Reset all amount buttons
  document.querySelectorAll(".amount-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
}

// Close modal when clicking outside
window.onclick = function (event) {
  if (/\bpayment-modal\b/.test(event.target.className)) {
    event.target.style.display = "none";
    document.body.style.overflow = "auto";
  }
};

// Copy UPI ID
function copyUPIId(event) {
  const upiId = document.getElementById("upi-id").textContent;
  navigator.clipboard.writeText(upiId).then(() => {
    const btn = event.target.closest(".copy-btn");
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
    btn.style.background = "#27ae60";

    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.style.background = "";
    }, 2000);
  });
}

// Amount selection functions
function selectAmount(amount, event) {
  selectedAmount = amount;
  document.querySelectorAll("#upiModal .amount-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  if (event && event.target) {
    event.target.classList.add("active");
  }
  document.getElementById("customAmount").value = "";
}

function selectAmountQR(amount, event) {
  selectedAmount = amount;
  document.querySelectorAll("#qrModal .amount-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  if (event && event.target) {
    event.target.classList.add("active");
  }
  document.getElementById("customAmountQR").value = "";
  generateQRCode(amount);
}

function selectAmountCard(amount, event) {
  selectedAmount = amount;
  document.querySelectorAll("#cardModal .amount-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  if (event && event.target) {
    event.target.classList.add("active");
  }
  document.getElementById("customAmountCard").value = "";
}

// Generate QR Code using QR Code API
function generateQRCode(amount) {
  const upiId = "kamranalam62073@okicici";
  const name = "Kamran Alam";
  const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR`;

  const qrCodeContainer = document.getElementById("qr-code-image");
  qrCodeContainer.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiString)}" alt="UPI QR Code">`;
}

function updateQRCode() {
  const customAmount = document.getElementById("customAmountQR").value;
  if (customAmount && customAmount > 0) {
    selectedAmount = parseInt(customAmount);
    generateQRCode(selectedAmount);
    document.querySelectorAll("#qrModal .amount-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
  }
}

// UPI Payment
function initiateUPIPayment() {
  const customAmount = document.getElementById("customAmount").value;
  const amount = customAmount || selectedAmount;

  if (!amount || amount <= 0) {
    alert("Please select or enter an amount");
    return;
  }

  const upiId = "kamranalam62073@okicici";
  const name = "Kamran Alam";
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR`;

  // Try to open UPI app
  window.location.href = upiUrl;

  // Show confirmation message
  setTimeout(() => {
    alert(
      `Thank you for your support! Please complete the payment of ₹${amount} in your UPI app.\\n\\nAfter payment, kindly send the screenshot to kamranalam62073@gmail.com`,
    );
  }, 1000);
}

// Card Payment
function initiateCardPayment() {
  const customAmount = document.getElementById("customAmountCard").value;
  const amount = customAmount || selectedAmount;

  if (!amount || amount <= 0) {
    alert("Please select or enter an amount");
    return;
  }

  alert(
    `Thank you for choosing to donate ₹${amount}!\\n\\nPlease select a payment gateway to proceed.`,
  );
}

function processPayment(gateway) {
  const customAmount = document.getElementById("customAmountCard").value;
  const amount = customAmount || selectedAmount;

  if (!amount || amount <= 0) {
    alert("Please select or enter an amount first");
    return;
  }

  // In a real implementation, you would integrate with the actual payment gateway
  // For now, we'll show a message
  const gatewayNames = {
    razorpay: "Razorpay",
    paytm: "Paytm",
    phonepe: "PhonePe",
    googlepay: "Google Pay",
  };

  alert(
    `Redirecting to ${gatewayNames[gateway]} for payment of ₹${amount}...\\n\\nNote: This is a demo. To set up actual payments, you'll need to integrate with ${gatewayNames[gateway]}'s API.\\n\\nFor now, please use UPI or QR code payment option.`,
  );

  // You can add actual payment gateway integration here
  // Example for Razorpay:
  // var options = {
  //   key: "YOUR_KEY_ID",
  //   amount: amount * 100,
  //   currency: "INR",
  //   name: "Kamran The Coder X",
  //   description: "Support My Work",
  //   handler: function (response) {
  //     alert("Payment successful!");
  //   }
  // };
  // var rzp = new Razorpay(options);
  // rzp.open();
}
const link = document.getElementById("myLink");
const toast = document.getElementById("errorToast");

link.addEventListener("click", function (e) {
  e.preventDefault();
  e.stopPropagation();

  toast.classList.add("show");
});

toast.addEventListener("click", function (e) {
  e.stopPropagation();
});

document.addEventListener("click", function () {
  toast.classList.remove("show");
});
