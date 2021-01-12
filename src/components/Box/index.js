import React from 'react'
import styled from 'styled-components'

const BoxContainer = styled.div`
  border: 2px solid #dfbbf6;
  margin: 10px 40px;
  box-shadow: 3px 3px #7b58cb;
  background-color: #cba1e7;
  border-radius: 5px;
  padding: 1em;
`


export default function Box( { className = '', children, style={} } ) {
  return (
    <BoxContainer className={className} style={style}>
      { children }
    </BoxContainer>
  )
}
