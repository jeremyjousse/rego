// https://stevekinney.github.io/react-and-typescript/reducers

// Use map reducer
// https://mparavano.medium.com/stop-using-giant-switch-statements-in-your-react-reducers-abfb8aa8ede7

type LegoParts = {
  [name: string]: number;
};

export enum LegoPartsActonTypes {
  DECREMENT,
  INCREMENT,
}

type LegoPartsActionPayload = {
  name: string;
};

type LegoPartsDecrementActon = {
  type: LegoPartsActonTypes.DECREMENT;
  payload: LegoPartsActionPayload;
};

type LegoPartsIncrementActon = {
  type: LegoPartsActonTypes.INCREMENT;
  payload: {
    name: string;
  };
};

export type LegoPartsActon = LegoPartsDecrementActon | LegoPartsIncrementActon;

const legoPartsActionMap = new Map([
  [
    LegoPartsActonTypes.DECREMENT,
    (state: LegoParts, payload: LegoPartsActionPayload) => {
      return {
        ...state,
        [payload.name]:
          state[payload.name] === undefined || state[payload.name] < 1
            ? 0
            : --state[payload.name],
      };
    },
  ],

  [
    LegoPartsActonTypes.INCREMENT,
    (state: LegoParts, payload: LegoPartsActionPayload) => {
      return {
        ...state,
        [payload.name]:
          state[payload.name] === undefined ? 1 : ++state[payload.name],
      };
    },
  ],
]);

export const legoSetReducer = (
  legoPartsState: LegoParts,
  action: LegoPartsActon
) => {
  const mappedAction = legoPartsActionMap.get(action.type);
  return mappedAction
    ? mappedAction(legoPartsState, action.payload)
    : legoPartsState;
};
