import Link from "next/link";
import styles from "../../../css/estagio.module.css";
import Header from "@/components/headerBar";

export default function Sobre() {
  return (
    <div className={styles.page}>
      {/* Header com botões */}
      <Header />

      {/* Conteúdo da página "Sobre" */}
      <main>
        <h1>Sobre o Sistema</h1>
        <p>
          Este sistema foi desenvolvido para <strong>gerenciar o processo de estágio</strong>,
          permitindo o cadastro, edição, exclusão e visualização das informações dos estágios.
        </p>
        <p>
          Ele é composto por um <strong>frontend em React (Next.js)</strong> e um <strong>backend em Node.js</strong>,
          com o banco de dados <strong>MySQL</strong> para armazenamento das informações.
        </p>

        <h2>✨ Principais Tecnologias Usadas</h2>
        <ul>
          <li><strong>Frontend:</strong> React e Next.js</li>
          <li><strong>Backend:</strong> Node.js e Express</li>
          <li><strong>Banco de Dados:</strong> MySQL</li>
          <li><strong>Estilização:</strong> CSS Modules</li>
          <li><strong>Comunicação API:</strong> Fetch / Axios</li>
        </ul>

        <h2>🔍 Objetivos do Sistema</h2>
        <ul>
          <li>Facilitar o <strong>cadastro e gerenciamento de estágios</strong>.</li>
          <li>Oferecer uma interface intuitiva para <strong>estudantes, empresas e orientadores</strong>.</li>
          <li>Garantir a persistência e integridade dos dados através do <strong>MySQL</strong>.</li>
          <li>Implementar uma arquitetura robusta e escalável com o uso do Next.js e Node.js.</li>
        </ul>

        <p>
          O sistema busca conectar estudantes, empresas e instituições de ensino de forma eficiente e transparente,
          garantindo um fluxo de informações confiável e em tempo real.
        </p>
      </main>
    </div>
  );
}
