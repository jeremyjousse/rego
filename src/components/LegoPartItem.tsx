import {
  LegoPartsActon,
  LegoPartsActonTypes,
} from "../reducers/legoSetReducer";

type LegoPartItemProps = {
  readonly color: string;
  readonly id: string;
  readonly imgUrl: string;
  readonly name: string;
  readonly quantity: number;
  readonly quantityFound: number;
  readonly dispatchFound: React.Dispatch<LegoPartsActon>;
};

const LegoPartItem = ({
  color,
  id,
  imgUrl,
  name,
  quantity,
  quantityFound,
  dispatchFound,
}: LegoPartItemProps) => {
  const increase = () => {
    if (quantityFound < quantity) {
      dispatchFound({
        type: LegoPartsActonTypes.INCREMENT,
        payload: {
          name: id,
        },
      });
    }
  };

  const decrease = () => {
    if (quantityFound > 0) {
      dispatchFound({
        type: LegoPartsActonTypes.DECREMENT,
        payload: {
          name: id,
        },
      });
    }
  };

  return (
    <div
      className={`text-center mb-6 p-5 rounded-2xl border-2 ${
        quantity > quantityFound ? "bg-red-300" : "bg-green-200"
      }`}
      key={id}
    >
      <img src={imgUrl} width="100" alt={name} className="mx-auto" />
      <h2 className="text-xl mb-3">
        ({color}) {name}
      </h2>
      <div className="grid grid-cols-3 gap-4 w-40 m-auto">
        <div>
          {quantityFound > 0 && (
            <button
              className="text-center bg-red-500 hover:bg-red-700 py-1 px-2 rounded"
              onClick={decrease}
            >
              -
            </button>
          )}
        </div>
        <div>
          {quantityFound}/{quantity}
        </div>
        <div>
          {quantityFound < quantity && (
            <button
              className="text-center bg-blue-500 hover:bg-blue-700 py-1 px-2 rounded"
              onClick={increase}
            >
              +
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LegoPartItem;
