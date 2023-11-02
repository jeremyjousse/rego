import "./index.css";

import AuthRedirect from "./components/AuthRedirect";
import LegoSetWrapper from "./components/LegoSetWrapper";
import React from "react";
import { RebrickableAuthProvider } from "./providers/RebrikableAuthProvider";

function App() {
  return (
    <div className="max-w-xl mx-auto text-center p-4">
      <RebrickableAuthProvider>
        <AuthRedirect>
          <LegoSetWrapper />
        </AuthRedirect>
      </RebrickableAuthProvider>
    </div>
  );
}

export default App;
