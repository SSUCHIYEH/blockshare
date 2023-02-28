import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Navigation from './Navbar';
import Home from './Home.js'
import Create from './Create.js'
import Singup from "./Singup";
import Login  from "./Login";
import MyListedItems from './MyListedItems.js'
import MyPurchases from './MyPurchases.js'

import AuthworkAbi from '../contractsData/Authwork.json'
import AuthworkAddress from '../contractsData/Authwork-address.json'
import NFTAbi from '../contractsData/NFT.json'
import NFTAddress from '../contractsData/NFT-address.json'
import PostworkAbi from '../contractsData/Postwork.json'
import PostworkAddress from '../contractsData/Postwork-address.json'

import { useState } from 'react'
import { ethers } from "ethers"
import { Spinner } from 'react-bootstrap'
import './App.css';

function App() {
  const [loading, setLoading] = useState(true)
  const [account, setAccount] = useState(null)
  const [nft, setNFT] = useState({})
  const [postwork, setPostwork] = useState({})
  const [authwork, setAuthwork] = useState({})
  const [hasNFT, setHasNFT] = useState(false)
  const [name, setName] = useState("")
  const [image, setImage] = useState("")

  // MetaMask Login/Connect
  const web3Handler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0])
    // Get provider from Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    // Set signer
    const signer = provider.getSigner()

    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    })

    window.ethereum.on('accountsChanged', async function (accounts) {
      setAccount(accounts[0])
      await web3Handler()
    })
    loadContracts(signer,accounts[0])
  }
  const loadContracts = async (signer,acco) => {
    // Get deployed copies of contracts
    const authwork = new ethers.Contract(AuthworkAddress.address, AuthworkAbi.abi, signer)
    setAuthwork(authwork)
    const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer)
    setNFT(nft)
    const postwork = new ethers.Contract(PostworkAddress.address, PostworkAbi.abi, signer)
    setPostwork(postwork)

    checkHasNFT(authwork,acco,nft)
  }

  const checkHasNFT = async(authwork,acco,nft) => {
    const filter =  authwork.filters.Register(null,null,null,acco)
    const results = await authwork.queryFilter(filter)
    console.log(results)
    if(results.length > 0){
      const authNFT = await nft.tokenURI(results[0].args.tokenId)
      console.log(authNFT)
      const response = await fetch(authNFT)
      const metadata = await response.json()
      setName(metadata.name)
      setImage(metadata.image)
      setHasNFT(true)
    }
    setLoading(false)
  }

  return (
    <BrowserRouter>
      <div className="App">
        <>
          <Navigation web3Handler={web3Handler} account={account} name={name} image={image}/>
        </>
        <div>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
              <Spinner animation="border" style={{ display: 'flex' }} />
              <p className='mx-3 my-0'>Awaiting Metamask Connection...</p>
            </div>
          ) : (
              <>
                { hasNFT ? (
                  <Routes>
                    <Route path="/" element={
                      <Home postwork={postwork} account={account} authwork={authwork} />
                    } />
                    <Route path="/create" element={
                      <Create authwork={authwork} nft={nft} postwork={postwork} />
                    } />
                  </Routes>
                ) : (
                  <Routes>
                    <Route path="/create" element={
                      <Create authwork={authwork} nft={nft} postwork={postwork} />
                    } />
                    <Route path="/signup" element={
                      <Singup authwork={authwork} nft={nft} />
                    } />
                  </Routes>
                ) }
              </>
          )}
        </div>
      </div>
    </BrowserRouter>

  );
}

export default App;
