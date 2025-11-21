// Fontix v0.1 - منطق پیش‌نمایش

document.addEventListener("DOMContentLoaded", () => {
  const inputEl = document.getElementById("fxInput");
  const previewTextEl = document.getElementById("fxPreviewText");

  const fontSelect = document.getElementById("fxFont");
  const sizeRange = document.getElementById("fxFontSize");
  const sizeValueLabel = document.getElementById("fxSizeValue");
  const weightRange = document.getElementById("fxFontWeight");
  const weightValueLabel = document.getElementById("fxWeightValue");

  const lineHeightRange = document.getElementById("fxLineHeight");
  const lineHeightValue = document.getElementById("fxLineHeightValue");
  const letterRange = document.getElementById("fxLetterSpacing");
  const letterValue = document.getElementById("fxLetterValue");

  const styleButtons = document.querySelectorAll(".fx-style-btn");
  const textColorButtons = document.querySelectorAll("#fxTextColors .fx-color-dot");
  const bgColorButtons = document.querySelectorAll("#fxBgColors .fx-color-dot");

  const previewCard = document.getElementById("fxPreviewCard");
  const downloadBtn = document.getElementById("fxDownload");
  const copyBtn = document.getElementById("fxCopy");

  /* ------ متن ------ */
  function updateText() {
    const value = (inputEl.value || "").trim();
    previewTextEl.textContent = value || "متنی برای پیش‌نمایش وارد کن...";
  }

  /* ------ فونت ------ */
  function updateFont() {
    const value = fontSelect.value;
    switch (value) {
      case "Tahoma":
        previewTextEl.style.fontFamily = '"Tahoma", "Vazirmatn", system-ui, sans-serif';
        break;
      case "IRANSans":
        previewTextEl.style.fontFamily = '"IRANSans", "Vazirmatn", system-ui, sans-serif';
        break;
      default:
        previewTextEl.style.fontFamily = '"Vazirmatn", system-ui, sans-serif';
    }
  }

  function updateFontSize() {
    const px = parseInt(sizeRange.value, 10) || 24;
    previewTextEl.style.fontSize = px + "px";
    if (sizeValueLabel) sizeValueLabel.textContent = px + "px";
  }

  function updateFontWeight() {
    const w = parseInt(weightRange.value, 10) || 400;
    previewTextEl.style.fontWeight = String(w);
    if (weightValueLabel) weightValueLabel.textContent = String(w);
  }

  /* ------ استایل آماده ------ */
  function updateStyle(styleName) {
    previewTextEl.classList.remove(
      "fx-style-simple",
      "fx-style-shadow",
      "fx-style-outline",
      "fx-style-badge"
    );
    previewTextEl.classList.add("fx-style-" + styleName);

    styleButtons.forEach((btn) =>
      btn.classList.toggle("fx-style-btn--active", btn.dataset.style === styleName)
    );
  }

  /* ------ رنگ متن / پس‌زمینه ------ */
  function updateTextColor(color) {
    previewTextEl.style.color = color;
    textColorButtons.forEach((btn) =>
      btn.classList.toggle("fx-color-dot--active", btn.dataset.color === color)
    );
  }

  function updateBackgroundColor(color) {
    previewTextEl.style.background =
      color === "transparent" ? "transparent" : color;

    bgColorButtons.forEach((btn) =>
      btn.classList.toggle("fx-color-dot--active", btn.dataset.color === color)
    );
  }

  /* ------ فاصله خطوط و حروف ------ */
  function updateLineHeight() {
    const v = parseFloat(lineHeightRange.value) || 1.4;
    previewTextEl.style.lineHeight = v;
    if (lineHeightValue) lineHeightValue.textContent = v.toFixed(1);
  }

  function updateLetterSpacing() {
    const v = parseFloat(letterRange.value) || 0;
    previewTextEl.style.letterSpacing = v + "px";
    if (letterValue) letterValue.textContent = v.toFixed(1);
  }

  /* ------ دانلود / کپی تصویر ------ */

  function dataURLToBlob(dataURL) {
    const parts = dataURL.split(",");
    const byteString = atob(parts[1]);
    const mimeString = parts[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  async function captureCanvas() {
    if (!window.html2canvas) return null;
    // فقط خود متن، با پس‌زمینه شفاف
    return await html2canvas(previewTextEl, {
      backgroundColor: null,
      scale: 3,
      useCORS: true
    });
  }

  async function downloadPng() {
    if (!previewCard) return;
    downloadBtn.disabled = true;
    const originalText = downloadBtn.textContent;
    downloadBtn.textContent = "در حال آماده‌سازی...";

    try {
      const canvas = await captureCanvas();
      if (!canvas) throw new Error("canvas fail");
      const dataURL = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "fontix-text.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      downloadBtn.textContent = "دانلود شد 🎉 (دوباره دانلود کن)";
    } catch (e) {
      console.error(e);
      alert("مشکلی در ساخت تصویر پیش اومد. دوباره امتحان کن.");
      downloadBtn.textContent = originalText;
    } finally {
      setTimeout(() => {
        downloadBtn.disabled = false;
        downloadBtn.textContent = originalText;
      }, 1500);
    }
  }

  async function copyImage() {
    if (!navigator.clipboard || !window.ClipboardItem) {
      alert("مرورگر شما کپی مستقیم تصویر را پشتیبانی نمی‌کند. از دانلود PNG استفاده کن.");
      return;
    }

    copyBtn.disabled = true;
    const originalText = copyBtn.textContent;
    copyBtn.textContent = "در حال کپی...";

    try {
      const canvas = await captureCanvas();
      if (!canvas) throw new Error("canvas fail");
      const dataURL = canvas.toDataURL("image/png");
      const blob = dataURLToBlob(dataURL);

      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob })
      ]);

      copyBtn.textContent = "کپی شد ✅";
    } catch (e) {
      console.error(e);
      alert("کپی تصویر ناموفق بود. از دکمه دانلود استفاده کن.");
      copyBtn.textContent = originalText;
    } finally {
      setTimeout(() => {
        copyBtn.disabled = false;
        copyBtn.textContent = originalText;
      }, 1500);
    }
  }

  /* ------ تب‌ها (فونت / استایل / رنگ / افکت‌ها) ------ */
  const tabs = document.querySelectorAll(".fx-tab");
  const tabContents = document.querySelectorAll(".fx-tab-content");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetId = tab.dataset.tab;

      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      tabContents.forEach((panel) => {
        panel.classList.toggle("active", panel.id === targetId);
      });
    });
  });

  /* ------ لیسنرها ------ */
  inputEl.addEventListener("input", updateText);
  fontSelect.addEventListener("change", updateFont);
  sizeRange.addEventListener("input", updateFontSize);
  weightRange.addEventListener("input", updateFontWeight);
  lineHeightRange.addEventListener("input", updateLineHeight);
  letterRange.addEventListener("input", updateLetterSpacing);

  styleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const styleName = btn.dataset.style || "simple";
      updateStyle(styleName);
    });
  });

  textColorButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const c = btn.dataset.color;
      updateTextColor(c);
    });
  });

  bgColorButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const c = btn.dataset.color;
      updateBackgroundColor(c);
    });
  });

  downloadBtn.addEventListener("click", downloadPng);
  copyBtn.addEventListener("click", copyImage);

  /* ------ مقدار اولیه ------ */
  updateText();
  updateFont();
  updateFontSize();
  updateFontWeight();
  updateStyle("simple");
  updateTextColor("#E3EED4");
  updateBackgroundColor("transparent");
  updateLineHeight();
  updateLetterSpacing();
});
