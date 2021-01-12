import React from 'react'
import styled from 'styled-components'

const Fragment = styled.div`
  margin: 10px auto;
`

const ProgressBarContainer = styled.div`
  position: relative;
  width: 100%;
  height: 50px;
  border: 1px solid #5225bd;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`

const ProgressBarComplete = styled.div`
  position: absolute;
  left: 0;
  top: 0px;
  height: 100%;
  background-color: #de5b80;
  border-radius: 10px;
  z-index: 2;
  width: ${props => props.width};
`

const ProgressBarLiquid = styled.div`
  z-index: 1;
  width: 70px;
  height: 70px;
  position: absolute;
  right: -5px;
  top: -10px;
  background-color: #de5b80;
  border-radius: 40%;
`

const ProgressBarProgress = styled.div`
  z-index: 2;
  font-weight: 700;
`

export default function ProgressBar({ progress, content }) {
  return (
    <Fragment>
      <ProgressBarContainer>
        <ProgressBarComplete width={`${progress}%`}>
          <ProgressBarLiquid />
        </ProgressBarComplete>
        <ProgressBarProgress>{content}</ProgressBarProgress>
      </ProgressBarContainer>
    </Fragment>
  )
}
