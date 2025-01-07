// components/ui/input.js
import React from 'react';

export const Input = ({ type = 'text', ...props }) => (
  <input
    type={type}
    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    {...props}
  />
);
