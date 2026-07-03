import { useState, type FormEvent } from 'react';
import { servicoAutenticacao } from '@/services/servicoAutenticacao';

interface Props {
  aoMudarTela: (tela: 'login' | 'registro' | 'recuperacao') => void;
}

export function RegistroForm({ aoMudarTela }: Props) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacaoSenha, setConfirmacaoSenha] = useState('');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [codigo, setCodigo] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [etapa, setEtapa] = useState<'email' | 'codigo' | 'resto'>('email');

  async function aoEnviarRegistro(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErro('');
    if (senha !== confirmacaoSenha) {
      setErro('As senhas não conferem.');
      return;
    }

    setCarregando(true);
    try {
      await servicoAutenticacao.criarConta({ nome, telefone, email, senha });
      alert('Conta criada com sucesso! Faça login para continuar.');
      aoMudarTela('login');
    } catch (erro) {
      const mensagemErro = erro instanceof Error ? erro.message : 'Não foi possível criar a conta. Tente novamente.';
      setErro(mensagemErro);
    } finally {
      setCarregando(false);
    }
  }

  async function enviarCodigo(evento?: FormEvent) {
    evento?.preventDefault();
    setErro('');
    if (!email) {
      setErro('Informe um e-mail válido.');
      return;
    }
    setCarregando(true);
    try {
      await servicoAutenticacao.enviarCodigoConfirmacao(email);
      setEtapa('codigo');
    } catch (erro) {
      const mensagemErro = erro instanceof Error ? erro.message : 'Falha ao enviar código. Tente novamente.';
      setErro(mensagemErro);
    } finally {
      setCarregando(false);
    }
  }

  async function confirmarCodigoHandler(evento: FormEvent) {
    evento.preventDefault();
    setErro('');
    if (!codigo) {
      setErro('Informe o código recebido por e-mail.');
      return;
    }
    setCarregando(true);
    try {
      await servicoAutenticacao.confirmarCodigo(email, codigo);
      setEtapa('resto');
    } catch (erro) {
      const mensagemErro = erro instanceof Error ? erro.message : 'Código inválido ou expirado.';
      setErro(mensagemErro);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <form className="formulario space-y-6" onSubmit={etapa === 'resto' ? aoEnviarRegistro : (e) => e.preventDefault()}>
      <div>
        <h2 className="text-2xl font-semibold text-slate-950">Criar conta</h2>
        <p className="mt-2 text-sm text-slate-500">Cadastre seu e-mail e senha para acessar o portal.</p>
      </div>

      {etapa === 'email' && (
        <>
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

          <div className="space-y-2">
            <button type="button" onClick={enviarCodigo} disabled={carregando} className="botao-primario">
              {carregando ? 'Enviando...' : 'Enviar código'}
            </button>
            <div className="links">
              <button type="button" className="link" onClick={() => aoMudarTela('login')}>
                Voltar ao login
              </button>
            </div>
          </div>
        </>
      )}

      {etapa === 'codigo' && (
        <>
          <label className="campo-rotulo">
            Código recebido
            <div className="campo-input">
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                required
                placeholder="000000"
              />
            </div>
          </label>

          {erro && <p className="erro">{erro}</p>}

          <div className="space-y-2">
            <button type="button" onClick={confirmarCodigoHandler} disabled={carregando} className="botao-primario">
              {carregando ? 'Confirmando...' : 'Confirmar código'}
            </button>
            <button type="button" onClick={enviarCodigo} disabled={carregando} className="link">
              Reenviar código
            </button>
          </div>
        </>
      )}

      {etapa === 'resto' && (
        <>
          <label className="campo-rotulo">
            Nome
            <div className="campo-input">
              <span className="icone-campo">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 12c2.485 0 4.5-2.015 4.5-4.5S14.485 3 12 3 7.5 5.015 7.5 7.5 9.515 12 12 12z" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M4.5 20.25c0-3.315 2.685-6 6-6h3c3.315 0 6 2.685 6 6" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </span>
              <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required placeholder="Seu nome" />
            </div>
          </label>

          <label className="campo-rotulo">
            Telefone
            <div className="campo-input">
              <span className="icone-campo">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.08 4.18 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.72c.12 1.01.38 1.99.76 2.91a2 2 0 0 1-.45 2.11L8.09 10.91a16 16 0 0 0 6 6l1.16-1.16a2 2 0 0 1 2.11-.45c.92.38 1.9.64 2.91.76A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </span>
              <input type="tel" value={telefone} onChange={(e) => setTelefone(e.target.value)} required placeholder="(11) 99999-9999" />
            </div>
          </label>

          <label className="campo-rotulo">
            E-mail
            <div className="campo-input campo-email">
              <input type="email" value={email} readOnly />
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
                placeholder="Senha secreta"
              />
            </div>
          </label>

          <label className="campo-rotulo">
            Confirmar senha
            <div className="campo-input campo-senha">
              <input
                type="password"
                value={confirmacaoSenha}
                onChange={(evento) => setConfirmacaoSenha(evento.target.value)}
                required
                placeholder="Repita a senha"
              />
            </div>
          </label>

          {erro && <p className="erro">{erro}</p>}

          <button type="submit" disabled={carregando} className="botao-primario">
            {carregando ? 'Registrando...' : 'Criar conta'}
          </button>
        </>
      )}

      {etapa === 'resto' && (
        <div className="links">
          <button type="button" className="link" onClick={() => setEtapa('email')}>
            Alterar e-mail
          </button>
        </div>
      )}
    </form>
  );
}
