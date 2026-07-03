import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ erro: 'Método não permitido' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ erro: 'E-mail é obrigatório' });
  }

  return res.status(200).json({ mensagem: 'Instruções de recuperação enviadas' });
}
