import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";
import LoadingState from "./components/LoadingComponents";

const RootPage = lazy(() => import("./pages/RootPage"));
function App() {
  return (
    <Routes>
      <Route
        index
        element={
          <Suspense fallback={<LoadingState fullScreen={true} />}>
            <RootPage />
          </Suspense>
        }
      />
    </Routes>
  );
}

export default App;
