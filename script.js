const whatsappNumber = String(window.LIUSHANCARE_CONFIG?.whatsappNumber || "85200000000").replace(/\D/g, "");
const languageButtons = document.querySelectorAll("[data-language]");
const translatableItems = document.querySelectorAll("[data-en][data-zh]");
const menuButton = document.getElementById("menuButton");
const nav = document.getElementById("nav");
const quoteForm = document.getElementById("quoteForm");

document.querySelectorAll("[data-wa-link]").forEach((link) => {
  const message = new URL(link.href).searchParams.get("text");
  link.href = `https://wa.me/${whatsappNumber}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
});

const contactPhone = document.querySelector("[data-contact-phone]");
if (contactPhone) {
  contactPhone.href = `tel:+${whatsappNumber}`;
  contactPhone.textContent = whatsappNumber.startsWith("852") && whatsappNumber.length === 11
    ? `+852 ${whatsappNumber.slice(3, 7)} ${whatsappNumber.slice(7)}`
    : `+${whatsappNumber}`;
}

let currentLanguage = "en";

function setLanguage(language) {
  currentLanguage = language === "zh" ? "zh" : "en";
  document.documentElement.lang = currentLanguage === "zh" ? "zh-HK" : "en";

  translatableItems.forEach((item) => {
    item.textContent = item.dataset[currentLanguage];
  });

  languageButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.language === currentLanguage));
  });

  try {
    localStorage.setItem("liushan-care-language", currentLanguage);
  } catch (_error) {
    // The page still works when browser storage is unavailable.
  }
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.language));
});

function closeMenu() {
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", currentLanguage === "zh" ? "開啟選單" : "Open menu");
  nav.classList.remove("is-open");
}

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", !isOpen
    ? (currentLanguage === "zh" ? "關閉選單" : "Close menu")
    : (currentLanguage === "zh" ? "開啟選單" : "Open menu"));
  nav.classList.toggle("is-open", !isOpen);
});

nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const header = document.querySelector(".header");
function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
}
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

quoteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!quoteForm.reportValidity()) return;

  const formData = new FormData(quoteForm);
  const isChinese = currentLanguage === "zh";
  const lines = [isChinese ? "你好，六善關愛慈善，我想查詢回收報價。" : "Hi 六善關愛慈善, I'd like an offer."];
  const details = [
    [isChinese ? "姓名" : "Name", formData.get("name")],
    [isChinese ? "電話" : "Phone", formData.get("phone")],
    [isChinese ? "回收類別" : "Category", quoteForm.elements.category.selectedOptions[0].textContent],
    [isChinese ? "物品詳情" : "Items", formData.get("items")],
    [isChinese ? "物品狀況" : "Condition", quoteForm.elements.condition.selectedOptions[0].textContent],
    [isChinese ? "上門日期" : "Preferred pickup date", formData.get("date")],
    [isChinese ? "地址／地區" : "Building / estate & district", formData.get("address")],
    [isChinese ? "升降機情況" : "Lift access", quoteForm.elements.lift.selectedOptions[0].textContent],
  ];

  details.forEach(([label, value]) => {
    if (String(value || "").trim()) lines.push(label + ": " + String(value).trim());
  });

  const whatsappUrl = "https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(lines.join("\n"));
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
});

document.getElementById("year").textContent = new Date().getFullYear();

try {
  const savedLanguage = localStorage.getItem("liushan-care-language");
  if (savedLanguage === "zh") setLanguage("zh");
} catch (_error) {
  // Use English when browser storage is unavailable.
}
