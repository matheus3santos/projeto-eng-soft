import Link from "next/link";
import styles from "../css/page.module.css";
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
          Este sistema foi desenvolvido para gerenciar o processo de estágio,
          permitindo o cadastro, edição, exclusão e visualização de estágios.
        </p>
        <p>
          Ele é composto por um front-end em React e um back-end em Node.js, com
          o banco de dados MySQL para armazenamento das informações.
        </p>
      </main>
    </div>
  );
}
