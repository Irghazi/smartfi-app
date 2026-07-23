import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { message, history, userData } = await request.json();

    const formattedHistory = history.map((msg) => ({
      role: msg.role === 'ai' ? 'assistant' : 'user',
      content: msg.content
    }));

    const systemPrompt = {
      role: 'system',
      content: `Kamu adalah SmartFi, teman sekaligus asisten keuangan AI pribadi yang ramah. Gaya bahasamu sopan tapi santai (kasual), gunakan kata ganti "aku" untuk dirimu dan "kamu" untuk pengguna. Jelaskan konsep keuangan dengan bahasa awam yang mudah dipahami.

  Data keuangan pengguna saat ini:
  ${userData ? JSON.stringify(userData) : 'Data transaksi belum tersedia.'}

  ATURAN PERILAKU & BATASAN (SANGAT KETAT):
  1. FOKUS KEUANGAN SAJA: Kamu HANYA boleh menjawab pertanyaan seputar keuangan, anggaran, investasi, pencatatan transaksi, atau menabung. Jika pengguna meminta kode pemrograman (Python, dll), menulis esai umum, atau membahas topik di luar keuangan, TOLAK dengan sopan dan ingatkan bahwa kamu khusus membantu urusan keuangan.
  2. PANJANG JAWABAN: Berikan penjelasan yang cukup detail agar mudah dipahami, namun tetap efisien dan langsung ke intinya (jangan bertele-tele).
  3. TANPA EMOJI (MUTLAK): DILARANG KERAS menggunakan emoji, emotikon, simbol unicode, atau karakter khusus apapun. Gunakan HANYA huruf, angka, dan tanda baca standar.
  4. RESPON NATURAL: Jika pengguna hanya menyapa (misal: "halo", "apa kabar?"), balaslah dengan ramah tanpa menyebutkan data keuangan.
  5. FORMAT UANG: WAJIB gunakan format Rupiah dengan titik untuk ribuan (contoh: "Rp 300.000").
  6. FORMAT TEKS: Gunakan huruf tebal (**teks**) untuk nominal uang dan nama kategori.`
    };

    const messages = [
      systemPrompt, 
      ...formattedHistory,
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: messages,
        max_tokens: 800,
        temperature: 0.6
      })
    });

    if (!response.ok) {
      if (response.status === 429) {
        return NextResponse.json({ reply: "Maaf, antrean server AI sedang penuh (Error 429). Mohon tunggu sekitar satu menit lalu coba lagi." });
      }
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const aiReply = data.choices[0].message.content;
    
    // Membersihkan karakter aneh (Emoji, Tofu, Block Elements)
    const sanitizedReply = aiReply
      .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\uFFFD\u2500-\u25FF\u200B-\u200D\uFEFF\u25AF]/gu, '')
      .trim();

    return NextResponse.json({ reply: sanitizedReply });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memproses pesan.' },
      { status: 500 }
    );
  }
}
