import { type Amount, AssetKind, type Brand } from '@agoric/web-components';
import { AmountValue } from '../DisplayAmount';
import { useAgoric } from '@agoric/react-components';
import { useContext, useEffect, useState } from 'react';
import { useDisplayInfo } from '../../store/displayInfo';
import { NotificationContext } from '../../context/NotificationContext';

type Props = {
  invitation: {
    customDetails: {
      give: Record<string, Amount>;
      want: Record<string, Amount>;
    };
    description: string;
    instance: unknown;
  };
};

const IncomingOffer = ({ invitation }: Props) => {
  const { addNotification } = useContext(NotificationContext);
  const [inProgress, setInProgress] = useState(false);
  const { chainStorageWatcher, makeOffer } = useAgoric();
  const { brandToDisplayInfo, saveDisplayInfo } = useDisplayInfo();
  const [isLoaded, setIsLoaded] = useState(false);

  const youGive = Object.entries(invitation.customDetails.want);
  const youGet = Object.entries(invitation.customDetails.give).filter(
    ([kw]) => kw !== 'Fee',
  );

  const accept = () => {
    if (!makeOffer) return;

    setInProgress(true);
    makeOffer(
      {
        source: 'purse',
        description: invitation.description,
        instance: invitation.instance,
      },
      { give: Object.fromEntries(youGive), want: Object.fromEntries(youGet) },
      undefined,
      (update: { status: string; data?: unknown }) => {
        if (update.status === 'error') {
          addNotification!({
            text: `Swap Error: ${update.data}`,
            status: 'error',
          });
          setInProgress(false);
        }
        if (update.status === 'accepted') {
          addNotification!({
            text: 'Swap Accepted',
            status: 'success',
          });
        }
        if (update.status === 'refunded') {
          addNotification!({
            text: 'Swap Refunded',
            status: 'warning',
          });
        }
      },
    );
  };

  useEffect(() => {
    const loadUnknownDisplayInfos = async () => {
      if (!chainStorageWatcher) return;

      const allBrands = youGive
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .map(([_kw, amount]) => amount.brand)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .concat(youGet.map(([_kw, amount]) => amount.brand)) as Brand[];

      const unknownBrands = [
        ...new Set(allBrands.filter(b => !brandToDisplayInfo.has(b))),
      ];

      const boardAuxes = await Promise.all(
        chainStorageWatcher.queryBoardAux<{
          allegedName: string;
          displayInfo: { assetKind: AssetKind; decimalPlaces?: number };
        }>([...unknownBrands]),
      );

      boardAuxes.forEach((boardAux, index) => {
        saveDisplayInfo({
          brand: unknownBrands[index],
          info: {
            ...boardAux.displayInfo,
            petname: boardAux.allegedName,
          },
        });
      });

      setIsLoaded(true);
    };

    loadUnknownDisplayInfos();
  }, [
    brandToDisplayInfo,
    chainStorageWatcher,
    saveDisplayInfo,
    youGet,
    youGive,
  ]);

  const proposalEntry = ([kw, amount]: [string, Amount]) => {
    const displayInfo = brandToDisplayInfo.get(amount.brand)!;
    const { assetKind, petname, decimalPlaces } = displayInfo;

    return (
      <div key={kw} className="my-1 font-medium">
        -{' '}
        <AmountValue
          amount={amount}
          displayInfo={{
            assetKind,
            petname,
            decimalPlaces,
          }}
        />
      </div>
    );
  };

  return isLoaded ? (
    <div className="daisyui-card w-full bg-base-300 p-4 shadow-xl">
      <h3 className="text-lg font-medium">You Give:</h3>
      <div className="ml-2 text-sm">
        {youGive.length ? youGive.map(proposalEntry) : 'Nothing.'}
      </div>
      <h3 className="text-lg font-medium">You Get:</h3>
      <div className="ml-2 text-sm">
        {youGet.length ? youGet.map(proposalEntry) : 'Nothing.'}
      </div>
      <div className="flex flex-row items-center justify-end gap-2">
        <button
          disabled={inProgress}
          onClick={accept}
          className="daisyui-btn daisyui-btn-primary daisyui-btn-sm text-base font-medium"
        >
          {inProgress ? (
            <div className="daisyui-loading daisyui-loading-spinner daisyui-loading-sm"></div>
          ) : (
            'Accept'
          )}
        </button>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default IncomingOffer;
