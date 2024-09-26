import { FaUserPlus, FaWallet, FaMoneyCheckAlt, FaChartLine } from 'react-icons/fa';

const CreateAccountButton = ({
  handleCreateAccount,
  handleCreateAndFund,
  openFundModal,
  loadingCreateAccount,
  loadingCreateAndFund,
  loadingFundAndDelegate
}) => (
  // <div className="flex space-x-0">
  <div className="grid grid-cols-2 gap-2">

    <button
      className={`daisyui-btn daisyui-btn-info flex-grow rounded-r-none text-sm ${loadingCreateAccount ? 'bg-gray-600' : 'bg-blue-500'}`}
      onClick={handleCreateAccount}
      disabled={loadingCreateAccount}
    >
      {loadingCreateAccount ? (
        <svg
          aria-hidden="true"
          role="status"
          className="me-3 inline h-4 w-4 animate-spin text-gray-200 dark:text-gray-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="#1C64F2"
          />
        </svg>
      ) : (
        <div>
          Create <br /> <FaUserPlus className="inline-block h-5 w-5" />
        </div>
      )}
    </button>
    <button
      className={`daisyui-btn daisyui-btn-info flex-grow rounded-l-none text-sm ${loadingCreateAndFund ? 'bg-gray-600' : 'bg-blue-500'}`}
      onClick={handleCreateAndFund}
      disabled={loadingCreateAndFund}
    >
      {loadingCreateAndFund ? (
        <svg
          aria-hidden="true"
          role="status"
          className="me-3 inline h-4 w-4 animate-spin text-gray-200 dark:text-gray-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="#1C64F2"
          />
        </svg>
      ) : (
        <div>
          Fund New <br />
          <FaWallet className="inline-block h-5 w-5" />
        </div>
      )}
    </button>

    <button
      className={`daisyui-btn daisyui-btn-info flex-grow rounded-r-none text-sm ${loadingCreateAccount ? 'bg-gray-600' : 'bg-blue-500'}`}
      onClick={openFundModal} 
      disabled={loadingFundAndDelegate}
    >
      {loadingFundAndDelegate ? (
        <svg
          aria-hidden="true"
          role="status"
          className="me-3 inline h-4 w-4 animate-spin text-gray-200 dark:text-gray-600"
          viewBox="0 0 100 101"
          fill="none"
        >
          <path
            d="M100 50.6C100 78.2 77.6 100.6 50 100.6 22.4 100.6 0 78.2 0 50.6 0 23 22.4 0.6 50 0.6..."
            fill="currentColor"
          />
          <path
            d="M93.97 39.04C96.39 38.4 97.86 35.91 97.01 33.55C95.29 28.82 92.87 24.37 89.82 20.35C85.85 15.12..."
            fill="#1C64F2"
          />
        </svg>
      ) : (
        <div>
          Fund & Stake <br />
          <FaMoneyCheckAlt className="inline-block h-5 w-5" />
        </div>
      )}
    </button>
    
  </div>
);

export default CreateAccountButton;
