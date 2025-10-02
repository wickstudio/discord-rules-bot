
require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  Events,
  PermissionsBitField,
  MessageFlags,
  AttachmentBuilder,
} = require('discord.js');

const fs = require('fs');
const path = require('path');
const rules = require('./rules.json');
const { startServer } = require('./alive.js');

const PREFIX  = process.env.PREFIX  || '!';
const COMMAND = (process.env.CMD || 'dr').toLowerCase();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, 
  ],
  partials: [Partials.Channel],
});

// ===== Utilities =====

const fileCache = new Map();
function readTextFile(p) {
  const abs = path.resolve(process.cwd(), p);
  if (fileCache.has(abs)) return fileCache.get(abs);
  const data = fs.readFileSync(abs, 'utf8');
  fileCache.set(abs, data);
  return data;
}

function pickFirstEmoji(str) {
  if (typeof str !== 'string') return null;
  const re = /\p{Extended_Pictographic}(?:\uFE0F|\uFE0E)?(?:\u200D\p{Extended_Pictographic}(?:\uFE0F|\uFE0E)?)*?/gu;
  const m = re.exec(str);
  return m ? m[0] : null;
}

function normalizeEmoji(input) {
  if (!input) return null;
 
  if (typeof input === 'string' && input.includes(':')) {
    const m = input.match(/^<a?:\w+:(\d+)>$/);
    if (m) return { id: m[1] }; 
    const uni = pickFirstEmoji(input);
    return uni || null;
  }

  if (typeof input === 'string') {
    const uni = pickFirstEmoji(input);
    return uni || null;
  }

  if (typeof input === 'object' && input.id) {
    return { id: String(input.id), name: input.name, animated: !!input.animated };
  }

  return null;
}

function chunk(text, max = 4000) {
  const out = [];
  let cur = '';
  for (const line of String(text).split('\n')) {
    if ((cur + line + '\n').length > max) {
      if (cur) out.push(cur);
      if (line.length > max) {
        for (let i = 0; i < line.length; i += max) out.push(line.slice(i, i + max));
        cur = '';
      } else {
        cur = line + '\n';
      }
    } else {
      cur += line + '\n';
    }
  }
  if (cur) out.push(cur);
  return out;
}

const lastUsePerChannel = new Map();
function canRunInChannel(channelId, cooldownMs = 3000) {
  const now = Date.now();
  const last = lastUsePerChannel.get(channelId) || 0;
  if (now - last < cooldownMs) return false;
  lastUsePerChannel.set(channelId, now);
  return true;
}

function buildSelectOptionsFromRules(list) {
  const used = new Set();
  const fixes = [];

  return list.slice(0, 25).map((rule, idx) => {
    let value = String(rule?.id ?? `rule${idx + 1}`).trim();
    if (!value) value = `rule${idx + 1}`;
    if (used.has(value)) {
      const base = value;
      let k = 2;
      while (used.has(`${base}_${k}`)) k++;
      value = `${base}_${k}`;
      fixes.push(`${base} -> ${value}`);
    }
    used.add(value);

    const opt = {
      label: String(rule?.title ?? value).slice(0, 100) || value,
      description: value.slice(0, 100),
      value,
    };

    const em = normalizeEmoji(rule?.emoji);
    if (em) opt.emoji = em; 

    return opt;
  });
}

// ===== Bot =====

client.once(Events.ClientReady, () => {
  console.log(`Bot is Ready! ${client.user.tag}`);
  console.log(`by ghlais`);
 console.log(`Code by Wick Studio`);
  console.log(`discord.gg/wicks`);
});

// يبني منيو القوانين (Embed + Row)
async function makeMenu() {
  const options = buildSelectOptionsFromRules(rules);

  const row = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('rules_select')
      .setPlaceholder('قائمة القوانين')
      .addOptions(options),
  );

  const embed = new EmbedBuilder()
    .setColor('#24242c')
    .setThumbnail('https://media.discordapp.net/attachments/1244648462100860949/1244648462327480441/bbbff967f9b04bf6_1-18.png.webp?ex=68df2b75&is=68ddd9f5&hm=fb7425f2697943ff68c79f6ba8ea01fc0a012c92be11bf0d1cc429e16cee40f6&format=webp&width=550&height=309&')
    .setTitle('قوانين السيرفر')
    .setDescription('الرجاء اختيار أحد القوانين لقرائته من قائمة الاختيارات تحت')
    .setImage('https://media.discordapp.net/attachments/1244648462100860949/1244648462327480441/bbbff967f9b04bf6_1-18.png.webp?ex=68df2b75&is=68ddd9f5&hm=fb7425f2697943ff68c79f6ba8ea01fc0a012c92be11bf0d1cc429e16cee40f6&format=webp&width=550&height=309&')
    .setFooter({ text: 'Rules Bot' })
    .setTimestamp();

  return { embed, row };
}

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot || !message.guild) return;
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
  const cmd  = (args.shift() || '').toLowerCase();

  // !dr
  if (cmd === COMMAND) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply({ content: 'تحتاج صلاحيات ادمن لاستخدام الأمر' });
    }
    if (!canRunInChannel(message.channel.id)) {
      return message.react('⏳').catch(() => {});
    }

    try {
      const { embed, row } = await makeMenu();
      await message.channel.send({ embeds: [embed], components: [row] });
      try { await message.delete(); } catch {}
    } catch (e) {
      console.error('send menu error', e);
      try {
        const lines = rules.slice(0, 25).map((r, i) => {
          const em = normalizeEmoji(r.emoji);
          const emStr = typeof em === 'string' ? em : '';
          const val = String(r?.id ?? `rule${i + 1}`);
          return `${emStr || '📜'} ${r.title || val} — ${val}`;
        });
        await message.channel.send('تعذر إرسال المنيو، عرضت قائمة نصية:\n' + lines.join('\n'));
      } catch {}
      message.reply('تعذر إرسال المنيو: تأكد صلاحيات البوت (Send Messages + Embed Links) وصيغة الإيموجي وقيم IDs غير مكررة.').catch(() => {});
    }
  }

  if (cmd === 'ping') return message.reply('pong');
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isStringSelectMenu() || interaction.customId !== 'rules_select') return;

  async function safeDefer() {
    try {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    } catch {
      try { await interaction.deferReply({ ephemeral: true }); } catch {}
    }
  }
  if (!interaction.deferred && !interaction.replied) {
    await safeDefer();
  }

  try {
    const selectedId = interaction.values[0];
    const baseId = String(selectedId).split('_')[0];
    const rule = rules.find((r) => String(r.id) === baseId) ||
                 rules.find((r) => String(r.id) === String(selectedId)); 

    if (!rule) {
      return interaction.editReply({ content: 'القانون غير موجود' });
    }

    let text = 'لا يوجد وصف';
    try {
      text = readTextFile(rule.description);
    } catch {
      text = 'تعذر قراءة ملف الوصف تأكد من المسار في rules.json';
    }

    const parts = chunk(text, 4000);
    const first = parts.shift() || 'لا يوجد وصف';

    const base = new EmbedBuilder()
      .setColor('#24242c')
      .setTitle(rule.title || String(rule.id))
      .setDescription(first)
      .setFooter({ text: 'Rules Bot' })
      .setTimestamp();

    await interaction.editReply({ embeds: [base] });

    if (parts.length > 4) {
      const file = new AttachmentBuilder(Buffer.from(text, 'utf8'), { name: `${rule.id || 'rule'}.txt` });
      await interaction.followUp({
        content: 'النص طويل تم إرساله كملف',
        files: [file],
        flags: MessageFlags.Ephemeral,
      }).catch(async () => {
        await interaction.followUp({ content: 'النص طويل تم إرساله كملف', files: [file], ephemeral: true });
      });
    } else {
      for (let i = 0; i < parts.length; i++) {
        const cont = new EmbedBuilder()
          .setColor('#24242c')
          .setTitle(`${rule.title || rule.id} — تابع ${i + 2}`)
          .setDescription(parts[i])
          .setFooter({ text: 'Rules Bot' })
          .setTimestamp();

        await interaction.followUp({ embeds: [cont], flags: MessageFlags.Ephemeral })
          .catch(async () => { await interaction.followUp({ embeds: [cont], ephemeral: true }); });
      }
    }
  } catch (err) {
    console.error('rules_select error', err);
    try {
      await interaction.editReply({ content: 'صار خطأ داخلي، حاول مرة ثانية.' });
    } catch {}
  }
});

startServer();
client.login(process.env.TOKEN);


