const tokenLogos = {
  ubld: 'https://assets.coingecko.com/coins/images/24487/large/agoric_bld_logo.png?1696523668',
  uist: 'https://inter.trade/static/inter-protocol-logo-symbol-color-64318316bdb96c351674e3157a9f7546.png',
  ibc: 'https://cdn-icons-png.flaticon.com/512/566/566295.png',
  default: 'https://cdn-icons-png.flaticon.com/512/566/566295.png',
};

const AccountList = ({
  balances,
  loadingDeposit,
  handleDeposit,
  loadingWithdraw,
  handleWithdraw,
  loadingStake,
  handleStake,
  loadingUnstake,
  handleUnstake,
  guidelines,
}) => {
  return (
    <div
      className={`w-2/3 space-y-10 rounded-lg p-4 pr-4 border${guidelines ? '' : '-0'}`}
    >
      <h1 className="daisyui-card-title">Accounts</h1>
      {balances.map((balance, idx) => (
        <div
          key={idx}
          className={`card bg-base-100 rounded-lg p-4 shadow-md border${guidelines ? '' : '-0'}`}
        >
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Address</div>
              <div className="stat-value text-primary">
                {balance.address.slice(0, 10)}...{balance.address.slice(-10)}
              </div>
            </div>

            <div className="flex flex-wrap">
              {balance.balances.map((bal, idx) => (
                <div
                  key={idx}
                  className={`stat p-2 border${guidelines ? '' : '-0'}`}
                  style={{ minWidth: '150px', maxWidth: '200px' }}
                >
                  <div className="stat-figure text-secondary">
                    <div className="avatar online">
                      <div className="w-8 rounded-full">
                        <img
                          src={tokenLogos[bal.denom] || tokenLogos.default}
                          alt={`${bal.denom} logo`}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="stat-title truncate">
                    {bal.denom.toUpperCase()}
                  </div>
                  <div className="stat-value text-secondary">{bal.amount}</div>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`mt-2 flex flex-col space-y-1 border${guidelines ? '' : '-0'}`}
          >
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white ${loadingDeposit[balance.address] ? 'bg-gray-600' : 'bg-gray-800'} rounded-l-full border border-gray-700 hover:bg-gray-700 hover:text-blue-500`}
                onClick={() => handleDeposit(balance.address)}
                disabled={loadingDeposit[balance.address]}
              >
                Deposit
              </button>
              <button
                className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white ${loadingWithdraw[balance.address] ? 'bg-gray-600' : 'bg-gray-800'} border-b border-t border-gray-700 hover:bg-gray-700 hover:text-blue-500`}
                onClick={() => handleWithdraw(balance.address)}
                disabled={loadingWithdraw[balance.address]}
              >
                Withdraw
              </button>
              <button
                className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white ${loadingStake[balance.address] ? 'bg-gray-600' : 'bg-gray-800'} border-b border-t border-gray-700 hover:bg-gray-700 hover:text-blue-500`}
                onClick={() => handleStake(balance.address)}
                disabled={loadingStake[balance.address]}
              >
                Stake
              </button>
              <button
                className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white ${loadingUnstake[balance.address] ? 'bg-gray-600' : 'bg-gray-800'} rounded-r-full border border-gray-700 hover:bg-gray-700 hover:text-blue-500`}
                onClick={() => handleUnstake(balance.address)}
                disabled={loadingUnstake[balance.address]}
              >
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
