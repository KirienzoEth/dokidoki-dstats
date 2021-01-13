import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios'
import styled from 'styled-components';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { CartesianGrid, XAxis, YAxis, Tooltip, AreaChart, Area, ResponsiveContainer } from 'recharts'
import CustomTooltip from '../../../Graph/Tooltip'
import Box from '../../../Box'

const HeaderContainer = styled(Box)`
  font-size: 2em;
  display: grid;
  grid-template-areas: 'header header';
  grid-gap: 10px;
  div {
    display: flex;
    align-items: center;
    img {
      margin-right: 1rem;
    }
  }
`

const MachineInfo = styled(Box)`
  >p {
    font-size: 18px;
  }
`

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  grid-template-areas: 'description price'
  'description createdDate'
  'playTimes amountSpent'
  'burnAmount profitAmount';
  grid-gap: 10px;
`

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  &:hover {
    cursor: pointer
  }
`

export default function MachineDetails() {
  let { id } = useParams();
  const [machineData, setMachineData] = useState()

  useEffect(() => {
    axios.post('https://api.thegraph.com/subgraphs/name/kirienzoeth/dokidoki-degacha-machine1', {
      "query": `
        {
          machine(id: "${id}") {
            title
            playOncePrice
            playTimes
            description
            createdDate
            burnAmount
            profitAmount
            amountSpent
            currencyToken {
              symbol
              decimals
            }
            machineDayData(first: 365, orderBy: date, orderDirection: desc) {
              date
              burnAmount
              profitAmount
              amountSpent
              playTimes
            }
          }
        }
      `,
      "variables": null
    }).then(response => {
      const machine = response.data.data.machine
      let cumulativeBurn = machine.burnAmount
      let cumulativeProfit = machine.profitAmount
      let cumulativeSpent = machine.amountSpent
      let cumulativePlayTimes = machine.playTimes

      const dayData = machine.machineDayData.map((machineDayData, index) => {
        cumulativeBurn -= machine.machineDayData[index - 1] ? machine.machineDayData[index - 1].burnAmount : 0
        cumulativeProfit -= machine.machineDayData[index - 1] ? machine.machineDayData[index - 1].profitAmount : 0
        cumulativeSpent -= machine.machineDayData[index - 1] ? machine.machineDayData[index - 1].amountSpent : 0
        cumulativePlayTimes -= machine.machineDayData[index - 1] ? machine.machineDayData[index - 1].playTimes : 0

        return {
          name: moment.unix(machineDayData.date).format('YYYY-MM-DD'),
          burnAmount: machineDayData.burnAmount / (10 ** machine.currencyToken.decimals),
          profitAmount: machineDayData.profitAmount / (10 ** machine.currencyToken.decimals),
          amountSpent: machineDayData.amountSpent / (10 ** machine.currencyToken.decimals),
          playTimes: machineDayData.playTimes,

          cumulativeBurn: cumulativeBurn / (10 ** machine.currencyToken.decimals),
          cumulativeProfit: cumulativeProfit / (10 ** machine.currencyToken.decimals),
          cumulativeSpent: cumulativeSpent / (10 ** machine.currencyToken.decimals),
          cumulativePlayTimes: cumulativePlayTimes,
        }
      })

      setMachineData({
        name: machine.title,
        description: machine.description,
        currencyToken: machine.currencyToken.symbol,
        playOncePrice: machine.playOncePrice / (10 ** machine.currencyToken.decimals),
        createdDate: moment.unix(machine.createdDate).format('YYYY-MM-DD LT [UTC]'),
        burnAmount: machine.burnAmount / (10 ** machine.currencyToken.decimals),
        profitAmount: machine.profitAmount / (10 ** machine.currencyToken.decimals),
        amountSpent: machine.amountSpent / (10 ** machine.currencyToken.decimals),
        playTimes: machine.playTimes,
        dayData: dayData.reverse()
      })
    })
  }, [id])

  if (machineData === undefined) {
    return (
      <p>Loading...</p>
    )
  }

  return (
    <>
      <HeaderContainer>
        <div><img alt={machineData.currencyToken.toLowerCase()} src={`/${machineData.currencyToken.toLowerCase()}.png`} width="50" height="50" />{machineData.name}</div>
        <div style={{ justifyContent: "right" }}><StyledLink to="/product/degacha">X</StyledLink></div>
      </HeaderContainer>
      <ContentContainer>
        <MachineInfo style={{ gridArea: "description" }}>
          <h2>Description:</h2>
          <p>{machineData.description}</p>
        </MachineInfo>
        <MachineInfo style={{ gridArea: "price" }}>
          <h2>Price for one spin:</h2>
          <p>{machineData.playOncePrice} {machineData.currencyToken}</p>
        </MachineInfo>
        <MachineInfo style={{ gridArea: "createdDate" }}>
          <h2>Operating since:</h2>
          <p>{machineData.createdDate}</p>
        </MachineInfo>
        <Box style={{ gridArea: "playTimes" }}>
          <h2>Times played:</h2>
          <ResponsiveContainer width={"99%"} height={300}>
            <AreaChart fontSize={20} margin={{ left: 50, bottom: 50, top: 50, right: 100 }} data={machineData.dayData} syncId="machineData">
              <defs>
                <linearGradient id="playTimes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#acfffb" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#acfffb" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="cumulativePlayTimes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#de5b80" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#de5b80" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" angle={30} textAnchor={'start'} interval="preserveStartEnd" />
              <YAxis yAxisId="left" type="number" dataKey="playTimes" name="per day" stroke="#acfffb" />
              <YAxis yAxisId="right" type="number" dataKey="cumulativePlayTimes" name="cumulative" orientation="right" stroke="#de5b80" />
              <CartesianGrid strokeDasharray="2 2" stroke="#4e4166" />
              <Tooltip content={<CustomTooltip />} />
              <Area yAxisId="right" type="monotone" dataKey="cumulativePlayTimes" name="over time" stroke="#de5b80" fillOpacity={1} fill="url(#cumulativePlayTimes)" />
              <Area yAxisId="left" type="monotone" dataKey="playTimes" name="per day" stroke="#acfffb" fillOpacity={1} fill="url(#playTimes)" />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
        <Box style={{ gridArea: "amountSpent" }}>
          <h2>{machineData.currencyToken} spent:</h2>
          <ResponsiveContainer width={"99%"} height={300}>
            <AreaChart fontSize={20} margin={{ left: 50, bottom: 50, top: 50, right: 100 }} data={machineData.dayData} syncId="machineData">
              <defs>
                <linearGradient id="amountSpent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#acfffb" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#acfffb" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="cumulativeSpent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#de5b80" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#de5b80" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" angle={30} textAnchor={'start'} interval="preserveStartEnd" />
              <YAxis yAxisId="left" type="number" dataKey="amountSpent" name="per day" stroke="#acfffb" />
              <YAxis yAxisId="right" type="number" dataKey="cumulativeSpent" name="cumulative" orientation="right" stroke="#de5b80" />
              <CartesianGrid strokeDasharray="2 2" stroke="#4e4166" />
              <Tooltip content={<CustomTooltip />} />
              <Area yAxisId="right" type="monotone" dataKey="cumulativeSpent" name="over time" stroke="#de5b80" fillOpacity={1} fill="url(#cumulativeSpent)" />
              <Area yAxisId="left" type="monotone" dataKey="amountSpent" name="per day" stroke="#acfffb" fillOpacity={1} fill="url(#amountSpent)" />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
        <Box style={{ gridArea: "burnAmount" }}>
          <h2>{machineData.currencyToken} burned:</h2>
          <ResponsiveContainer width={"99%"} height={300}>
            <AreaChart fontSize={20} margin={{ left: 50, bottom: 50, top: 50, right: 100 }} data={machineData.dayData} syncId="machineData">
              <defs>
                <linearGradient id="burnAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#acfffb" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#acfffb" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="cumulativeBurn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#de5b80" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#de5b80" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" angle={30} textAnchor={'start'} interval="preserveStartEnd" />
              <YAxis yAxisId="left" type="number" dataKey="burnAmount" name="per day" stroke="#acfffb" />
              <YAxis yAxisId="right" type="number" dataKey="cumulativeBurn" name="cumulative" orientation="right" stroke="#de5b80" />
              <CartesianGrid strokeDasharray="2 2" stroke="#4e4166" />
              <Tooltip content={<CustomTooltip />} />
              <Area yAxisId="right" type="monotone" dataKey="cumulativeBurn" name="over time" stroke="#de5b80" fillOpacity={1} fill="url(#cumulativeBurn)" />
              <Area yAxisId="left" type="monotone" dataKey="burnAmount" name="per day" stroke="#acfffb" fillOpacity={1} fill="url(#burnAmount)" />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
        <Box style={{ gridArea: "profitAmount" }}>
          <h2>Profit (in {machineData.currencyToken}):</h2>
          <ResponsiveContainer width={"99%"} height={300}>
            <AreaChart fontSize={20} margin={{ left: 50, bottom: 50, top: 50, right: 100 }} data={machineData.dayData} syncId="machineData">
              <defs>
                <linearGradient id="profitAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#acfffb" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#acfffb" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="cumulativeProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#de5b80" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#de5b80" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" angle={30} textAnchor={'start'} interval="preserveStartEnd" />
              <YAxis yAxisId="left" type="number" dataKey="profitAmount" name="per day" stroke="#acfffb" />
              <YAxis yAxisId="right" type="number" dataKey="cumulativeProfit" name="cumulative" orientation="right" stroke="#de5b80" />
              <CartesianGrid strokeDasharray="2 2" stroke="#4e4166" />
              <Tooltip content={<CustomTooltip />} />
              <Area yAxisId="right" type="monotone" dataKey="cumulativeProfit" name="over time" stroke="#de5b80" fillOpacity={1} fill="url(#cumulativeProfit)" />
              <Area yAxisId="left" type="monotone" dataKey="profitAmount" name="per day" stroke="#acfffb" fillOpacity={1} fill="url(#profitAmount)" />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </ContentContainer>
    </>
  )
}
