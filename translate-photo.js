export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { image, targetLanguage = 'français' } = req.body || {};
    if (!image) return res.status(400).json({ error: 'Image manquante.' });
    if (!process.env.OPENAI_API_KEY) return res.status(200).json({ error: 'OPENAI_API_KEY non configurée sur Vercel.' });

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        input: [{
          role: 'user',
          content: [
            { type: 'input_text', text: `Lis le texte visible sur cette image. Si c'est une carte de restaurant, traduis-la en ${targetLanguage}, explique simplement les plats, signale porc/alcool/cru/piquant si visible, et propose 3 choix faciles pour une famille.` },
            { type: 'input_image', image_url: image }
          ]
        }]
      })
    });
    const data = await response.json();
    const translation = data.output_text || data.output?.flatMap(o => o.content || []).map(c => c.text).filter(Boolean).join('\n') || 'Traduction indisponible.';
    return res.status(200).json({ translation });
  } catch (error) {
    return res.status(500).json({ error: 'Erreur traduction photo.' });
  }
}
