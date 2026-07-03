import { useState, type FormEvent } from 'react';
import { servicoAutenticacao } from '@/services/servicoAutenticacao';

interface Props {
  aoMudarTela: (tela: 'login' | 'registro' | 'recuperacao') => void;
}

export function RecuperacaoForm({ aoMudarTela }: Props) {
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function aoEnviarRecuperacao(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErro('');
    setMensagem('');
    setCarregando(true);
    try {
      const emailValido = email.trim();
      await servicoAutenticacao.recuperarSenha(emailValido);
      setMensagem('Se o e-mail existir, você receberá instruções para alterar a senha.');
    } catch (erro) {
      setErro('Não foi possível iniciar a recuperação de senha. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <form className="formulario space-y-6" onSubmit={aoEnviarRecuperacao}>
      <div>
        <h2 className="text-2xl font-semibold text-slate-950">Recuperar senha</h2>
        <p className="mt-2 text-sm text-slate-500">Informe seu e-mail e envie as instruções para redefinição.</p>
      </div>

      <label className="campo-rotulo">
        E-mail
        <div className="campo-input campo-email">
          <span className="icone-campo">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4.5 6.75h15v10.5h-15V6.75z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4.5 6.75l7.5 5.25 7.5-5.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <input
            type="email"
            value={email}
            onChange={(evento) => setEmail(evento.target.value)}
            required
            placeholder="seu@exemplo.com"
          />
        </div>
      </label>

      {erro && <p className="erro">{erro}</p>}
      {mensagem && <p className="sucesso">{mensagem}</p>}

      <button type="submit" disabled={carregando} className="botao-primario">
        {carregando ? 'Enviando...' : 'Enviar instruções'}
      </button>

      <div className="links">
        <button type="button" className="link" onClick={() => aoMudarTela('login')}>
          Voltar ao login
        </button>
      </div>
    </form>
  );
}
