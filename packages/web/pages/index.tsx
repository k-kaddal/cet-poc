import type { NextPage } from "next";
import Head from "next/head";

import Navigation from "../components/Navigation";
import Loans from "../components/loans/Loans";
import LoansOwned from "../components/loans/LoansOwned";
import { ethers } from "ethers";

const Mint: NextPage = () => {
  const bigNumberify = (amt: string) => ethers.utils.parseEther(amt);

  const ethGa = "0.01";
  const ethVip = "0.02";
  const ethGaHex = bigNumberify(ethGa)._hex;
  // // const ethVipHex = bigNumberify(ethVip)._hex;

  const loans = [
    {
      type: "ga",
      event: "ETH Atlantis",
      description: "NFT Loan",
      price: "0.1",
      dueDate: "2 Months",
      priceHexValue: ethGaHex, // '0x2386f26fc10000' *eserialize.com
    },
  ];

  return (
    <div className="mint-tickets">
      <Head>
        <title>Loan dApp</title>
        <meta
          property="og:title"
          content="The largest underwater Ethereum event in history"
          key="title"
        />
      </Head>
      <Navigation />
      <Loans loans={loans} />
      {/* <LoansOwned /> */}
    </div>
  );
};

export default Mint;
