import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Image from "next/image";

import { ETHTickets__factory } from "blockchain";
import { config, isSupportedNetwork } from "../../lib/config";
import { useMetaMask } from "../../hooks/useMetaMask";

import { LoansOwnedView, Grid, SvgItem } from "../styledComponents/LoansOwned";

type NftData = {
  name: string;
  description: string;
  attributes: { trait_type: any; value: any }[];
  owner: string;
  image: string;
};

type LoanTicketFormatted = {
  tokenId: string;
  svgImage: string;
  loanType: { trait_type: any; value: any };
};

const LoansOwned = () => {
  const [loanCollection, setLoanCollection] = useState<LoanTicketFormatted[]>(
    []
  );
  const {
    state: { wallet: address, networkId },
  } = useMetaMask();

  useEffect(() => {
    if (typeof window !== "undefined" && address !== null) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const factory = new ETHTickets__factory(signer);

      if (!isSupportedNetwork(networkId)) {
        return;
      }

      const nftLoans = factory.attach(config[networkId].contractAddress);
      const loansRetrieved: LoanTicketFormatted[] = [];

      nftLoans.walletOfOwner(address).then((ownedLoans) => {
        const promises = ownedLoans.map(async (t) => {
          const currentTokenId = t.toString();
          const currentLoan = await nftLoans.tokenURI(currentTokenId);

          const base64ToString = window.atob(
            currentLoan.replace("data:application/json;base64,", "")
          );
          const nftData: NftData = JSON.parse(base64ToString);

          loansRetrieved.push({
            tokenId: currentTokenId,
            svgImage: nftData.image,
            loanType: nftData.attributes.find(
              (t) => t.trait_type === "Ticket Type"
            ),
          } as LoanTicketFormatted);
        });
        Promise.all(promises).then(() => setLoanCollection(loansRetrieved));
      });
    }
  }, [address, networkId]);

  let listOfLoans = loanCollection.map((loan) => (
    <SvgItem pad={4} key={`ticket${loan.tokenId}`}>
      <Image
        width={200}
        height={200}
        src={ticket.svgImage}
        alt={`Loan# ${loan.tokenId}`}
      />
    </SvgItem>
  ));

  return (
    <LoansOwnedView>
      <Grid columns={4} itemWidth={210} columnWidth={218}>
        {listOfLoans}
      </Grid>
    </LoansOwnedView>
  );
};

export default LoansOwned;
