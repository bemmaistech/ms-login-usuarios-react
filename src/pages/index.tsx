import { useState } from 'react';
import { LoginForm } from '@/components/LoginForm';
import { RegistroForm } from '@/components/RegistroForm';
import { RecuperacaoForm } from '@/components/RecuperacaoForm';
import { AlterarSenhaForm } from '@/components/AlterarSenhaForm';

export default function PaginaInicial() {
  const [tela, setTela] = useState<'login' | 'registro' | 'recuperacao' | 'alterarSenha'>('login');

  return (
    <main className="pagina">
      <div className="circuito circuito-esquerdo" />
      <div className="circuito circuito-direito" />

      <div className="painel fade-in">
        <div className="cabecalho-logo">
          <div className="badge-logo">
            <svg viewBox="0 0 80 80" fill="none" aria-hidden="true">
              <path d="M22 26c4-7 10-10 18-10s14 3 18 10c-1 4-2 7-4 8-4 1-5-2-9-2s-5 3-9 2c-2-1-3-4-4-8z" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M28 36c4-2 8-4 14-4s10 2 14 4" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              <path d="M30 46c4-2 8-3 14-3s10 1 14 3" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              <path d="M26 22l-6-6m36 6l6-6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
          <p className="tagline">BEM + TECH</p>
          <h1 className="titulo-principal">BEM MAIS TECH</h1>
          <p className="subtitulo">Portal corporativo de acesso</p>
        </div>

        <div className="conteudo-formulario">
          {tela === 'login' && <LoginForm aoMudarTela={setTela} />}
          {tela === 'registro' && <RegistroForm aoMudarTela={setTela} />}
          {tela === 'recuperacao' && <RecuperacaoForm aoMudarTela={setTela} />}
          {tela === 'alterarSenha' && <AlterarSenhaForm aoMudarTela={setTela} />}
        </div>
      </div>
    </main>
  );
}
