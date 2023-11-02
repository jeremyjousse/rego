import { useContext, useState } from "react";

import InputLabel from "./InputLabel";
import { RebrickableAuthContext } from "../context/RebrickableAuthContext";
import { getUserSets } from "../adapters/rebricable";

// https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forms_and_events/
// https://usehooks.com/

const RebrickableAuth = () => {
  const [authenticationError, setAuthenticationError] = useState(false);

  const { updateRebrickableAuth } = useContext(RebrickableAuthContext);

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      apiKey: { value: string };
      userToken: { value: string };
    };

    // TODO check rebrickable access before saving
    const userSets = await getUserSets(
      target.apiKey.value,
      target.userToken.value
    );
    if (userSets.isRight()) {
      setAuthenticationError(false);
      const rebrickableAuth = {
        apiKey: target.apiKey.value,
        userToken: target.userToken.value,
      };

      localStorage.setItem("rebrickableAuth", JSON.stringify(rebrickableAuth));
      if (updateRebrickableAuth !== undefined) {
        updateRebrickableAuth({ rebrickableAuth });
      } else {
        console.error("updateRebrickableAuth is undefined");
      }
    } else {
      setAuthenticationError(true);
    }
  };
  return (
    <div>
      <h1 className="text-xl mb-6">
        Please add your Rebrickable authentication information
      </h1>
      <div className="mb-6">
        Create a{" "}
        <a
          href="https://rebrickable.com/"
          target="_blank"
          rel="noreferrer"
          className="underline text-blue-900 font-bold"
        >
          Rebrickable
        </a>{" "}
        account.
        <br /> Then Generate an{" "}
        <a
          href="https://rebrickable.com/api/"
          target="_blank"
          rel="noreferrer"
          className="underline text-blue-900 font-bold"
        >
          API key
        </a>
        .<br />
        Generate a{" "}
        <a
          href="https://rebrickable.com/api/v3/swagger/?key=#!/users/users_token_create#users_users_token_create"
          target="_blank"
          rel="noreferrer"
          className="underline text-blue-900 font-bold"
        >
          user token
        </a>
        .<br />
        Note that all ReGo data are stored on your web browser.
        <br />
        No data is sent to any server.
      </div>
      {authenticationError && <div>Error</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <InputLabel text="API key" htmlFor="api-key" />
          <input
            id="api-key"
            name="apiKey"
            type="password"
            className="border rounded"
          />
        </div>
        <div className="mb-4">
          <InputLabel text="User token" htmlFor="userToken" />
          <input
            id="userToken"
            name="userToken"
            type="password"
            className="border rounded"
          />
        </div>
        <div className="text-right">
          <input
            type="submit"
            value="Submit"
            className="border rounded py-1 px-2"
          />
        </div>
      </form>
    </div>
  );
};

export default RebrickableAuth;
