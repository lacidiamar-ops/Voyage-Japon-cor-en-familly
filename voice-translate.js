export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { text, from = 'français', to = 'japonais' } = req.body || {};
    if (!text) return res.status(400).json({ error: 'Texte manquant.' });
    if (!process.env.OPENAI_API_KEY) return res.status(200).json({ error: 'OPENAI_API_KEY non configurée sur Vercel.' });

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        input: `Traduis naturellement ce texte du ${from} vers le ${to}. Réponds uniquement avec la traduction, sans explication. Texte : ${text}`
      })
    });
    const data = await response.json();
    return res.status(200).json({ translation: data.output_text || 'Traduction indisponible.' });
  } catch (error) {
    return res.status(500).json({ error: 'Erreur traduction vocale.' });
  }
}
