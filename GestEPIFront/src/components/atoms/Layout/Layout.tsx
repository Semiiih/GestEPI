"use client";

import { useState, ReactNode } from "react";
import ListesEPI from "../../../pages/ListesEPI/ListesEPI";
import ListesControle from "../../../pages/ListesControle/ListesControle";

const navigation = [
  { name: "Liste des EPI", key: "epi", icon: "📁" },
  { name: "Liste des contrôles", key: "controls", icon: "📊" },
];

function classNames(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

interface LayoutProps {
  children?: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("epi");

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
    <div className="h-full bg-gray-100">
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-64 bg-indigo-600 text-white flex flex-col p-4">
            <button
              onClick={() => setSidebarOpen(false)}
              className="mb-4 self-end p-1 bg-indigo-500 rounded"
            >
              ❌ Close
            </button>
            <nav>
              <ul>
                {navigation.map((item) => (
                  <li key={item.key} className="mb-2">
                    <button
                      onClick={() => {
                        setCurrentPage(item.key);
                        setSidebarOpen(false);
                      }}
                      className={classNames(
                        currentPage === item.key
                          ? "bg-indigo-700"
                          : "hover:bg-indigo-700",
                        "flex items-center gap-2 p-2 rounded w-full text-left"
                      )}
                    >
                      <span>{item.icon}</span>
                      <span>{item.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div
            className="flex-1 bg-black opacity-50"
            onClick={() => setSidebarOpen(false)}
          ></div>
        </div>
      )}

      {/* partie pc */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-indigo-600 text-white p-4">
        <h2 className="text-lg font-semibold mb-4">GESTEPI</h2>
        <nav>
          <ul>
            {navigation.map((item) => (
              <li key={item.key} className="mb-2">
                <button
                  onClick={() => setCurrentPage(item.key)}
                  className={classNames(
                    currentPage === item.key
                      ? "bg-indigo-700"
                      : "hover:bg-indigo-700",
                    "flex items-center gap-2 p-2 rounded w-full text-left"
                  )}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="lg:pl-64 bg-indigo-600 text-white p-4 flex items-center justify-between shadow">
        <button
          className="lg:hidden p-2 rounded bg-indigo-500"
          onClick={() => setSidebarOpen(true)}
        >
          ☰ Menu
        </button>
        <div className="text-lg font-semibold">Tableau de bord</div>
        <div className="text-sm">Semeehh</div>
      </div>

      <main className="lg:pl-64 p-6">
        <div className="bg-white p-4 shadow rounded">{renderPage()}</div>
      </main>
    </div>
  );
}
