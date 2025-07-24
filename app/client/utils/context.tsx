"use client"
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

type UnreadContextType = {
  totalUnread: number;
  setTotalUnread: Dispatch<SetStateAction<number>>;
};

const UnreadContext = createContext<UnreadContextType | null>(null);

export const useUnread = () => {
  const context = useContext(UnreadContext);
  if (!context) {
    throw new Error("useUnread must be used within UnreadProvider");
  }
  return context;
};

export const UnreadProvider = ({ children }: { children: ReactNode }) => {
  const [totalUnread, setTotalUnread] = useState(0);

  return (
    <UnreadContext.Provider value={{ totalUnread, setTotalUnread }}>
      {children}
    </UnreadContext.Provider>
  );
};
