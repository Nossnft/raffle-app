import { NextPage } from "next";
import { Box, Button, Container, Flex, Input, SimpleGrid, Stack, Text } from "@chakra-ui/react"
import {MediaRenderer, Web3Button, useAddress, useContract, useContractRead } from "@thirdweb-dev/react"
import { HERO_IMAGE_URL, RAFFLE_CONTRACT_ADDRESS } from "../const/addresses";
import {ethers} from "ethers";
import RaffleStatus from "../components/raffleStatus";
import { useState } from "react";
import PrizeNFT from "../components/prizeNFT";
import CurrentEntries from "../components/currentEntries";

const Home: NextPage = () => {
  const address = useAddress();
  
  const {
    contract
  } = useContract(RAFFLE_CONTRACT_ADDRESS);

  const {
    data: entryCost,
    isLoading: isLoadingEntryCost
  } = useContractRead(contract, "entryCost");
  const entryCostInEther = entryCost ? ethers.utils.formatEther(entryCost) : "0";
  
  const {
    data: raffleStatus,
  } = useContractRead(contract, "raffleStatus");

  const {
    data: totalEntries,
    isLoading: isLoadingTotalEntries
  } = useContractRead(contract, "totalEntries");

  const [entryAmount, setEntryAmount] = useState(0);
  const entryCostOnSubmit = parseFloat(entryCostInEther) * entryAmount;

  function increaseEntryAmount() {
    setEntryAmount(entryAmount + 1);
  }

  function decreaseEntryAmount() {
    if (entryAmount > 0) {
      setEntryAmount(entryAmount -1);
    }
  }
  
  return (
    
    <Container maxW={"1440px"} py={8} bg= "#E6E6FA">
      <SimpleGrid columns={2} spacing={10} minH={"60vh"}>
        <Flex>
          {raffleStatus ?(
            <PrizeNFT />
          ) : (
            
          <MediaRenderer
            src={HERO_IMAGE_URL}
            width="97%"
            height="98%"
            />  
          )}
        </Flex>
        <Flex justifyContent={"center"} alignItems={"center"} p={"5%"}>
          <Stack spacing={10}>
            <Box>
              <Text fontSize={"xl"}>Not Surreal Raffle</Text>
              <Text fontSize={"4xl"} fontWeight={"bold"}>Buy a NossTicket to win the NFT PRIZE!</Text>
            </Box>
            <Text fontSize={"xl"}>Buy entries for a chance to win the NFT! The more entries the higher chance you have of winning the prize!</Text>
            <RaffleStatus raffleStatus={raffleStatus} />
            {!isLoadingEntryCost && (
              <Text fontSize={"2xl"} fontWeight={"bold"}>Cost per Entry: {entryCostInEther} MATIC</Text>
            )}
            {address ? (
              <Flex flexDirection={"row"}>
                <Flex flexDirection={"row"} w={"25%"} mr={"40px"}>
                  <Button
                    onClick={decreaseEntryAmount}
                  >-</Button>
                  <Input
                    type={"number"}
                    value={entryAmount}
                    onChange={(e) => setEntryAmount(parseInt(e.target.value))}
                    textAlign={"center"}
                    mx={2}
                  />
                  <Button
                    onClick={increaseEntryAmount}
                  >+</Button>
                </Flex>
                <Web3Button
                  contractAddress={RAFFLE_CONTRACT_ADDRESS}
                  action={(contract) => contract.call(
                    "buyEntry",
                    [
                      entryAmount
                    ],
                    {
                      value: ethers.utils.parseEther(entryCostOnSubmit.toString())
                    }
                  )}
                  isDisabled={!raffleStatus}
                >{`Buy Ticket(s)`}</Web3Button>
              </Flex> 
            ) : (
              <Text fontSize={"xl"}> Connect your wallet to buy Entries!</Text>
            )}
            
            {!isLoadingTotalEntries && (
              <Text>Total Entries: {totalEntries.toString()}</Text>
            )}
          </Stack>
        </Flex>
      </SimpleGrid>
      <Stack mt={"40px"} textAlign={"center"}>
              <Text fontSize={"xl"}>Current Raffle Entries:</Text>
              <CurrentEntries />

      </Stack>
    </Container>
  );
};    
export default Home;
