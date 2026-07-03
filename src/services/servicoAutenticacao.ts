const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const loginUrl = process.env.NEXT_PUBLIC_LOGIN_URL || `${baseUrl}/login-usuarios/v1/login/entrar`;

interface DadosLogin {
  email: string;
  senha: string;
}

interface DadosRegistro {
  nome: string;
  telefone: string;
  email: string;
  senha: string;
}

interface DadosAlteracaoSenha {
  email: string;
  senha: string;
}

async function tratarResposta(resposta: Response) {
  const corpo = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    const errosArray = Array.isArray(corpo?.erros) ? corpo.erros : undefined;
    const mensagemErros = errosArray?.length ? errosArray.join(' | ') : undefined;
    const mensagem = mensagemErros || corpo?.mensagem || corpo?.message || corpo?.erro || corpo?.error || resposta.statusText;
    throw new Error(mensagem || 'Erro na requisição');
  }

  return corpo;
}

export const servicoAutenticacao = {
  async login(dados: DadosLogin) {
    return fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dados),
    }).then(tratarResposta);
  },

  async registrar(dados: DadosRegistro) {
    return fetch(`${baseUrl}/login-usuarios/v1/login/criar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dados),
    }).then(tratarResposta);
  },

  async recuperarSenha(email: string) {
    return fetch(`${baseUrl}/login-usuarios/v1/confirmar-email/enviar-email-recuperacao`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim() }),
    }).then(tratarResposta);
  },

  async enviarCodigoConfirmacao(email: string) {
    return fetch(`${baseUrl}/login-usuarios/v1/confirmar-email/enviar-codigo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    }).then(tratarResposta);
  },

  async confirmarCodigo(email: string, codigo: string) {
    return fetch(`${baseUrl}/login-usuarios/v1/confirmar-email/confirmar-codigo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, codigo }),
    }).then(tratarResposta);
  },

  async alterarSenha(dados: DadosAlteracaoSenha) {
    return fetch(`${baseUrl}/login-usuarios/v1/login/alterar-senha`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    }).then(tratarResposta);
  },

  async criarConta(dados: { nome: string; telefone: string; email: string; senha: string }) {
    return fetch(`${baseUrl}/login-usuarios/v1/login/criar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    }).then(tratarResposta);
  },
};
