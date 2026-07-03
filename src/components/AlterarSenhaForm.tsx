import { useState, type FormEvent } from 'react';
import { servicoAutenticacao } from '@/services/servicoAutenticacao';

interface Props {
  aoMudarTela: (tela: 'login' | 'registro' | 'recuperacao' | 'alterarSenha') => void;
}

export function AlterarSenhaForm({ aoMudarTela }: Props) {
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [senhaNova, setSenhaNova] = useState('');
  const [confirmacaoSenha, setConfirmacaoSenha] = useState('');
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [etapa, setEtapa] = useState<'email' | 'codigo' | 'senha'>('email');

  async function aoEnviarAlteracao(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErro('');
    setMensagem('');

    if (senhaNova !== confirmacaoSenha) {
      setErro('A nova senha e a confirmação não conferem.');
      return;
    }

    setCarregando(true);
    try {
      await servicoAutenticacao.alterarSenha({ email, senha: senhaNova });
      setMensagem('Senha alterada com sucesso! Faça login com a nova senha.');
      setEmail('');
      setCodigo('');
      setSenhaNova('');
      setConfirmacaoSenha('');
      setEtapa('email');
    } catch (erro) {
      const mensagemErro = erro instanceof Error ? erro.message : 'Não foi possível alterar a senha. Verifique os dados e tente novamente.';
      setErro(mensagemErro);
    } finally {
      setCarregando(false);
    }
  }

  async function enviarCodigo(evento?: FormEvent) {
    evento?.preventDefault();
    setErro('');
    setMensagem('');

    if (!email) {
      setErro('Informe um e-mail válido.');
      return;
    }

    setCarregando(true);
    try {
      await servicoAutenticacao.enviarCodigoConfirmacao(email);
      setEtapa('codigo');
    } catch (erro) {
      const mensagemErro = erro instanceof Error ? erro.message : 'Falha ao enviar o e-mail de recuperação. Tente novamente.';
      setErro(mensagemErro);
    } finally {
      setCarregando(false);
    }
  }

  async function confirmarCodigoHandler(evento: FormEvent) {
    evento.preventDefault();
    setErro('');
    setMensagem('');

    if (!codigo) {
      setErro('Informe o código recebido por e-mail.');
      return;
    }

    setCarregando(true);
    try {
      await servicoAutenticacao.confirmarCodigo(email, codigo);
      setEtapa('senha');
    } catch (erro) {
      const mensagemErro = erro instanceof Error ? erro.message : 'Código inválido ou expirado.';
      setErro(mensagemErro);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <form className="formulario space-y-6" onSubmit={etapa === 'senha' ? aoEnviarAlteracao : (e) => e.preventDefault()}>
      <div>
        <h2 className="text-2xl font-semibold text-slate-950">Alterar senha</h2>
        <p className="mt-2 text-sm text-slate-500">Atualize sua senha com segurança no portal Bemmaistech.</p>
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

          <button type="button" onClick={enviarCodigo} disabled={carregando} className="botao-primario">
            {carregando ? 'Enviando...' : 'Enviar e-mail de recuperação'}
          </button>
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
              Reenviar e-mail
            </button>
          </div>
        </>
      )}

      {etapa === 'senha' && (
        <>
          <label className="campo-rotulo">
            Nova senha
            <div className="campo-input campo-senha">
              <span className="icone-campo">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="6" y="10" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M8 10V8a4 4 0 1 1 8 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
              <input
                type="password"
                value={senhaNova}
                onChange={(evento) => setSenhaNova(evento.target.value)}
                required
                placeholder="Nova senha"
              />
            </div>
          </label>

          <label className="campo-rotulo">
            Confirmar nova senha
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
          {mensagem && <p className="sucesso">{mensagem}</p>}

          <button type="submit" disabled={carregando} className="botao-primario">
            {carregando ? 'Alterando...' : 'Alterar senha'}
          </button>
        </>
      )}

      <div className="links">
        <button type="button" className="link" onClick={() => aoMudarTela('login')}>
          Voltar ao login
        </button>
      </div>
    </form>
  );
}

