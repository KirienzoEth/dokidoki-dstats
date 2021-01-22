import React from 'react'
import Box from '../../Box'
import { toLocaleString } from '../../../utils/Number'

export default function Tooltip({ active, payload, label }) {
  if (active && payload) {
    return (
      <Box>
        <div>{label}</div>
        {
          payload.map(element => (
            <div key={element.name} style={{ color: element.color }}>{element.name}: {toLocaleString(element.value)}</div>
          ))
        }
      </Box>
    );
  }

  return null;
}