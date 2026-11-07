/*
  ✦ تعديل بيانات الدعوة:
  غيّري القيم الموجودة داخل CONFIG فقط، واتركي باقي الكود كما هو.
*/
const CONFIG = {
  groomName: "احمد",
  brideName: "ايمان",

  // اكتبي التاريخ بالشكل: YYYY-MM-DD
  eventDate: "2026-11-14",

  // اكتبي الوقت بصيغة 24 ساعة: HH:MM
  eventTime: "18:00",

  // الوقت المعروض للضيوف
  eventTimeLabel: "الساعة 6:00 مساءً",

  venueName: "منزل والد العروسه (الدكتور فتحى الدماصى )",
  venueAddress: ".",

  // ضعي رابط المكان من Google Maps بين علامتي التنصيص
  mapUrl: "https://maps.app.goo.gl/7z6qBhTt5xuvTArR8?g_st=ac",

  // اكتبي رقم واتساب بصيغة دولية بدون +، مثال مصر: 201XXXXXXXXX
  whatsappNumber: "",
};

// عرض بيانات الدعوة
document.getElementById("groomName").textContent = CONFIG.groomName;
document.getElementById("brideName").textContent = CONFIG.brideName;
document.getElementById("eventTime").textContent = CONFIG.eventTimeLabel;
document.getElementById("venueName").textContent = CONFIG.venueName;
document.getElementById("venueAddress").textContent = CONFIG.venueAddress;
document.getElementById("mapLink").href = CONFIG.mapUrl;

// تنسيق التاريخ بالعربية
const eventDate = new Date(`${CONFIG.eventDate}T${CONFIG.eventTime}:00`);
const dateFormatter = new Intl.DateTimeFormat("ar-EG", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});
document.getElementById("eventDateText").textContent =
  dateFormatter.format(eventDate);

// شاشة فتح الدعوة
const openButton = document.getElementById("openInvitation");
openButton.addEventListener("click", () => {
  document.getElementById("welcomeScreen").classList.add("is-hidden");
  document.getElementById("mainInvitation").classList.add("is-visible");
});

// العد التنازلي
function updateCountdown() {
  const now = new Date();
  const difference = eventDate.getTime() - now.getTime();

  if (Number.isNaN(eventDate.getTime())) {
    document.getElementById("countdownNote").textContent =
      "يرجى مراجعة تاريخ المناسبة في ملف script.js";
    return;
  }

  if (difference <= 0) {
    document.getElementById("days").textContent = "00";
    document.getElementById("hours").textContent = "00";
    document.getElementById("minutes").textContent = "00";
    document.getElementById("seconds").textContent = "00";
    document.getElementById("countdownNote").textContent =
      "فرحتنا النهارده! ❤️";
    return;
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  document.getElementById("days").textContent = String(days).padStart(2, "0");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(
    2,
    "0",
  );
  document.getElementById("seconds").textContent = String(seconds).padStart(
    2,
    "0",
  );
}
updateCountdown();
setInterval(updateCountdown, 1000);

// مشاركة الدعوة
document.getElementById("shareButton").addEventListener("click", async () => {
  const shareData = {
    title: "دعوة حفل الخطوبة",
    text: `يسعدنا دعوتكم لحضور حفل خطوبة ${CONFIG.groomName} و${CONFIG.brideName}. نتشرف بوجودكم معنا ❤️`,
    url: window.location.href,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(
        `${shareData.text}\n${shareData.url}`,
      );
      alert("تم نسخ نص الدعوة والرابط. يمكنك إرسالهما الآن ❤️");
    } else {
      alert("انسخي رابط الموقع من شريط العنوان وابعتيه لأصحابك.");
    }
  } catch (error) {
    if (error.name !== "AbortError") {
      alert("يمكنك نسخ رابط الموقع ومشاركته يدويًا.");
    }
  }
});

// إنشاء ملف موعد لإضافته إلى التقويم
document.getElementById("calendarButton").addEventListener("click", (event) => {
  event.preventDefault();

  const start = new Date(eventDate);
  const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);

  function toICSDate(date) {
    return date
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");
  }

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Engagement Invitation//AR",
    "BEGIN:VEVENT",
    `DTSTART:${toICSDate(start)}`,
    `DTEND:${toICSDate(end)}`,
    `SUMMARY:حفل خطوبة ${CONFIG.groomName} و${CONFIG.brideName}`,
    `LOCATION:${CONFIG.venueName} - ${CONFIG.venueAddress}`,
    "DESCRIPTION:يسعدنا مشاركتكم فرحتنا",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "engagement-invitation.ics";
  link.click();
  URL.revokeObjectURL(url);
});
