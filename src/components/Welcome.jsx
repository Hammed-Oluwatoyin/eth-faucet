import React, {useCallback, useEffect, useState} from "react";
import { AiFillPlayCircle } from "react-icons/ai";
import { SiEthereum } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider"
import { loadContract } from "../utils/load-contract";



const companyCommonStyles = "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";

const shortenAddress = (address) => `${address.slice(0, 12)}...${address.slice(address.length - 12)}`;

const Input = ({ placeholder, name, type, value, handleChange }) => (
  <input
    placeholder={placeholder}
    type={type}
    step="0.0001"
    value={value}
    onChange={(e) => handleChange(e, name)}
    className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
  />
);

const Welcome = () => {
  const [web3Api, setWeb3Api] = useState({
      provider: null,
      isProviderLoaded: false, 
      web3: null,
      contract: null
  })

  const [account, setAccount] = useState(null)
  const [balance, setBalance]= useState(0)
  const [shouldReload, reload] = useState(false)
   const canConnectToContract = account && web3Api.contract

  const setAccountListener = (provider) => {
    provider.on("accountsChanged", _ =>  window.location.reload() /*(accounts) => setAccount(accounts[0])*/)
     provider.on("chainChanged", _ => window.location.reload())
  }
  const reloadEffect = useCallback(() => reload(!shouldReload), [shouldReload])





    useEffect(() => {
    const loadProvider = async () => {
     const provider = await detectEthereumProvider();
     
     if (provider) {
      const contract = await loadContract("Faucet", provider);
      setAccountListener(provider);
      setWeb3Api({
        web3: new Web3(provider),
        provider,
        contract,
        isProviderLoaded: true
      })
     } else {
      setWeb3Api(api => ({...api, isProviderLoaded: true}))
      console.error("please, install Metamask.")
     }  
    };
    loadProvider();
  }, []);


  useEffect(() => {
    const loadBalance = async () => {
      const {contract,web3 } = web3Api
      const balance = await web3.eth.getBalance(contract.address)
      setBalance(web3.utils.fromWei(balance, "ether"))
    }
    web3Api.contract && loadBalance()
  }, [web3Api, shouldReload])

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3Api.web3.eth.getAccounts()
      setAccount(accounts[0]);
    }
    web3Api.web3 && getAccount()
  }, [web3Api.web3])


  const addFunds = useCallback(async () => {
    const {contract, web3 } = web3Api
    await contract.addFunds({
      from: account,
      value: web3.utils.toWei("1", "ether")
    })
   // window.location.reload()
   reloadEffect()
  }, [web3Api, account, reloadEffect])

  const withdrawFunds = async () => {
    const {contract , web3 } = web3Api
    const withdrawAmount = web3.utils.toWei("0.1", "ether")
    console.log(withdrawAmount)
    await contract.withdraw(withdrawAmount, {
      from: account
    })
    reloadEffect();
  }

  return (
    <div className="flex w-full justify-center items-center">
      <div className="flex md:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
        <div className="flex flex-1 justify-start items-start flex-col mf:mr-10">
          <h1 className="text-3xl sm:text-5xl text-white text-gradient py-1">
            Send Crypto <br /> across the world
          </h1>
          <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
            Explore the crypto world. Buy and sell cryptocurrencies easily on Krypto.
          </p>
          <div>
              {web3Api.isProviderLoaded ? 
              <div>
                 {account ? 
                        <button type="button" className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]" >
                          <AiFillPlayCircle className="text-white mr-2" />
                            <p className="text-white text-base font-semibold">
                            Connected
                          </p>
                        </button> :
                      !web3Api.provider ?
                        <>
                          <div className="bg-[#eccc16] p-3 rounded-full text-base">
                            <strong>
                              Wallet is not detected!{` `}
                            </strong>
                            
                          <a
                            rel="noreferrer"
                            target="_blank"
                            href="https://docs.metamask.io">
                              Install Metamask
                          </a>
                    </div>
                  </>  : (<button
              type="button" 
             onClick={() =>
                      web3Api.provider.request({method: "eth_requestAccounts"}
                    )}
              className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
            >
              <AiFillPlayCircle className="text-white mr-2" />
              <p className="text-white text-base font-semibold">
                Connect Wallet
              </p>
            </button>)
        }</div>: <span className="bg-[#f7f7f6] mt-2 p-1 rounded-full"><strong>Looking for web3...</strong></span>}
          </div>
           { !canConnectToContract &&
            <i className="bg-[#f7f7f6] mt-2 p-1 rounded-full">
              Connect to Ganache
            </i>
          }
          <div className="grid sm:grid-cols-3 grid-cols-2 w-full mt-10">
            <div className={`rounded-tl-2xl ${companyCommonStyles}`}>
              Reliability
            </div>
            <div className={companyCommonStyles}>Security</div>
            <div className={`sm:rounded-tr-2xl ${companyCommonStyles}`}>
              Ethereum
            </div>
            <div className={`sm:rounded-bl-2xl ${companyCommonStyles}`}>
              Web 3.0
            </div>
            <div className={companyCommonStyles}>Low Fees</div>
            <div className={`rounded-br-2xl ${companyCommonStyles}`}>
              Blockchain
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
          <div className="p-3 flex justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5 eth-card .white-glassmorphism ">
            <div className="flex justify-between flex-col w-full h-full">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center">
                  <SiEthereum fontSize={21} color="#fff" />
                </div>
                <BsInfoCircle fontSize={17} color="#fff" />
              </div>
              <div>
                <p className="text-dark font-light text-lg">
                   <strong className="text-1xl">{account ? shortenAddress(account): "no connected address"}</strong>
                </p>
                <p className="text-white font-semibold text-lg mt-1">
                  Ethereum
                </p>
              </div>
            </div>
          </div>
          <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
            <div className="text-white   text-1xl text-bold">
              Current Balance ::: <strong className="text-2xl"> {balance} ETH</strong> 
                </div>
            <Input placeholder="Amount (ETH)" name="amount" type="number"  />
            <div className="h-[1px] w-full bg-gray-400 my-2" />         
                <button
                  disabled={!canConnectToContract}
                  type="button"
                onClick ={addFunds}
                  className="bg-pink-300  text-dark  mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
                >
                  Donate 1 Eth Now
                </button>
                  <button
                   disabled={!canConnectToContract}
                  type="button"
                   onClick={withdrawFunds}
                  className="text-dark bg-pink-300 mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
                >
                  Withdraw 0.1Eth
                </button>   
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
