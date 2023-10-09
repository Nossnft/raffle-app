import { useContract, useContractRead } from "@thirdweb-dev/react";
import { RAFFLE_CONTRACT_ADDRESS } from "../const/addresses";

type Props = {
  walletAddress: string;
};

export default function EntryCard({ walletAddress}: Props) {
  const {
   contract
} = useContract(RAFFLE_CONTRACT_ADDRESS);

  const {
    data: numberOfEntries,
    isLoading: isLoadingNumberOfEntries
  } = useContractRead(contract, "entryCount", [walletAddress]);
  }