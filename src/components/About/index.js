import React from 'react'
import styled from 'styled-components'
import Box from '../Box'

const HeaderContainer = styled(Box)`
  font-size: 2em;
  display: flex;
`

export default function About() {
  return (
    <>
      <HeaderContainer>
        About this website
      </HeaderContainer>
      <Box>
        <h2>What's this ?</h2>
        <p>This website was developped by the community of DokiDoki Finance, the team cannot be held responsible for any inaccuracy displayed here.</p>
        <p>However, the goal is to provide transparent and accurate information, so if you see anything that you think is wrong, please reach out to me ("Kirienzo") on TG, Discord or on my <a target="_blank" rel="noreferrer" href="https://twitter.com/Kirienzo">Twitter</a> (with ways to verify your claims), I will make sure it's fixed as soon as possible.</p>
        <p>Note that I will never PM you to ask for funds, so beware of impersonators.</p>
      </Box>
      <Box>
        <h2>Where do you get your data ?</h2>
        <p>All the data come from subgraphs built with <a target="_blank" rel="noreferrer" href="https://thegraph.com/">TheGraph Protocol</a>, but especially this one, made for the DokiDoki Finance projects in particular: <a href="https://thegraph.com/explorer/subgraph/kirienzoeth/dokidoki-degacha-machine1" target="_blank" rel="noreferrer">Link to the DokiDoki subgraph</a>.</p>
        <p>
          All the code is available on GitHub:
          <ul>
            <li><a href="https://github.com/KirienzoEth/dokidoki-gacha-machine1-subgraph" target="_blank" rel="noreferrer">Subgraph code</a></li>
            <li><a href="https://github.com/KirienzoEth/dokidoki-dstats" target="_blank" rel="noreferrer">Website code</a></li>
          </ul>
        </p>
        <p>You can contribute by opening issues and pull requests, I will make sure to answer in a timely manner !</p>
      </Box>
      <Box>
        <h2>Support us !</h2>
        <p>
          If you like this kind of initiatives, consider donating to the DokiDoki Loyalist fund address to incentivize community work around the project:
          <h2>0x7DDAC0fA928a71E820d28A70f092D87a037BF228</h2>
        </p>
        <p>
          If you <b>REALLY</b> like this website in particular, consider buying me a bowl of ramen (or a lambo, I'm not forcing you) by donating to this address:
          <h2>0x8057ab90850770615F6fC9100B5d560bB32fe785</h2>
        </p>
        <p>Both addresses can receive ETH, NFTs or any asset built on Ethereum (DOKI, AZUKI, AAVE, LINK, SUSHI...).</p>
      </Box>
    </>
  )
}
