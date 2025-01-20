import Layout from "./components/atoms/Layout/Layout";
import "./index.css";

function App() {
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">Bienvenue dans le Dashboard !</h1>
      <p className="text-gray-700">
        Ici, tu peux afficher les données de ton API ou d'autres informations.
      </p>
      <div className="mt-6">
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>📊 Statistiques de l'application</li>
          <li>🔗 Liens vers les sections importantes</li>
          <li>💡 Suggestions et astuces</li>
          <li>🗂 Données API affichées ici</li>
        </ul>
      </div>
    </Layout>
  );
}

export default App;
