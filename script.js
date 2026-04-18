(function () {
  var menuBtn = document.querySelector(".menu-toggle");
  var mobileNav = document.getElementById("mobile-nav");

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener("click", function () {
      var open = mobileNav.hasAttribute("hidden");
      if (open) {
        mobileNav.removeAttribute("hidden");
        menuBtn.setAttribute("aria-expanded", "true");
      } else {
        mobileNav.setAttribute("hidden", "");
        menuBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  var form = document.getElementById("enquiry-form");
  var statusEl = document.getElementById("form-status");

  function setError(name, message) {
    var el = document.querySelector('[data-error-for="' + name + '"]');
    if (el) el.textContent = message || "";
  }

  function clearErrors() {
    document.querySelectorAll(".field-error").forEach(function (n) {
      n.textContent = "";
    });
  }

  function digitsOnly(s) {
    return (s || "").replace(/\D/g, "");
  }

  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearErrors();
    if (statusEl) statusEl.textContent = "";

    var data = new FormData(form);
    var ok = true;

    function require(name, message) {
      var v = (data.get(name) || "").toString().trim();
      if (!v) {
        setError(name, message);
        ok = false;
      }
    }

    require("student_name", "Please enter the student's name.");
    require("current_class", "Please select current class.");
    require("parent_name", "Please enter parent or guardian name.");

    var phone = (data.get("phone") || "").toString().trim();
    if (!phone) {
      setError("phone", "Please enter a mobile number.");
      ok = false;
    } else if (digitsOnly(phone).length < 10) {
      setError("phone", "Enter a valid 10-digit mobile number.");
      ok = false;
    }

    var email = (data.get("email") || "").toString().trim();
    if (!email) {
      setError("email", "Please enter an email address.");
      ok = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("email", "Please enter a valid email address.");
      ok = false;
    }

    require("city", "Please enter your city.");
    require("program_interest", "Please select a programme.");

    if (!data.get("consent")) {
      setError("consent", "Please accept to be contacted.");
      ok = false;
    }

    if (!ok) {
      if (statusEl) statusEl.textContent = "Fix the highlighted fields and try again.";
      return;
    }

    var summary = {
      student_name: data.get("student_name"),
      parent_name: data.get("parent_name"),
      phone: data.get("phone"),
      email: data.get("email"),
      city: data.get("city"),
      program_interest: data.get("program_interest"),
    };

    console.log("Enquiry payload (demo):", summary, Object.fromEntries(data.entries()));

    if (statusEl) {
      statusEl.textContent =
        "Thank you — your enquiry is recorded for this demo. Connect a server or form service to receive submissions.";
    }
    form.reset();
    clearErrors();
  });
})();
