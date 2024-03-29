import {config}  from '../dapp.config'
const { createAlchemyWeb3 } = require('@alch/alchemy-web3')
const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')
const whitelist = require('./whitelist.js')
// global BigInt

const web3 = createAlchemyWeb3(process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL)
const contract = require('../artifacts/contracts/contract.json')
const nftContract = new web3.eth.Contract(contract.abi, config.contractAddress)


// Calculate merkle root from the whitelist array
const leafNodes = whitelist.map((addr) => keccak256(addr))
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true })
const root = merkleTree.getRoot()


// get PORK token balance of user

const token = require('../artifacts/contracts/token.json')  //replace the correct contract ABI in token.json
const tokenContract = new web3.eth.Contract(token.abi, config.contractAddress)

const getBlanace = async () => {
  const balance = await tokenContract.methods.balaceOf(window.ethereum.selectedAddress).call()
  return balance
}


//  get current state functions-------------------------------------->

export const getMaxSupply = async () => {
  const limit = await nftContract.methods.maxSupply().call()
  return limit
}

export const getTotalSupply = async () => {
  const limit = await nftContract.methods.totalSupply().call()
  return limit
}


export const getMintPrice = async() => {
  const price = await nftContract.methods.cost().call()
  return price
}

export const isInWhiteListMint = async() => {
  const state = await nftContract.methods.whitelistMintEnabled().call()
  return state
}



  
//Set up Public Mint ------------------------------------------------------------------------------------>

export const PublicMint = async (mintAmount) => {
  if (!window.ethereum.selectedAddress) {
    return {
      success: false,
      status: 'To be able to mint, you need to connect your wallet'
    }
  }


  const mintingAmount = Number(mintAmount)

  let maxLimitperTx = Number(await nftContract.methods.maxMintAmountPerTx().call())

  if (maxLimitperTx < mintAmount) {
    return {
      success: false,
      status: (
        'Exceeded max mint per Transaction.'
      )
    }
  }

  //function for check if user have enough tokens to mint

  // Remove above comment later --------------------------------------

  // const requiredTokens = await nftContract.methods.getRequiredTokenBalanceForMinting(mintAmount).call();
  // tokenBalance = getBlanace();

  // if(requiredTokens < tokenBalance) {

  //   return {
  //     success: false,
  //     status: (
  //       'You dont Have enough PORK tokens to mint.'
  //     )
  //   }

  // }

  const nonce = await web3.eth.getTransactionCount(
    window.ethereum.selectedAddress,
    'latest'
  )
 

  // Set up our Ethereum transaction

  const tx = {
    to: config.contractAddress,
    from: window.ethereum.selectedAddress,
    gas: String(25000 * mintingAmount),
    data: nftContract.methods
      .mint(mintAmount)
      .encodeABI(),
    nonce: nonce.toString(16)
  }

  try {
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [tx]
    })

    return {
      success: true,
      status: (
        <a href={`https://basescan.io/tx/${txHash}`} target="_blank">
          <p>✅ Check out your transaction on Basescan ✅</p>
        </a>
      )
    }
  } catch (error) {
    return {
      success: false,
      status: '😞 Ooops!:' + error.message
    }
  }
}

//Set up whitelist mint------------------------------------------------------------------------------------>

export const WhitelistMint = async (mintAmount) => {
  if (!window.ethereum.selectedAddress) {
    return {
      success: false,
      status: 'To be able to mint, you need to connect your wallet'
    }
  }

  const leaf = keccak256(window.ethereum.selectedAddress)
  const proof = merkleTree.getHexProof(leaf)

  // Verify Merkle Proof
  const isValid = merkleTree.verify(proof, leaf, root)

  if (!isValid) { 
    return {
      success: false,
      status: '❌ Invalid Merkle Proof - You are not whitelisted'
    }
  }
  
  let alreadyCalimed = await nftContract.methods.whitelistClaimed(window.ethereum.selectedAddress).call()

  if (alreadyCalimed) {
    return {
      success: false,
      status: (
        'You have already clamied in whitelisted mint.'
      )
    }
  }

  let maxLimitperTx = Number(await nftContract.methods.maxMintAmountPerTx().call())

  if (maxLimitperTx < mintAmount) {
    return {
      success: false,
      status: (
        'Exceeded max mint per Transaction.'
      )
    }
  }

  // Remove above comment later --------------------------------------

  // const requiredTokens = await nftContract.methods.getRequiredTokenBalanceForMinting(mintAmount).call();
  // tokenBalance = getBlanace();

  // if(requiredTokens < tokenBalance) {

  //   return {
  //     success: false,
  //     status: (
  //       'You dont Have enough PORK tokens to mint.'
  //     )
  //   }

  // }

  const nonce = await web3.eth.getTransactionCount(
    window.ethereum.selectedAddress,
    'latest'
  )

  // Set up our Ethereum transaction

  const tx = {
    to: config.contractAddress,
    from: window.ethereum.selectedAddress,
    gas: String(25000 * mintAmount),
    data: nftContract.methods
      .whitelistMint(mintAmount, proof)
      .encodeABI(),
    nonce: nonce.toString(16)
  }

  try {
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [tx]
    })

    return {
      success: true,
      status: (
        <a href={`https://basescan.io/tx/${txHash}`} target="_blank">
          <p>✅ Check out your transaction on Basescan ✅</p>
        </a>
      )
    }
  } catch (error) {
    return {
      success: false,
      status: '😞 Smth went wrong:' + error.message
    }
  }
}
