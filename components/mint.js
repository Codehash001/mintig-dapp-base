import Image from "next/image";
import { useState, useEffect } from "react";
import { Link } from "react-scroll/modules";
import "@rainbow-me/rainbowkit/styles.css";

import {
  PublicMint,
  WhitelistMint,
  isInWhiteListMint,
  getMaxSupply,
  getTotalSupply,
  getMintPrice,
} from "../ulits/interact";
import { config } from "../dapp.config";
import {
  ConnectWallet,
  useAddress,
  useContractRead,
  useContract,
} from "@thirdweb-dev/react";

// BigInt
export default function Mint() {
  const address = useAddress();

  const { contract } = useContract(config.tokenContractAddress);
  const { data, isLoading, error } = useContractRead(
    contract,
    "balanceOf",
    address
  );

  console.log("token contract data is", data);

  const [isWlState, setIsWlState] = useState(false);

  const [maxsupply, setMaxSupply] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);

  const [status, setStatus] = useState("");
  const [success, setSuccess] = useState(false);

  const [mintAmount, setMintAmount] = useState(1);
  const [isMinting, setIsMinting] = useState(false);
  const [mintPrice, setMintPrice] = useState(null);
  const [cost, setCost] = useState(0);
  const [maxMintAmount, setMaxMintAmount] = useState(0);
  const [isWalletAddress, setIsWalletAddress] = useState(false);

  useEffect(() => {
    const init = async () => {
      setMaxSupply(await getMaxSupply());
      setTotalSupply(await getTotalSupply());
      const weiPrice = await getMintPrice();
      setMintPrice(weiPrice / 1000000000000000000);
      setIsWlState(await isInWhiteListMint());
    };

    init();
  }, []);

  const publicMintHandler = async () => {
    setStatus("");
    setSuccess(null);
    setIsMinting(true);

    const { success, status } = await PublicMint(mintAmount);

    setStatus(status);
    setSuccess(success);

    setIsMinting(false);
  };


  const whitelistMindHnadler = async () => {
    setStatus("");
    setSuccess(null);
    setIsMinting(true);

    const { success, status } = await WhitelistMint(mintAmount);

    setStatus(status);
    setSuccess(success);

    setIsMinting(false);
  };

  const incrementMintAmount = () => {
    setMintAmount(mintAmount + 1);
  };

  const decrementMintAmount = () => {
    if (mintAmount > 1) {
      setMintAmount(mintAmount - 1);
    }
  };


  return (
    <>
      <div className="font-mono backdrop-filter md:backdrop-blur-md backdrop-blur-sm border-2 border-gray-100 rounded-lg text-white max-w-7xl text-xl">
        <div className="w-auto h-auto p-8 flex flex-col justify-center items-center relative ">
          <div className="text-2xl">{isWlState? 'Whitelisted Mint' : 'Minting is Live!'}</div>

          <div className="w-full flex justify-between border rounded-md py-3 px-5 mt-5 filter drop-shadow-lg space-x-10">
            <p>Available for mint</p>
            <p className="font-bold">-</p>
            <div className="flex items-center space-x-3">
              <p>
                {totalSupply} out of {maxsupply} minted so far
              </p>
            </div>
          </div>

          <div className="w-full flex justify-between border rounded-md py-3 px-5 mt-5 filter drop-shadow-lg">
            <p>Total</p>
            <div className="flex items-center space-x-3">
              <p>0 ETH</p>
              <p>+ GAS</p>
            </div>
          </div>

          <div className="w-full h-full flex items-center justify-center rounded-md border mt-2 filter drop-shadow-lg mb-4">
            <div
              className="px-5 py-3 border-r cursor-pointer w-full flex justify-center"
              onClick={decrementMintAmount}
            >
              <svg
                className="hover:scale-110"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="#fff"
              >
                <path d="M5 11h14v2H5z"></path>
              </svg>
            </div>

            <div className="py-3 md:px-20 px-6 border-r w-full flex justify-center">
              <h1 className="text-lg"> {mintAmount} </h1>
            </div>

            <div
              className="px-5  py-3 cursor-pointer w-full flex justify-center"
              onClick={incrementMintAmount}
            >
              <svg
                className="hover:scale-110"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="#fff"
              >
                <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path>
              </svg>
            </div>
          </div>

          <div className="w-full flex justify-between border filter drop-shadow-lg">
            {address && !isWlState? (
              <button
                className="px-10 py-3 bg-white text-black font-semibold hover:text-bold  w-full"
                onClick={publicMintHandler}
              >
                {" "}
                {isMinting ? 'Minting...' : 'Mint'}
              </button>
            ):
            address && isWlState? (
              <button
                className="px-10 py-3 bg-white text-black font-semibold hover:text-bold  w-full"
                onClick={whitelistMindHnadler}
              >
                {" "}
                {isMinting ? 'Minting...' : 'Mint'}
              </button>
            ) : (
              <button className="px-10 py-3 bg-gray-700/60 text-white font-semibold cursor-not-allowed w-full">
                {" "}
                Connect wallet to mint
              </button>
            )}
          </div>

          {status && success ? (
            <div className="text-sm p-4 rounded-md mt-4 text-green-400">
              {status}
            </div>
          ) : status && !success ? (
            <div className="text-sm p-4 rounded-md mt-4 text-red-400">
              {status}
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
}
