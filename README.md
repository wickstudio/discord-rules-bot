
# Discord Rules Bot

بوت ديسكورد بسيط يعرض القوانين عند دخول الأعضاء الجدد.  
تم تطويره من قبل Ghlais & Wick Studio ©

## ✨ المميزات
- إرسال القوانين بشكل مرتب.
- تخزين القوانين في ملف `rules.json` مع دعم ملفات إضافية في مجلد `data/`.
- سهل التعديل والتخصيص.
- يعمل على Node.js مع مكتبة Discord.js.

## 📦 التثبيت
```bash
git clone https://github.com/wickstudio/discord-rules-bot.git
cd discord-rules-bot-main
npm install
````

## ⚙️ الإعداد

1. أنشئ ملف `.env` يحتوي على:

   ```
   TOKEN=توكن البوت
   PREFIX=
   PORT=بورت الموقع
   ```
2. عدل القوانين في `rules.json` أو أضف قوانين نصية في `data/`.

## ▶️ التشغيل

```bash
node index.js
```

## 🛠️ الملفات

* `index.js`: الملف الأساسي لتشغيل البوت.
* `alive.js`: ملف الموقع.
* `rules.json`: يحتوي على القوانين الأساسية.
* `data/`: يحتوي ملفات نصية إضافية يمكن استدعاؤها.
* `.env`: متغيرات البيئة (توكن وإعدادات).
* `package.json`: تعريف الحزم والاعتماديات.

## 📜 الحقوق

* المطور: Ghlais
* الدعم والتطوير: Wick Studio
* جميع الحقوق محفوظة © 2025
