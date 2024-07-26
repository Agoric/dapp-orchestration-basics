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


export default AccountList;