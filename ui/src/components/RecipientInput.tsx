type Props = {
  address: string;
  onChange: (value: string) => void;
  error: string;
};

const RecipientInput = ({ address, onChange, error }: Props) => {
  return (
    <div>
      <h2 className="mb-2 text-lg font-medium">Recipient Address</h2>
      <label className="daisyui-input daisyui-input-bordered flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70"
        >
          <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
        </svg>
        <input
          type="text"
          className="grow"
          placeholder="agoric1..."
          value={address}
          onChange={ev => onChange(ev.target.value)}
        />
      </label>
      <div
        className={`daisyui-collapse ${error ? 'daisyui-collapse-open' : 'daisyui-collapse-close'}`}
      >
        <div className="daisyui-collapse-content px-1 pb-0 pt-2 text-warning">
          {error}
        </div>
      </div>
    </div>
  );
};

export default RecipientInput;
