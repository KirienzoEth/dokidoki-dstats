import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios'
import styled from 'styled-components';
import Box from '../Box'
import MachinePreview from './components/MachinePreview'

const MachinesListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
`

const HeaderContainer = styled(Box)`
  font-size: 2em;
  display: grid;
  grid-template-areas: 'header header header header';
  grid-gap: 10px;
`

const InfoContainer = styled.span`
  display: flex;
  align-items: center;
  img {
    margin-right: 1rem;
  }
`

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  &:hover {
    cursor: pointer
  }
`

export default function Degacha() {
  const [machinesList, setMachinesList] = useState()

  useEffect(() => {
    axios.post('https://api.thegraph.com/subgraphs/name/kirienzoeth/dokidoki-degacha-machine1', {
      "query": `
        {
          machines(orderBy: createdDate, orderDirection: asc) {
            id
            title
            playOncePrice
            locked
            currencyToken {
              symbol
              decimals
            }
          }
        }
      `,
      "variables": null
    }).then(response => {
      const machines = response.data.data.machines.map(machine => {
        return {
          id: machine.id,
          name: machine.title,
          price: machine.playOncePrice / (10 ** machine.currencyToken.decimals),
          currency: machine.currencyToken.symbol
        }
      })

      setMachinesList(machines)
    })
  }, [])

  if (machinesList === undefined) {
    return (
      <p>Loading...</p>
    )
  }

  return (
    <>
      <HeaderContainer>
        <InfoContainer><img alt="degacha" src="/degacha.png" width="50" height="50" />Gachapon machines</InfoContainer>
      </HeaderContainer>
      <MachinesListContainer>
        {
          machinesList.map(machine => (
              <StyledLink key={machine.id} to={`/product/degacha/machine/${machine.id}`}>
                <MachinePreview machineData={machine} />
              </StyledLink>
            )
          )
        }
      </MachinesListContainer>
    </>
  )
}
