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

  function enquiryEndpoint() {
    if (typeof window === "undefined" || !window.TCA_ENQUIRY_WEB_APP_URL) return "";
    return String(window.TCA_ENQUIRY_WEB_APP_URL).trim();
  }

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

  function ensureHelpTopicsField() {
    if (!form) return null;
    var el = form.querySelector('input[name="help_topics"]');
    if (!el) {
      el = document.createElement("input");
      el.type = "hidden";
      el.name = "help_topics";
      form.appendChild(el);
    }
    var helps = [];
    form.querySelectorAll(".help-cb:checked").forEach(function (cb) {
      helps.push(cb.value);
    });
    el.value = helps.join(", ");
    return el;
  }

  function formDataToLines(data) {
    var order = [
      "student_name",
      "dob",
      "gender",
      "current_class",
      "parent_name",
      "relationship",
      "phone",
      "phone_alt",
      "email",
      "city",
      "state",
      "program_interest",
      "help_topics",
      "callback",
      "message",
      "consent",
    ];
    var lines = [];
    order.forEach(function (key) {
      var v = data.get(key);
      if (v != null && String(v).trim() !== "") {
        lines.push(key + ": " + String(v).trim());
      }
    });
    return lines.join("\n");
  }

  function submitViaMailto(data) {
    var body = formDataToLines(data);
    var subject = "The Career Advisor — enquiry";
    var mail =
      "mailto:counsellorpoint2019@gmail.com?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(body);
    window.location.href = mail;
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
    } else {
      var d = digitsOnly(phone);
      if (d.length < 10) {
        setError("phone", "Enter a valid mobile number (at least 10 digits).");
        ok = false;
      }
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

    ensureHelpTopicsField();
    data = new FormData(form);

    var url = enquiryEndpoint();
    if (url) {
      form.action = url;
      form.method = "post";
      form.target = "tca-enquiry-target";
      if (statusEl) statusEl.textContent = "Sending your enquiry…";
      window.HTMLFormElement.prototype.submit.call(form);
      setTimeout(function () {
        form.reset();
        clearErrors();
        if (statusEl) {
          statusEl.textContent =
            "Thank you. If you do not hear back within two working days, message us on WhatsApp at +91 78427 63001.";
        }
      }, 800);
      return;
    }

    submitViaMailto(data);
    if (statusEl) {
      statusEl.textContent =
        "Your email app should open with the enquiry text. Send the message to reach us at counsellorpoint2019@gmail.com. For a one-step form, add your Google Apps Script URL in config.js.";
    }
  });
})();
