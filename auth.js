document.addEventListener("DOMContentLoaded", () => {
  const accountBtn     = document.getElementById("accountButton");

// مودال لاگین
const authModal      = document.getElementById("authModal");
const authClose      = document.getElementById("authClose");
const authForm       = document.getElementById("authForm");
const phoneInput     = document.getElementById("authPhone");
const phoneFieldWrap = document.getElementById("authPhoneField");
const phoneErrorEl   = document.getElementById("authPhoneError");
const extraFieldsBox = document.getElementById("authExtraFields");
const nameInput      = document.getElementById("authName");
const instaInput     = document.getElementById("authInsta");
const birthInput     = document.getElementById("authBirth");

birthInput.addEventListener("click", () => {
    birthInput.showPicker && birthInput.showPicker();
});

$(document).ready(function () {
  $("#birthDate").persianDatepicker({
    format: "YYYY/MM/DD",
    autoClose: true,
    initialValue: false,
  });
});


  // مودال حساب کاربری
  const accountModal   = document.getElementById("accountModal");
  const accountClose   = document.getElementById("accountClose");
  const logoutBtn      = document.getElementById("logoutButton");
  const accountPhoneEl = document.getElementById("accountPhone");
  const accountPlanEl  = document.getElementById("accountPlan");
  const accountRefEl   = document.getElementById("accountRef");

// تبدیل هر نوع عدد (فارسی/عربی) به انگلیسی
const toEnglishDigits = (str = "") =>
  str.replace(/[۰-۹٠-٩]/g, (d) => {
    const code = d.charCodeAt(0);
    // فارسی
    if (code >= 1776 && code <= 1785) {
      return String(code - 1776);
    }
    // عربی
    if (code >= 1632 && code <= 1641) {
      return String(code - 1632);
    }
    return d;
  });

// نرمال‌سازی شماره: حذف کاراکترهای غیرعددی + حذف صفر اول
const normalizePhone = (raw = "") => {
  let v = toEnglishDigits(raw).trim();
  v = v.replace(/\D/g, ""); // فقط رقم
  if (v.startsWith("0") && v.length > 0) {
    v = v.slice(1);
  }
  return v; // خروجی: بدون صفر اول
};

// شماره معتبر: دقیقاً ۱۰ رقم (بدون صفر اول)
const isValidPhone = (p) => p && p.length === 10;

// فرمت نمایش برای دکمه و پنل (۰ را برای نمایش برمی‌گردانیم)
const formatPhoneForDisplay = (p) => {
  if (!p) return "";
  let v = p.replace(/\D/g, "");
  if (v.length === 10) return "0" + v;
  if (v.length === 11 && v.startsWith("0")) return v;
  return v;
};

  const getPlanLabel = (plan) => {
    return plan === "pro" ? "پلن پرو" : "پلن رایگان";
  };

// =============================
// کنترل شماره موبایل + نمایش فیلدهای اضافی
// =============================
function handlePhoneInput() {
  let raw = phoneInput.value.trim();

  // تبدیل اعداد فارسی/عربی به انگلیسی
  raw = toEnglishDigits(raw);

  // فقط عدد
  raw = raw.replace(/\D/g, "");

  // حذف صفر اول
  if (raw.startsWith("0")) {
    raw = raw.slice(1);
  }

  phoneInput.value = raw;

  // اعتبارسنجی
  if (raw.length === 10) {
    phoneFieldWrap?.classList.remove("auth-field--error");
    extraFieldsBox?.classList.remove("auth-extra--hidden");
  } else {
    phoneFieldWrap?.classList.add("auth-field--error");
    extraFieldsBox?.classList.add("auth-extra--hidden");
  }
}


  // تنظیم متن دکمه حساب
const refreshAccountButton = () => {
  const savedPhone = localStorage.getItem("mimix_phone"); // ذخیره شده بدون صفر
  if (!accountBtn) return;

  if (savedPhone) {
    accountBtn.textContent = "حساب من (" + formatPhoneForDisplay(savedPhone) + ")";
  } else {
    accountBtn.textContent = "ورود / ساخت حساب";
  }
};


  // اول بار
  refreshAccountButton();

phoneInput?.addEventListener("input", handlePhoneInput);
phoneInput?.addEventListener("blur", handlePhoneInput);

  // کلیک روی دکمه حساب
  accountBtn?.addEventListener("click", () => {
    const savedPhone = localStorage.getItem("mimix_phone");
    const currentPlan = localStorage.getItem("mimix_plan") || "free";

    if (savedPhone) {
      // نمایش مودال حساب کاربری
  if (accountPhoneEl) accountPhoneEl.textContent = formatPhoneForDisplay(savedPhone);
      if (accountPlanEl)  accountPlanEl.textContent  = getPlanLabel(currentPlan);
      if (accountRefEl) {
        accountRefEl.textContent =
          localStorage.getItem("mimix_ref") || "فعلاً تنظیم نشده";
      }

      accountModal?.classList.remove("auth-hidden");
    } else {
      // اگر لاگین نیست → مودال لاگین
      authModal?.classList.remove("auth-hidden");
    }
  });

  // بستن مودال لاگین با دکمه ×
  authClose?.addEventListener("click", () => {
    if (authModal) {
      authModal.classList.add("auth-hidden");
    }
  });

  // بستن مودال حساب کاربری با دکمه ×
  accountClose?.addEventListener("click", () => {
    if (accountModal) {
      accountModal.classList.add("auth-hidden");
    }
  });

  // بستن با کلیک روی بک‌دراپ (هر دو مودال)
  authModal?.addEventListener("click", (e) => {
    if (e.target.classList.contains("auth-backdrop")) {
      authModal.classList.add("auth-hidden");
    }
  });

  accountModal?.addEventListener("click", (e) => {
    if (e.target.classList.contains("auth-backdrop")) {
      accountModal.classList.add("auth-hidden");
    }
  });

// سابمیت فرم لاگین (نسخه نمایشی)
authForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!phoneInput) return;

  const normalized = normalizePhone(phoneInput.value);

  // چک نهایی شماره
  if (!isValidPhone(normalized)) {
    if (phoneErrorEl) {
      phoneErrorEl.textContent = "شماره باید ۱۰ رقم و بدون صفر اول باشد.";
    }
    phoneFieldWrap?.classList.add("auth-field--error");
    phoneInput.focus();
    return;
  }

  const phone10 = normalized;              // ذخیره بدون صفر
  const displayPhone = formatPhoneForDisplay(phone10);

  const name  = (nameInput?.value  || "").trim();
  const insta = (instaInput?.value || "").trim();
  const birth = (birthInput?.value || "").trim();

  // ذخیره نمایشی در localStorage
  localStorage.setItem("mimix_phone", phone10);
  if (name)  localStorage.setItem("mimix_name", name);
  if (insta) localStorage.setItem("mimix_insta", insta);
  if (birth) localStorage.setItem("mimix_birth", birth);

  // اگر هر سه فیلد پر شده باشند، پلن پرو (نمایشی)؛ وگرنه رایگان
  let plan = "free";
  if (name && insta && birth) {
    plan = "pro";
  }
  localStorage.setItem("mimix_plan", plan);

  if (plan === "pro") {
    alert("ورود انجام شد. اطلاعاتت تکمیل شد و پلن پرو (نمایشی) برات فعال شد ✨");
  } else {
    alert("ورود نمایشی انجام شد. هر وقت خواستی می‌تونی اطلاعات پروفایل رو کامل کنی تا پلن پرو فعال بشه.");
  }

  if (authModal) {
    authModal.classList.add("auth-hidden");
  }
  refreshAccountButton();
});


  // خروج از حساب
  logoutBtn?.addEventListener("click", () => {
    localStorage.removeItem("mimix_phone");
    localStorage.removeItem("mimix_plan");
    localStorage.removeItem("mimix_ref");

    if (accountModal) {
      accountModal.classList.add("auth-hidden");
    }
    refreshAccountButton();
  });

  // کلیک روی کارت ابزارها
  const cards = document.querySelectorAll(".tool-card");

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const disabled  = card.getAttribute("data-disabled") === "true";
      const minPlan   = card.getAttribute("data-min-plan") || "free";
      const url       = card.getAttribute("data-url");
      const currPlan  = localStorage.getItem("mimix_plan") || "free";

      if (disabled) {
        alert("این ابزار هنوز فعال نشده. بعداً اضافه می‌کنیم ✨");
        return;
      }

      if (minPlan === "pro" && currPlan !== "pro") {
        alert("این ابزار فقط برای پلن پرو فعال می‌شه. بعداً می‌تونیم ارتقای پلن رو اضافه کنیم.");
        return;
      }

      if (url) {
        window.open(url, "_blank");
      }
    });
  });
});
/* === فعال‌سازی تقویم شمسی برای authBirth === */
document.addEventListener("DOMContentLoaded", function () {
  const birthInput = document.getElementById("authBirth");

  if (typeof $ !== "undefined" && birthInput) {
    $("#authBirth").persianDatepicker({
      format: "YYYY/MM/DD",
      dayPicker: {
        onSelect: (date) => {
          birthInput.value = date;
        }
      },
      autoClose: true,
      initialValue: false,
      calendar: {
        persian: {
          locale: "fa"
        }
      }
    });
  }
});

