import React from 'react'
import styled from 'styled-components'
import Box from '../../../Box'

const MachineHeader = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 2px solid #7b58cb;
  font-size: 1.5em;
  font-weight: 700;
  min-width: 0;
  span {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`

const MachineContent = styled.div`
  text-align: center;
  padding: 0.5em 0;
  div {
    font-size: 2em;
  }
`

export default function MachinePreview( {machineData} ) {
  return (
    <Box>
      <MachineHeader><span>{machineData.name}</span><img alt='azuki token' src={`/${ machineData.currency.toLowerCase() }.png`} width={24} height={24}/></MachineHeader>
      <MachineContent>
        <img alt='degacha machine' src='/degacha.png' width='100%' />
        <div>{machineData.price} {machineData.currency}</div>
      </MachineContent>
    </Box>
  )
}
