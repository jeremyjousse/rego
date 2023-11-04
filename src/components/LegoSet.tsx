import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

import LegoPartItem from "./LegoPartItem";
import { LegoPartType } from "../domain/LegoPartType";
import { RebrickableAuthContext } from "../context/RebrickableAuthContext";
import { getSet } from "../adapters/rebricable";
import { legoSetReducer } from "../reducers/legoSetReducer";

type Props = {
  setNum: string;
  readonly setLegoSet: Dispatch<SetStateAction<string>>;
};

const loadLegoPartsFoundState = (setNum: string) => {
  const localeStorageValue = localStorage.getItem(`rebrickableSet-${setNum}`);
  if (localeStorageValue) {
    return JSON.parse(localeStorageValue);
  }
  return {};
};

const LegoSet = ({ setNum, setLegoSet }: Props) => {
  const [legoParts, setLegoParts] = useState([] as LegoPartType[]);
  const { rebrickableAuth } = useContext(RebrickableAuthContext);

  const [legoPartsFound, dispatchFound] = useReducer(
    legoSetReducer,
    loadLegoPartsFoundState(setNum)
  );

  useEffect(() => {
    if (rebrickableAuth.apiKey) {
      getSet(rebrickableAuth.apiKey, setNum).then((parts) => {
        if (parts.isRight()) {
          const partsValue = parts.value;
          setLegoParts(partsValue);
        }
      });
    }
  }, [setNum, rebrickableAuth.apiKey]);

  useEffect(() => {
    localStorage.setItem(
      `rebrickableSet-${setNum}`,
      JSON.stringify(legoPartsFound)
    );
  }, [legoPartsFound, setNum]);
  return (
    <div className="text-center">
      <h1 className="text-2xl">Lego set parts</h1>
      <div className="text-right">
        <button onClick={() => setLegoSet("")}>Close</button>
      </div>
      {legoParts.map(({ id, color, name, imgUrl, quantity }) => {
        return (
          <LegoPartItem
            key={id}
            id={id}
            color={color}
            name={name}
            imgUrl={imgUrl}
            quantity={quantity}
            quantityFound={legoPartsFound[id] ?? 0}
            dispatchFound={dispatchFound}
          />
        );
      })}
    </div>
  );
};
export default LegoSet;
