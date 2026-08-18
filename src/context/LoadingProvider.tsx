import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Loading from "../components/Loading";

interface LoadingType {
  isLoading: boolean;
  setIsLoading: (state: boolean) => void;
}

export const LoadingContext = createContext<LoadingType | null>(null);

const TICK_MS = 60;
const STEP = 2;
const MAX_MS = 5500;

export const LoadingProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(0);
  const percentRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      percentRef.current = Math.min(percentRef.current + STEP, 100);
      setLoading(percentRef.current);

      if (percentRef.current >= 100) {
        clearInterval(interval);
      }
    }, TICK_MS);

    const maxTimer = setTimeout(() => {
      clearInterval(interval);
      percentRef.current = 100;
      setLoading(100);
    }, MAX_MS);

    return () => {
      clearInterval(interval);
      clearTimeout(maxTimer);
    };
  }, []);

  const value: LoadingType = {
    isLoading,
    setIsLoading,
  };

  return (
    <LoadingContext.Provider value={value}>
      {isLoading && <Loading percent={loading} />}
      <main className="main-body">{children}</main>
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
