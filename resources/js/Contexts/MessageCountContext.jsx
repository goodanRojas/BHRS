import { createContext, useContext } from "react";

export const MessageCountContext = createContext();

export const useMessageCount = () => useContext(MessageCountContext);