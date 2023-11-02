// https://felixgerschau.com/react-typescript-context/
// https://codepen.io/fgerschau/pen/OJmzXbq

import { createContext } from "react";

export type RebrickableAuthContextType = {
  rebrickableAuth: {
    apiKey?: string;
    userToken?: string;
  };
  updateRebrickableAuth?: (
    newRebrickableAuthState: RebrickableAuthContextType
  ) => void;
};

export const rebrickableAuthDefaultState = {
  rebrickableAuth: {},
};

export const RebrickableAuthContext = createContext<RebrickableAuthContextType>(
  rebrickableAuthDefaultState
);
