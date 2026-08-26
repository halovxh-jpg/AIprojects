// Modul untuk memanggil AI (Groq - gratis) dengan dua kepribadian berbeda.
// User biasa -> "Nova": asisten ramah gaya ngobrol santai (mirip ChatGPT).
// Admin      -> "Cipher": asisten teknis fokus coding, gaya lebih ringkas & presisi.

const USER_SYSTEM_PROMPT = Kamu adalah Nova, asisten AI yang ramah, hangat, dan enak diajak ngobrol, mirip gaya ChatGPT.   Jawab dengan bahasa yang sama dengan yang dipakai pengguna. Gunakan nada percakapan yang santai tapi tetap jelas dan membantu.   Boleh pakai emoji sesekali kalau cocok dengan suasana obrolan, tapi jangan berlebihan.;

const ADMIN_SYSTEM_PROMPT = Kamu adalah Cipher, asisten AI teknis untuk admin, dengan gaya campuran antara model coding kelas atas: presisi, ringkas, dan berorientasi solusi.   Fokus utamamu adalah membantu coding, debugging, arsitektur sistem, dan hal teknis lainnya.   Berikan jawaban yang padat, langsung ke inti, sertakan contoh kode jika relevan, dan jelaskan trade-off teknis singkat kalau perlu.   Jawab dengan bahasa yang sama dengan yang dipakai pengguna.;

async function callAI(message, history, persona) {
const apiKey = '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';
const model = process.env.AI_MODEL || 'llama-3.3-70b-versatile';

if (!apiKey) {
return {
ok: false,
text:
persona === 'admin'
? '[Cipher] Belum ada GROQ_API_KEY di file .env. Isi dulu API key-nya supaya aku bisa mulai jawab pertanyaan teknismu.'
: '[Nova] Hai! API key AI belum diisi di file .env, jadi aku belum bisa membalas beneran. Minta pemilik web ini untuk mengisi GROQ_API_KEY ya 🙂',
};
}

const systemPrompt = persona === 'admin' ? ADMIN_SYSTEM_PROMPT : USER_SYSTEM_PROMPT;

const messages = [
{ role: 'system', content: systemPrompt },
...history.map((h) => ({
role: h.sender === 'ai' ? 'assistant' : 'user',
content: h.content,
})),
{ role: 'user', content: message },
];

try {
const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'Authorization': Bearer ${apiKey},
},
body: JSON.stringify({
model,
max_tokens: 1024,
messages,
}),
});

if (!response.ok) {  
  const errText = await response.text();  
  console.error('Groq API error:', response.status, errText);  
  return {  
    ok: false,  
    text: `Maaf, terjadi error saat menghubungi AI (status ${response.status}). Cek console server untuk detail, dan pastikan AI_MODEL di .env valid.`,  
  };  
}  

const data = await response.json();  
const text = (data.choices || [])  
  .map((choice) => choice.message?.content || '')  
  .join('\n')  
  .trim();  

return { ok: true, text: text || '(AI tidak mengembalikan teks)' };

} catch (err) {
console.error('Gagal memanggil AI:', err);
return { ok: false, text: 'Maaf, gagal terhubung ke server AI. Cek koneksi internet server ini.' };
}
}

module.exports = { callAI };
