import { useContext, useEffect } from "react";

import RebrickableAuth from "./RebrickableAuth";
import { RebrickableAuthContext } from "../context/RebrickableAuthContext";

const AuthRedirect = ({ children }: { children: JSX.Element }) => {
  const { rebrickableAuth, updateRebrickableAuth } = useContext(
    RebrickableAuthContext
  );

  const readLocalStorage = () => {
    const rebrickableAuthStorage = localStorage.getItem("rebrickableAuth");

    if (rebrickableAuthStorage !== null) {
      if (updateRebrickableAuth !== undefined) {
        updateRebrickableAuth(JSON.parse(rebrickableAuthStorage));
      }
    }
  };

  useEffect(() => {
    readLocalStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {rebrickableAuth && rebrickableAuth.apiKey === undefined ? (
        <RebrickableAuth />
      ) : (
        children
      )}
    </>
  );
};
export default AuthRedirect;
