import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

import { LegoSetListType } from "../domain/LegoSetListType";
import { RebrickableAuthContext } from "../context/RebrickableAuthContext";
import { getUserSets } from "../adapters/rebricable";

type Props = {
  readonly setLegoSet: Dispatch<SetStateAction<string>>;
};

function LegoSetList({ setLegoSet }: Props) {
  const [legoSetList, setLegoSetList] = useState([] as LegoSetListType[]);
  const { rebrickableAuth } = useContext(RebrickableAuthContext);

  const handleSetLegoSet = (legoSetNum: string) => {
    setLegoSet(legoSetNum);
  };

  useEffect(() => {
    if (rebrickableAuth.apiKey && rebrickableAuth.userToken)
      getUserSets(rebrickableAuth.apiKey, rebrickableAuth.userToken).then(
        (sets) => {
          if (sets.isRight()) {
            const setsValue = sets.value;
            setLegoSetList(setsValue);
          }
        }
      );
  }, [rebrickableAuth]);
  return (
    <div className="text-center">
      <h1 className="text-xl">Lego set list</h1>
      {legoSetList.map(({ imgUrl, name, num }) => {
        return (
          <div key={num}>
            <button onClick={() => handleSetLegoSet(num)}>
              <h2>
                <img src={imgUrl} width="100" alt={name} className="mx-auto" />
                <br />
                {name}
              </h2>
            </button>
            <hr />
          </div>
        );
      })}
      <br />
    </div>
  );
}
export default LegoSetList;
