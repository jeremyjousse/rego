import LegoSet from "./LegoSet";
import LegoSetList from "./LegoSetList";
import { useState } from "react";

const LegoSetWrapper = () => {
  const [legoSet, setLegoSet] = useState("");

  return (
    <div className="py-4 px-4">
      {legoSet === "" ? (
        <LegoSetList setLegoSet={setLegoSet} />
      ) : (
        <LegoSet setNum={legoSet} setLegoSet={setLegoSet} />
      )}
    </div>
  );
};
export default LegoSetWrapper;
