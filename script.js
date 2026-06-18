const reveals = document.querySelectorAll(".reveal");
function revealOnScroll() {
  reveals.forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 100) {
      el.classList.add("active");
    }
  });
}
window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

const form = document.getElementById("contactForm");
if (form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name    = document.getElementById("name").value.trim();
    const email   = document.getElementById("email").value.trim();
    const phone   = document.getElementById("phone").value.trim();

    if (!name || !email || !phone) {
      alert("Please fill in your name, email, and contact number.");
      return;
    }
    if (!email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }

    const btn = form.querySelector("button[type='submit']");
    btn.textContent = "Sending…";
    btn.disabled = true;

    const SHEETS_URL = "https://script.google.com/macros/s/AKfycbxA0G7K59Vu9t2ENeoxtUSpak4u9SHz2fDtwuIbCaaKXIHZBiEHF2H7XyshoT9AaDby/exec";

    try {
      // 1. Send to Formspree → triggers email notification to you
      const emailRes = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });

      // 2. Send to Google Sheets → saves the row silently
      await fetch(SHEETS_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({
          name:    name,
          email:   email,
          phone:   phone,
          message: document.getElementById("message").value.trim()
        }),
        headers: { "Content-Type": "application/json" }
      });

      if (emailRes.ok) {
        alert("Thank you for reaching out to Lyra Academy.\nWe will contact you shortly to schedule your trial class.");
        form.reset();
      } else {
        alert("Something went wrong. Please try again or email us directly.");
      }

    } catch (err) {
      alert("Network error. Please check your connection and try again.");
    }

    btn.textContent = "Request a Trial Class";
    btn.disabled = false;
  });
}