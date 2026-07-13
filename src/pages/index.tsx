import { useState } from 'react';
import Image from 'next/image';
import { LoginForm } from '@/components/LoginForm';
import { RegistroForm } from '@/components/RegistroForm';
import { RecuperacaoForm } from '@/components/RecuperacaoForm';
import { AlterarSenhaForm } from '@/components/AlterarSenhaForm';
import imagemBemmaistech from '../../imagem_bemmaistech.jpeg';

export default function PaginaInicial() {
  const [tela, setTela] = useState<'login' | 'registro' | 'recuperacao' | 'alterarSenha'>('login');

  return (
    <main className="pagina">
      <Image className="fundo-imagem" src={imagemBemmaistech} alt="" aria-hidden priority />
      <div className="circuito circuito-esquerdo" />
      <div className="circuito circuito-direito" />

      <div className="painel fade-in">
        <div className="cabecalho-logo">
          
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
