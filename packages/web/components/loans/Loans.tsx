import { useState } from "react";
import { useRouter } from "next/router";
import { useMetaMask } from "../../hooks/useMetaMask";
import { ETHTickets__factory } from "blockchain";
import { ethers } from "ethers";
import { config, isSupportedNetwork } from "../../lib/config";

import { SiEthereum } from "react-icons/si";

import { Button, FlexContainer, FlexItem } from "../styledComponents/general";
import {
  HeadingText,
  LoansView,
  LoanType,
  LoanTypeText,
  StyledAlert,
} from "../styledComponents/loans";

interface Loan {
  type: string;
  event: string;
  description: string;
  price: string;
  priceHexValue: string;
  dueDate: string;
}
interface LoansProps {
  loans: Loan[];
}

const LoanTypes: React.FC<Loan> = ({
  type,
  event,
  description,
  price,
  priceHexValue,
  dueDate,
}) => {
  const {
    state: { wallet },
  } = useMetaMask();
  const router = useRouter();
  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userDueDate, setUserDueDate] = useState("");
  const [userAmount, setUserAmount] = useState("");

  const mintLoan = async () => {
    setIsMinting(true);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const factory = new ETHTickets__factory(signer);
    const networkId = process.env.NEXT_PUBLIC_NETWORK_ID;

    if (!isSupportedNetwork(networkId)) {
      throw new Error(
        "Set either `0x5` for goerli or `0x13881` for mumbai in apps/web/.env or .env.local"
      );
    }

    const nftLoans = factory.attach(config[networkId].contractAddress);

    nftLoans
      .mintLoan({
        from: wallet!,
        value: priceHexValue,
      })
      .then(async (tx: any) => {
        console.log("minting accepted");
        await tx.wait(1);
        console.log(`Minting complete, mined: ${tx}`);
        setIsMinting(false);
        router.reload();
      })
      .catch((error: any) => {
        console.log(error);
        setError(true);
        setErrorMessage(error?.message);
        setIsMinting(false);
      });
  };

  const cantMint = !Boolean(wallet) && !isMinting;

  return (
    <FlexItem>
      <LoanType>
        <LoanTypeText>Mint a Loan</LoanTypeText>
        <div>
          {/* Input fields for due date and amount */}
          <input
            type="text"
            placeholder="Enter Due Date"
            value={userDueDate}
            onChange={(e) => setUserDueDate(e.target.value)}
          />
          <div>
            <input
              type="text"
              placeholder="Enter Amount in ETH"
              value={userAmount}
              onChange={(e) => setUserAmount(e.target.value)}
            />
          </div>
        </div>

        <Button disabled={cantMint} onClick={mintLoan}>
          <SiEthereum /> {isMinting ? "Minting..." : "Mint"}
        </Button>
        {error && (
          <StyledAlert onClick={() => setError(false)}>
            <span>
              <strong>Error:</strong> {errorMessage}
            </span>
          </StyledAlert>
        )}
      </LoanType>
    </FlexItem>
  );
};

const Loans = ({ loans }: LoansProps) => {
  return (
    <LoansView>
      <HeadingText>Loan Types</HeadingText>
      <p style={{ color: "white" }}>
        Enter the required amount of Eth to borrow, due date to repay
      </p>
      <FlexContainer gap={1}>
        {loans.map((loan) => (
          <LoanTypes key={loan.type} {...loan} />
        ))}
      </FlexContainer>
    </LoansView>
  );
};

export default Loans;
