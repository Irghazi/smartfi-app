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
      content: `Kamu adalah SmartFi, asisten keuangan AI pribadi yang cerdas dan profesional. Jawablah selalu dalam bahasa Indonesia dengan ringkas dan jelas.

  Data keuangan pengguna saat ini:
  ${userData ? JSON.stringify(userData) : 'Data transaksi belum tersedia.'}

  ATURAN PERILAKU & FORMAT (SANGAT KETAT):
  1. TANPA EMOJI (MUTLAK): DILARANG KERAS menggunakan emoji, emotikon, simbol unicode, atau karakter khusus apapun. Gunakan HANYA huruf, angka, dan tanda baca standar.
  2. RESPON NATURAL: Jika pengguna hanya menyapa (misal: "halo", "apa kabar?"), balaslah dengan ramah tanpa menyebutkan data keuangan.
  3. PENGGUNAAN DATA: Gunakan data di atas HANYA jika pengguna meminta analisis atau bertanya tentang uangnya.
  4. FORMAT UANG: WAJIB gunakan format Rupiah dengan titik untuk ribuan (contoh: "Rp 300.000").
  5. FORMAT TEKS: Gunakan huruf tebal (**teks**) untuk nominal uang dan nama kategori.`
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
        messages: messages
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
