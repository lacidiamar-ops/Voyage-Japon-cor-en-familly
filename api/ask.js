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

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { question, day } = req.body || {};
    if (!process.env.OPENAI_API_KEY) {
      return res.status(200).json({
        answer: "L'assistant IA est prêt, mais la variable OPENAI_API_KEY n'est pas encore configurée dans Vercel. En attendant, utilise les onglets Jours, Carte, Food et Budget."
      });
    }
    const prompt = `Tu es un guide touristique familial francophone pour un voyage Japon/Corée. Réponds de façon pratique, courte et utile. Contexte journée: ${JSON.stringify(day)}. Question: ${question}`;
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [
          { role: 'system', content: 'Tu es un assistant voyage mobile. Réponds en français, avec conseils concrets, GPS, timing, enfants/famille et budget.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.4,
        max_tokens: 650
      })
    });
    if (!response.ok) {
      const text = await response.text();
      return res.status(200).json({ answer: `IA indisponible pour le moment. Détail technique: ${text.slice(0, 200)}` });
    }
    const data = await response.json();
    return res.status(200).json({ answer: data.choices?.[0]?.message?.content || 'Réponse IA vide.' });
  } catch (error) {
    return res.status(200).json({ answer: `Erreur assistant IA: ${error.message}` });
  }
}
