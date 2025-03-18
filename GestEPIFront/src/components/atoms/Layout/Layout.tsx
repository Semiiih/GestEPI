import { useState, ReactNode, useEffect } from "react";
import { Shield, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import ListesEPI from "../../../pages/ListesEPI/ListesEPI";
import ListesControle from "../../../pages/ListesControle/ListesControle";

const navigation = [
  { name: "Liste des EPI", key: "epi", icon: "🛡️" },
  { name: "Liste des contrôles", key: "controls", icon: "📋" },
];

function classNames(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

interface LayoutProps {
  children?: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem("currentPage") || "epi";
  });
  const [stats, setStats] = useState({
    totalEPI: 0,
    controlesToday: 0,
    pendingControls: 0,
    expiringControls: 0,
  });

  useEffect(() => {
    localStorage.setItem("currentPage", currentPage);
    const fetchStats = async () => {
      try {
        const episResponse = await fetch("http://localhost:5500/epis");
        const episData = await episResponse.json();
        const controlesResponse = await fetch(
          "http://localhost:5500/episChecks"
        );
        const controlesData = await controlesResponse.json();

        const today = new Date().toISOString().split("T")[0];
        const controlesToday = controlesData.filter((controle: any) =>
          controle.date_contrôle?.startsWith(today)
        ).length;

        setStats({
          totalEPI: episData.length,
          controlesToday,

          pendingControls: controlesData.filter(
            (controle: any) => controle.status_id === 2
          ).length,

          expiringControls: controlesData.filter((controle: any) => {
            const date = new Date(controle.date_contrôle);
            const thirtyDaysFromNow = new Date();
            thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
            return date <= thirtyDaysFromNow;
          }).length,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case "epi":
        return <ListesEPI />;
      case "controls":
        return <ListesControle />;
      default:
        return <div>Page non trouvée</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-64 bg-white shadow-lg text-gray-800 flex flex-col">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-indigo-600">GESTEPI</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>
            </div>
            <nav className="flex-1 p-4">
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.key}>
                    <button
                      onClick={() => {
                        setCurrentPage(item.key);
                        setSidebarOpen(false);
                      }}
                      className={classNames(
                        currentPage === item.key
                          ? "bg-indigo-50 text-indigo-600"
                          : "text-gray-600 hover:bg-gray-50",
                        "flex items-center gap-3 w-full p-3 rounded-lg transition-colors"
                      )}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium">{item.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div
            className="flex-1 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-white  bg-gradient-to-r from-indigo-600 to-indigo-700 shadow-lg">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-white">GESTEPI</h2>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.key}>
                <button
                  onClick={() => setCurrentPage(item.key)}
                  className={classNames(
                    currentPage === item.key
                      ? "bg-white text-indigo-600"
                      : "text-indigo-50 hover:bg-gray-200 hover:text-indigo-600",
                    "flex items-center gap-3 w-full p-3 rounded-lg transition-colors"
                  )}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </button>
            <h1 className="text-xl font-semibold text-gray-800">
              Tableau de bord
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Semeehh</span>
            </div>
          </div>
        </header>

        {/* Stats */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Total EPIs */}
            <div className="bg-white rounded-xl shadow-sm shadow-indigo-300 p-6 border border-gray-100 transition transform hover:scale-105">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Shield className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total EPIs</p>
                  <p className="text-2xl font-semibold text-gray-800">
                    {stats.totalEPI}
                  </p>
                </div>
              </div>
            </div>

            {/* Contrôles aujourd'hui */}
            <div className="bg-white rounded-xl shadow-sm shadow-indigo-300 p-6 border border-gray-100 transition transform hover:scale-105">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contrôles aujourd'hui</p>
                  <p className="text-2xl font-semibold text-gray-800">
                    {stats.controlesToday}
                  </p>
                </div>
              </div>
            </div>

            {/* Contrôles en attente */}
            <div className="bg-white rounded-xl shadow-sm shadow-indigo-300 p-6 border border-gray-100 transition transform hover:scale-105">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contrôles en attente</p>
                  <p className="text-2xl font-semibold text-gray-800">
                    {stats.pendingControls}
                  </p>
                </div>
              </div>
            </div>

            {/* Contrôles à expiration */}
            <div className="bg-white rounded-xl shadow-sm shadow-indigo-300 p-6 border border-gray-100 transition transform hover:scale-105">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-50 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    Contrôles expirant bientôt ( -30 j )
                  </p>
                  <p className="text-2xl font-semibold text-gray-800">
                    {stats.expiringControls}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 ">
            {renderPage()}
          </div>
        </div>
      </div>
    </div>
  );
}
