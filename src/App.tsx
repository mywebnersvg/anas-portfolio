import { lazy, Suspense } from "react";
import "./App.css";
import MainContainer from "./components/MainContainer";
import { LoadingProvider } from "./context/LoadingProvider";

const CharacterModel = lazy(() => import("./components/Character"));

const App = () => {
  return (
    <>
      <LoadingProvider>
        <MainContainer>
          <Suspense fallback={null}>
            <CharacterModel />
          </Suspense>
        </MainContainer>
      </LoadingProvider>
    </>
  );
};

export default App;
