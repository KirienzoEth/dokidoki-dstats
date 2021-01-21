import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Box from '../../Box'
import styled from 'styled-components'
import { CartesianGrid, XAxis, YAxis, Tooltip, AreaChart, Area, ResponsiveContainer } from 'recharts'
import moment from 'moment'
import ProgressBar from '../../ProgressBar'
import CustomTooltip from '../../Graph/Tooltip'
import { toLocaleString } from '../../../utils/Number'

const HeaderContainer = styled(Box)`
  font-size: 2em;
  display: grid;
  grid-template-areas: 'header header header header header';
  grid-gap: 10px;
`

const ContentContainer = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  grid-gap: 10px;
`

const TokenInfoContainer = styled.span`
  display: flex;
  align-items: center;
  img {
    margin-right: 1rem;
  }
`

const initialTokenData = {
  name: '',
  symbol: '',
  decimals: 0,
  burnAmount: 0,
  currentSupply: 0,
  dayData: []
}

export default function Azuki() {
  const [tokenData, setTokenData] = useState(initialTokenData)

  useEffect(() => {
    const tokenDataPromise = axios.post('https://api.thegraph.com/subgraphs/name/kirienzoeth/dokidoki-degacha-machine1', {
      "query": `
        {
          token(id: "0x910524678c0b1b23ffb9285a81f99c29c11cbaed") {
            name
            decimals
            burnAmount
            currentSupply
            tokenDayData(first: 365, orderBy: date, orderDirection: desc) {
              date
              burnAmount
            }
          }
        }
      `,
      "variables": null
    }).then(response => {
      const token = response.data.data.token
      let cumulativeBurn = token.burnAmount

      const dayData = token.tokenDayData.map((tokenDayData, index) => {
        cumulativeBurn -= token.tokenDayData[index - 1] ? token.tokenDayData[index - 1].burnAmount : 0
        return {
          name: moment.unix(tokenDayData.date).format('YYYY-MM-DD'),
          amount: tokenDayData.burnAmount / (10 ** token.decimals),
          cumulative: cumulativeBurn / (10 ** token.decimals)
        }
      })

      return {
        name: token.name,
        symbol: token.symbol,
        decimals: token.decimals,
        burnAmount: token.burnAmount / (10 ** token.decimals),
        currentSupply: token.currentSupply / (10 ** token.decimals),
        dayData: dayData.reverse()
      }
    })

    const tokenPricePromise = axios.post('https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2', {
      "query": `
        {
          token(id: "0x910524678c0b1b23ffb9285a81f99c29c11cbaed") {
            derivedETH
          }
        }
      `,
      "variables": null
    }).then(response => {
      if (response.data.data.token === null) {
        return 0
      }

      return 1 / response.data.data.token.derivedETH
    })

    Promise.all([tokenDataPromise, tokenPricePromise]).then(values => {
      setTokenData({ ...values[0], price: values[1] })
    })
  }, [])

  if (tokenData.dayData.length === 0) {
    return (
      <p>Loading...</p>
    )
  }

  return (
    <>
      <HeaderContainer>
        <TokenInfoContainer><img alt="azuki" src="/azuki.png" width="50" height="50" />Azuki</TokenInfoContainer>
        <TokenInfoContainer>1 ETH = {toLocaleString(tokenData.price)} AZUKI</TokenInfoContainer>
        <TokenInfoContainer>Current supply: {toLocaleString(tokenData.currentSupply)}</TokenInfoContainer>
        <TokenInfoContainer>Burned: {toLocaleString(tokenData.burnAmount)}</TokenInfoContainer>
        <TokenInfoContainer>Max: {toLocaleString(80000000)}</TokenInfoContainer>
      </HeaderContainer>

      <Box>
        <h2>Farming progress:</h2>
        <ProgressBar progress={tokenData.currentSupply / 20000000 * 100} content={`${toLocaleString(tokenData.currentSupply)} / ${toLocaleString(20000000)}`} />
      </Box>

      <ContentContainer>
        <Box>
          <h2>Amount burned over time:</h2>
          <ResponsiveContainer width={"99%"} height={300}>
            <AreaChart fontSize={20} margin={{ left: 50, bottom: 50, top: 50, right: 100 }} data={tokenData.dayData} syncId="azukiBurn">
              <defs>
                <linearGradient id="cumulative" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#de5b80" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#de5b80" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" angle={30} textAnchor={'start'} interval="preserveStartEnd" />
              <YAxis />
              <CartesianGrid strokeDasharray="2 2" stroke="#4e4166" />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="cumulative" name="over time" stroke="#de5b80" fillOpacity={1} fill="url(#cumulative)" />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
        <Box>
          <h2>Amount burned per day:</h2>
          <ResponsiveContainer width={"99%"} height={300}>
            <AreaChart fontSize={20} margin={{ left: 50, bottom: 50, top: 50, right: 100 }} data={tokenData.dayData} syncId="azukiBurn">
              <defs>
                <linearGradient id="amount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#de5b80" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#de5b80" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" angle={30} textAnchor={'start'} interval="preserveStartEnd" />
              <YAxis />
              <CartesianGrid strokeDasharray="2 2" stroke="#4e4166" />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="amount" name="per day" stroke="#de5b80" fillOpacity={1} fill="url(#amount)" />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </ContentContainer>
    </>
  )
}
