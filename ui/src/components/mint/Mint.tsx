import { Inventory } from '../Inventory';
import { MintTickets } from './MintTickets';

const Mint = () => {
  // Whole Mint UI
  return (
    <div className="flex w-full flex-row justify-center">
      <div className="flex w-11/12 flex-row">
        <div className="card grid h-full flex-grow place-items-center rounded-box">
          <MintTickets />
        </div>
        <div className="daisyui-divider lg:daisyui-divider-horizontal"></div>
        <div className="card grid h-full flex-grow place-items-center rounded-box">
          <Inventory />
        </div>
      </div>
    </div>
  );
};

export { Mint };
