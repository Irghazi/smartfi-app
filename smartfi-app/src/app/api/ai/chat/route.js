import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { prompt } = await request.json()
    
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt tidak boleh kosong' }, { status: 400 })
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: 'Kamu adalah asisten pengurai transaksi keuangan. Ekstrak data dari kalimat user menjadi format JSON murni tanpa markdown. Format wajib: {"type": "income" atau "expense", "category": "nama_kategori", "nominal": angka_tanpa_titik, "description": "deskripsi_singkat"}.'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Groq API Error:', errorText)
      throw new Error(`Groq API merespons dengan status: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0].message.content

    // Membersihkan kemungkinan markdown block (```json ... ```) dari model AI
    const cleanJson = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    
    const parsed = JSON.parse(cleanJson)
    return NextResponse.json(parsed)
  } catch (error) {
    console.error('Error saat memproses respons AI:', error)
    return NextResponse.json({ error: 'Gagal memproses input dari AI' }, { status: 500 })
  }
}
