import React from 'react';

const ChainSelector = ({ setSelectedChain }) => (
  <select
  className="select select-bordered daisyui-input-bordered daisyui-focus:ring-blue-500 daisyui-focus:border-blue-500 bg-black-500 text-white text-lg py-2 px-4 rounded-lg w-full"
  onChange={(e) => setSelectedChain(e.target.value)}
  >
    <option disabled selected>Select Chain</option>
    <option value="osmosis">Osmosis</option>
    <option value="agoric">Agoric</option>
  </select>
);

export default ChainSelector;