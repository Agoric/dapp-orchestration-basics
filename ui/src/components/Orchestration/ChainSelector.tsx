import React from 'react';

const ChainSelector = ({ setSelectedChain }) => (
  <select
    className="select select-bordered mb-4 rounded-lg border-0 w-full max-w-xs text-lg"
    onChange={(e) => setSelectedChain(e.target.value)}
  >
    <option disabled selected>Select Remote Chain</option>
    <option value="osmosis">Osmosis</option>
    <option value="agoric">Agoric</option>
  </select>
);

export default ChainSelector;