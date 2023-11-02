import { useState } from "react";
import {
  RebrickableAuthContext,
  rebrickableAuthDefaultState,
  type RebrickableAuthContextType,
} from "../context/RebrickableAuthContext";

export const RebrickableAuthProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [rebrickableAuth, setRebrickableAuth] = useState(
    rebrickableAuthDefaultState
  );

  const updateRebrickableAuth = (
    newRebrickableAuthState: RebrickableAuthContextType
  ) => {
    setRebrickableAuth(newRebrickableAuthState);
    localStorage.setItem(
      "rebrickableAuth",
      JSON.stringify(newRebrickableAuthState)
    );
  };

  return (
    <RebrickableAuthContext.Provider
      value={{
        rebrickableAuth: rebrickableAuth.rebrickableAuth,
        updateRebrickableAuth,
      }}
    >
      {children}
    </RebrickableAuthContext.Provider>
  );
};
