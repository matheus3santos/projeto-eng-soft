// src/components/Header.tsx
import styles from "../app/css/header.module.css"; // Ou o caminho correto para o seu arquivo de estilos
import Link from "next/link";

const Header = () => {
  return (
    <header className={styles.header}>
      <nav>
        <ul className={styles.navList}>
          <li>
            <Link href="/cadastroEstagio">Página Inicial</Link>
          </li>
          <li>
            <Link href="/sobre">Sobre</Link>
          </li>
          <li>
            <Link href="/estagio">Estágios</Link>
          </li>
          <li>
            <Link href="/">Sair</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
