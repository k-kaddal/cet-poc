import type { NextPage } from "next";
import Head from "next/head";

import Navigation from "../components/Navigation";
import Loans from "../components/loans/Loans";
import LoansOwned from "../components/loans/LoansOwned";

const Mint: NextPage = () => {
  const loans = [
    {
      type: "ga",
      event: "ETH Atlantis",
      description: "NFT Loan",
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
