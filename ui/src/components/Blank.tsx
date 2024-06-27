import { AmountMath } from '@agoric/ertp';
import { ConnectWalletButton, useAgoric } from '@agoric/react-components';
import { stringifyAmountValue } from '@agoric/web-components';
import { usePurse } from '../hooks/usePurse';
import type { CopyBag } from '../types';
// import { Mint } from './components/mint/Mint';
import { MintTickets } from './mint/MintTickets';


const Blank = () => {

    const istPurse = usePurse('IST');
    const ticketsPurse = usePurse('Ticket');
    const { walletConnection } = useAgoric();

    
    return (
        <div>
            <ConnectWalletButton className="daisyui-btn daisyui-btn-outline daisyui-btn-primary" />

            {walletConnection && (
              <div>



                <div>
                  <b>IST: </b>
                  {istPurse ? (
                    stringifyAmountValue(
                      AmountMath.make(
                        istPurse?.currentAmount.brand,
                        istPurse?.currentAmount.value,
                      ),
                      istPurse.displayInfo.assetKind,
                      istPurse.displayInfo.decimalPlaces,
                    )
                  ) : (
                    <i>Fetching balance...</i>
                  )}
                </div>



                <div>
                  <b>Tickets: </b>

                  {ticketsPurse ? (

                    <ul>

                      {(
                        ticketsPurse.currentAmount.value as CopyBag
                      ).payload.map(([name, number]) => (

                        <li key={name}>
                          {String(number)} {name}
                        </li>

                      ))}

                    </ul>

                  ) : (
                    'None'
                  )}

                </div>

                
              </div>
            )}
            <MintTickets />
        </div>
    )
}

export {Blank}