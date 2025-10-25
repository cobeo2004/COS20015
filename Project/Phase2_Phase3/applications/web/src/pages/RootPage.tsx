import { useState } from "react";
import reactLogo from "../assets/react.svg";
import viteLogo from "/vite.svg";
import { useGames } from "../hooks/useGames";

function RootPage() {
  const [count, setCount] = useState(0);
  const { data: games, isLoading, error } = useGames();
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100 text-red-800">
        Error loading games: {error.message}
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-900 to-gray-800 flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center gap-8 mb-8">
          <a href="https://vite.dev" target="_blank" rel="noreferrer">
            <img
              src={viteLogo}
              className="h-24 w-24 hover:drop-shadow-lg transition"
              alt="Vite logo"
            />
          </a>
          <a href="https://react.dev" target="_blank" rel="noreferrer">
            <img
              src={reactLogo}
              className="h-24 w-24 hover:drop-shadow-lg transition"
              alt="React logo"
            />
          </a>
        </div>

        <h1 className="text-5xl font-bold text-white mb-8">Vite + React</h1>

        <div className="bg-gray-700 rounded-lg p-8 mb-8 shadow-xl">
          <button
            onClick={() => setCount((count) => count + 1)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition mb-4"
          >
            count is {count}
          </button>
          <p className="text-gray-200">
            Edit{" "}
            <code className="bg-gray-800 px-2 py-1 rounded">
              src/RootPage.tsx
            </code>{" "}
            and save to test HMR
          </p>
        </div>

        <div className="bg-gray-700 rounded-lg p-8 mb-8 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-4">Games List</h2>
          {isLoading ? (
            <div className="text-gray-300">Loading games...</div>
          ) : (
            <ul className="text-left text-gray-200 list-disc list-inside">
              {games?.length ? (
                games.map((game) => (
                  <li key={game.id} className="mb-2">
                    <span className="font-semibold">{game.title}</span>:{" "}
                    {game.genre}
                  </li>
                ))
              ) : (
                <li className="text-gray-400">No games found.</li>
              )}
            </ul>
          )}
        </div>

        <p className="text-gray-400">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </div>
  );
}

export default RootPage;
