import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ erro: 'Método não permitido' });
  }

  const { email, senhaAtual, senhaNova } = req.body;

  if (!email || !senhaAtual || !senhaNova) {
    return res.status(400).json({ erro: 'E-mail, senha atual e nova senha são obrigatórios' });
  }

  return res.status(200).json({ mensagem: 'Senha alterada com sucesso' });
}
