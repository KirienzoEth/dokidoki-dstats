import { useEffect, useState } from 'react'
import axios from 'axios'
import styled from 'styled-components';
import Box from '../../../../Box'

const OPENSEA_API_ENDPOINT = "https://api.opensea.io/api/v1/assets?limit=50"
const COLLECTION_ADDRESS_PARAMETER = "asset_contract_address="
const TOKEN_ID_PARAMETER = "token_ids="

const NftsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  text-align: center;
`

const NftHeader = styled.div`
`

const NftImage = styled.img`
  max-width: 250px;
  margin-bottom: 25px;
`

export default function MachineNftList({ machineNfts }) {
  const [nftImages, setNftImages] = useState({})
  const [nftData] = useState(machineNfts.map(machineNft => {
    const [collectionAddress, nftId] = machineNft.nft.id.split("-")
    return {
      id: nftId,
      collectionAddress,
      uri: machineNft.nft.uri,
      maxAmount: machineNft.nft.maxAmount,
      machineMaxAmount: machineNft.maxAmount,
      machineCurrentAmount: machineNft.currentAmount
    }
  }))

  useEffect(() => {
    requestNftAssets(nftData).then(response => {
      const imageUrls = {}
      response.data.assets.forEach(nft => {
        imageUrls[nft.token_id] = nft.image_preview_url
      })

      setNftImages(imageUrls)
    }).catch(console.log)
  }, [nftData])

  const loader = (
    <p>Loading...</p>
  )

  return (
    <Box style={{ gridArea: "nfts" }}>
      <h2>NFTs: amount left in the machine | amount originally loaded | maximum supply</h2>
      <NftsContainer>
        {
          Object.keys(nftImages).length === 0 ? loader : nftData.map(machineNft => {
            return (
              <div key={machineNft.id}>
                <NftHeader>{machineNft.machineCurrentAmount} | {machineNft.machineMaxAmount} | {machineNft.maxAmount}</NftHeader>
                <NftImage alt="nft" src={nftImages[machineNft.id]} />
              </div>
            )
          })
        }
      </NftsContainer>
    </Box>
  )
}

// This is definitely bad, maybe use the ipfs uri and something to resize the image ? ( https://www.tutsmake.com/javascript-resize-image-example/ )
async function requestNftAssets(nftData) {
  const token_ids = nftData.map(nft => nft.id)

  return axios.get(OPENSEA_API_ENDPOINT + '&' + COLLECTION_ADDRESS_PARAMETER + nftData[0].collectionAddress + '&' + TOKEN_ID_PARAMETER + token_ids.join('&' + TOKEN_ID_PARAMETER))
}