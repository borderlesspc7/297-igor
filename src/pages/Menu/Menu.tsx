import { Layout } from "../../components/Layout/Layout";
import "./Menu.css";

export default function MenuPage() {
  return (
    <Layout>
      <section className="menu-grid">
        <article className="menu-card">
          <h2>Aquecimento</h2>
          <p>Configure rotinas progressivas para preparar novos chips.</p>
        </article>

        <article className="menu-card">
          <h2>Monitoramento</h2>
          <p>Acompanhe indicadores de reputação e entregabilidade.</p>
        </article>

        <article className="menu-card">
          <h2>Mensageria</h2>
          <p>Gerencie templates e fluxos de disparo aprovados.</p>
        </article>
      </section>
    </Layout>
  );
}
