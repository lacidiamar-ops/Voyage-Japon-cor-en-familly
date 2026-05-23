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
