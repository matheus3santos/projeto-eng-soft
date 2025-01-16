// src/components/Header.tsx
import styles from "../css/header.module.css"; // Ou o caminho correto para o seu arquivo de estilos
import Link from "next/link";

const Header = () => {
  return (
    <header className={styles.header}>
      <nav>
        <ul className={styles.navList}>
          <li>
            <Link href="/admin-dashboard/cadastroEstagio">Página Inicial</Link>
          </li>
          <li>
            <Link href="/admin-dashboard/sobre">Sobre</Link>
          </li>
          <li>
            <Link href="/admin-dashboard/estagio">Estágios</Link>
          </li>
          <li>
            <Link href="/admin-dashboard/">Sair</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
