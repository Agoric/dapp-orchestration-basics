const ChainSelector = ({ setSelectedChain }) => (
  <select
    className="select select-bordered daisyui-focus:ring-blue-500 daisyui-focus:border-blue-500 bg-black-500 daisyui-input-bordered w-full rounded-lg px-4 py-2 text-lg text-white"
    onChange={e => setSelectedChain(e.target.value)}
  >
    <option disabled selected>
      Select Chain
    </option>
    <option value="osmosis">Osmosis</option>
    <option value="agoric">Agoric</option>
  </select>
);

export default ChainSelector;
