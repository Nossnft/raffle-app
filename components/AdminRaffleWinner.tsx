import { Box, Card, Text } from "@chakra-ui/react";
import { RAFFLE_CONTRACT_ADDRESS } from "../const/addresses";
import { useContract, useContractRead } from "@thirdweb-dev/react";
import AdminTransferNFT from "./AdminTransferNFT";

export default function AdminRaffleWinner() {
  const {
    contract: raffleContract
  } = useContract(RAFFLE_CONTRACT_ADDRESS);

  const {
    data:prizeNFTContractAddress
  } = useContractRead(raffleContract, "nftAddress");

  const {
    data: prizeNFTTokenId
  } = useContractRead(raffleContract, "nftId");
  return (
    <Card p={4}>
      <Text fontSize={"xl"} fontWeight={"bold"}>Raffle Winner</Text>
      {prizeNFTContractAddress == "0x000000000000000000000000000000000000" ? (
        <Box>
          <Text>No prize NFT set</Text>
          <Text>Please start a new raffle & select the nft that will be raffled off.</Text>
        </Box>
      ) : (
        <AdminTransferNFT
            nftContractAddress={prizeNFTContractAddress}
            tokenId={prizeNFTTokenId}
             />
         

      )} 
    </Card>
  )
}