import { Inventory } from '../Inventory';

const OsmoSwap = () => {
  return (
    <div className="flex w-full flex-row justify-center">
      <div className="flex w-11/12 flex-row">
        <div className="card grid h-full flex-grow place-items-center rounded-box">
          Agoric Balance
        </div>
        <div className="daisyui-divider lg:daisyui-divider-horizontal"></div>
        <div className="card grid h-full flex-grow place-items-center rounded-box">
          Token Balance
        </div>
      </div>
    </div>
  );
};

export { OsmoSwap };
