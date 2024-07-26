const tokenLogos = {
    ubld: 'https://assets.coingecko.com/coins/images/24487/large/agoric_bld_logo.png?1696523668',
    uist: 'https://inter.trade/static/inter-protocol-logo-symbol-color-64318316bdb96c351674e3157a9f7546.png',
    default: 'https://path/to/default/logo.png',
};

  
const AccountList = ({ balances, loadingDeposit, handleDeposit, loadingWithdraw, handleWithdraw, loadingStake, handleStake, loadingUnstake, handleUnstake, guidelines }) => {
    return (
      <div className={`w-2/3 space-y-10 pr-4 rounded-lg p-4 border${guidelines ? "" : "-0"}`}>
        <h1 className="daisyui-card-title">Accounts</h1>
        {balances.map((balance, idx) => (
          <div key={idx} className={`card bg-base-100 shadow-md p-4 rounded-lg border${guidelines ? "" : "-0"}`}>
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-title">Address</div>
                <div className="stat-value text-primary">{balance.address.slice(0, 10)}...{balance.address.slice(-10)}</div>
              </div>
  
              <div className="flex flex-wrap">
                {balance.balances.map((bal, idx) => (
                  <div key={idx} className={`stat p-2  border${guidelines ? "" : "-0"}`}>
                    <div className="stat-figure text-secondary">
                      <div className="avatar online">
                        <div className="w-8 rounded-full">
                          <img src={tokenLogos[bal.denom] || tokenLogos.default} alt={`${bal.denom} logo`} />
                        </div>
                      </div>
                    </div>
                    <div className="stat-title">{bal.denom.toUpperCase()}</div>
                    <div className="stat-value text-secondary">{bal.amount}</div>
                  </div>
                ))}
              </div>
            </div>
  
            <div className={`flex flex-col space-y-1 mt-2 border${guidelines ? "" : "-0"}`}>
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <button className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white ${loadingDeposit[balance.address] ? 'bg-gray-600' : 'bg-gray-800'} border border-gray-700 rounded-l-full hover:bg-gray-700 hover:text-blue-500`} onClick={() => handleDeposit(balance.address)} disabled={loadingDeposit[balance.address]}>
                  Deposit
                </button>
                <button className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white ${loadingWithdraw[balance.address] ? 'bg-gray-600' : 'bg-gray-800'} border-t border-b border-gray-700 hover:bg-gray-700 hover:text-blue-500`} onClick={() => handleWithdraw(balance.address)} disabled={loadingWithdraw[balance.address]}>
                  Withdraw
                </button>
                <button className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white ${loadingStake[balance.address] ? 'bg-gray-600' : 'bg-gray-800'} border-t border-b border-gray-700 hover:bg-gray-700 hover:text-blue-500`} onClick={() => handleStake(balance.address)} disabled={loadingStake[balance.address]}>
                  Stake
                </button>
                <button className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white ${loadingUnstake[balance.address] ? 'bg-gray-600' : 'bg-gray-800'} border border-gray-700 rounded-r-full hover:bg-gray-700 hover:text-blue-500`} onClick={() => handleUnstake(balance.address)} disabled={loadingUnstake[balance.address]}>
                  Unstake
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

// const Spinner = () => (
//   <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
//     <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2"/>
//   </svg>
// );

export default AccountList;