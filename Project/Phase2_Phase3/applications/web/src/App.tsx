import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";
import LoadingState from "./components/LoadingComponents";

// Lazy load all pages
const RoleSelectorPage = lazy(() => import("./pages/RoleSelectorPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

// Admin pages
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const ReportsPage = lazy(() => import("./pages/admin/ReportsPage"));
const Report1Page = lazy(() => import("./pages/admin/Report1Page"));
const Report2Page = lazy(() => import("./pages/admin/Report2Page"));
const Report3Page = lazy(() => import("./pages/admin/Report3Page"));
const GamesManagementPage = lazy(() => import("./pages/admin/GamesManagementPage"));
const PlayersManagementPage = lazy(() => import("./pages/admin/PlayersManagementPage"));
const AchievementsManagementPage = lazy(() => import("./pages/admin/AchievementsManagementPage"));

// Player pages
const PlayerSelectorPage = lazy(
  () => import("./pages/player/PlayerSelectorPage")
);
const PlayerDashboard = lazy(() => import("./pages/player/PlayerDashboard"));
const MyStatsPage = lazy(() => import("./pages/player/MyStatsPage"));
const GamesPage = lazy(() => import("./pages/player/GamesPage"));
const GameDetailsPage = lazy(() => import("./pages/player/GameDetailsPage"));
const DeveloperDetailsPage = lazy(() => import("./pages/player/DeveloperDetailsPage"));
const LeaderboardPage = lazy(() => import("./pages/player/LeaderboardPage"));
const AchievementsPage = lazy(() => import("./pages/player/AchievementsPage"));

function App() {
  return (
    <Routes>
      {/* Landing Page */}
      <Route
        index
        element={
          <Suspense fallback={<LoadingState fullScreen={true} />}>
            <RoleSelectorPage />
          </Suspense>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <Suspense fallback={<LoadingState fullScreen={true} />}>
            <AdminDashboard />
          </Suspense>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <Suspense fallback={<LoadingState fullScreen={true} />}>
            <ReportsPage />
          </Suspense>
        }
      />
      <Route
        path="/admin/reports/1"
        element={
          <Suspense fallback={<LoadingState fullScreen={true} />}>
            <Report1Page />
          </Suspense>
        }
      />
      <Route
        path="/admin/reports/2"
        element={
          <Suspense fallback={<LoadingState fullScreen={true} />}>
            <Report2Page />
          </Suspense>
        }
      />
      <Route
        path="/admin/reports/3"
        element={
          <Suspense fallback={<LoadingState fullScreen={true} />}>
            <Report3Page />
          </Suspense>
        }
      />
      <Route
        path="/admin/games"
        element={
          <Suspense fallback={<LoadingState fullScreen={true} />}>
            <GamesManagementPage />
          </Suspense>
        }
      />
      <Route
        path="/admin/players"
        element={
          <Suspense fallback={<LoadingState fullScreen={true} />}>
            <PlayersManagementPage />
          </Suspense>
        }
      />
      <Route
        path="/admin/achievements"
        element={
          <Suspense fallback={<LoadingState fullScreen={true} />}>
            <AchievementsManagementPage />
          </Suspense>
        }
      />

      {/* Player Routes */}
      <Route
        path="/player/select"
        element={
          <Suspense fallback={<LoadingState fullScreen={true} />}>
            <PlayerSelectorPage />
          </Suspense>
        }
      />
      <Route
        path="/player/:playerId"
        element={
          <Suspense fallback={<LoadingState fullScreen={true} />}>
            <PlayerDashboard />
          </Suspense>
        }
      />
      <Route
        path="/player/:playerId/stats"
        element={
          <Suspense fallback={<LoadingState fullScreen={true} />}>
            <MyStatsPage />
          </Suspense>
        }
      />
      <Route
        path="/player/:playerId/games"
        element={
          <Suspense fallback={<LoadingState fullScreen={true} />}>
            <GamesPage />
          </Suspense>
        }
      />
      <Route
        path="/player/:playerId/games/:gameId"
        element={
          <Suspense fallback={<LoadingState fullScreen={true} />}>
            <GameDetailsPage />
          </Suspense>
        }
      />
      <Route
        path="/player/:playerId/developers/:developerId"
        element={
          <Suspense fallback={<LoadingState fullScreen={true} />}>
            <DeveloperDetailsPage />
          </Suspense>
        }
      />
      <Route
        path="/player/:playerId/leaderboard"
        element={
          <Suspense fallback={<LoadingState fullScreen={true} />}>
            <LeaderboardPage />
          </Suspense>
        }
      />
      <Route
        path="/player/:playerId/achievements"
        element={
          <Suspense fallback={<LoadingState fullScreen={true} />}>
            <AchievementsPage />
          </Suspense>
        }
      />

      {/* 404 Not Found */}
      <Route
        path="*"
        element={
          <Suspense fallback={<LoadingState fullScreen={true} />}>
            <NotFoundPage />
          </Suspense>
        }
      />
    </Routes>
  );
}

export default App;
