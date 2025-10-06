import React from 'react';

/**
 * Renders an array of strings as a comma-separated list.
 * Handles null, undefined, or non-array inputs gracefully.
 *
 * @param {Object} props
 * @param {string[]} props.value - The array to render
 * @param {string} [props.emptyText="—"] - Text to show if value is empty or invalid
 */
const ArrayFieldRenderer = ({ value, emptyText = "—" }) => {
  if (!Array.isArray(value) || value.length === 0) {
    return <span>{emptyText}</span>;
  }

  return <span>{value.join(', ')}</span>;
};

export default ArrayFieldRenderer;
