import { useState, type FormEvent } from 'react';
import { servicoAutenticacao } from '@/services/servicoAutenticacao';

interface Props {
  aoMudarTela: (tela: 'login' | 'registro' | 'recuperacao' | 'alterarSenha') => void;
}

export function LoginForm({ aoMudarTela }: Props) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function aoEnviarLogin(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErro('');
    setCarregando(true);
    try {
      await servicoAutenticacao.login({ email, senha });
      alert('Login realizado com sucesso!');
    } catch (erro) {
      const mensagemErro = erro instanceof Error ? erro.message : 'Falha ao autenticar. Verifique seu e-mail e senha.';
      setErro(mensagemErro);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <form className="formulario" onSubmit={aoEnviarLogin}>
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
            placeholder="Email"
          />
        </div>
      </label>

      <label className="campo-rotulo">
        Senha
        <div className="campo-input campo-senha">
          <span className="icone-campo">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="6" y="10" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 10V8a4 4 0 1 1 8 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
          <input
            type="password"
            value={senha}
            onChange={(evento) => setSenha(evento.target.value)}
            required
            placeholder="Senha"
          />
        </div>
      </label>

      {erro && <p className="erro">{erro}</p>}

      <button type="submit" disabled={carregando} className="botao-primario">
        {carregando ? 'Entrando...' : 'ENTRAR'}
      </button>

      <div className="card-footer">
        <button type="button" className="footer-link" onClick={() => aoMudarTela('recuperacao')}>
          Esqueceu a senha?
        </button>
        <button type="button" className="footer-link" onClick={() => aoMudarTela('registro')}>
          Criar nova conta
        </button>
      </div>
    </form>
  );
}
