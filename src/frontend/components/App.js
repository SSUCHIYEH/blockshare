import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate 
} from "react-router-dom";
import { FiClipboard } from "react-icons/fi";

import Navigation from './Navbar';
import Home from './Home.js'
import Create from './Create.js'
import Singup from "./Singup";
import Personal from "./Personal";
import MyListedItems from './MyListedItems.js'
import MyPurchases from './MyPurchases.js'
import Faucet from "./Faucet";

import AuthworkAbi from '../contractsData/Authwork.json'
import AuthworkAddress from '../contractsData/Authwork-address.json'
import NFTAbi from '../contractsData/NFT.json'
import NFTAddress from '../contractsData/NFT-address.json'
import PostworkAbi from '../contractsData/Postwork.json'
import PostworkAddress from '../contractsData/Postwork-address.json'
import NewTokenAbi from '../contractsData/NewToken.json'
import NewTokenAddress from '../contractsData/NewToken-address.json'

import { useEffect, useState } from 'react'
import { ethers } from "ethers"
import { Button, Modal, Overlay, Popover, Spinner } from 'react-bootstrap'
import './App.css';
import { useDispatch, useSelector } from "react-redux";
import { setAccountAsync, setAlready, setLikeAsync, setPostAsync } from "../reducer/slice";
import { setAuthworkAsync, setPostworkAsync, setNFTAsync } from "../reducer/contractSlice";

function App() {
  const [loading, setLoading] = useState(true)
  const [account, setAccount] = useState(null)
  const [signer, setSigner] =useState(null)
  const [nft, setNFT] = useState({})
  const [postwork, setPostwork] = useState({})
  const [authwork, setAuthwork] = useState({})
  const [newToken, setNewToken] = useState({})
  const [show,setShow] = useState(false)
  const [popOpen, setPopOpen] = useState(false)
  const [popTarget, setPopTarget] = useState(null)

  const dispatch = useDispatch()
  const {like,post,already} = useSelector((state)=>state.home)

  useEffect(()=>{
    web3Handler()
  },[])

  useEffect(()=>{
    if(signer!=null) loadContracts()
  },[signer])

  useEffect(()=>{
    if(like && post) setShow(true)
  },[like,post])

  // MetaMask Login/Connect
  const web3Handler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0])
    dispatch(setAccountAsync(accounts[0]))
    // Get provider from Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    // Set signer
    const signer = provider.getSigner()
    setSigner(signer)
    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    })

    window.ethereum.on('accountsChanged', async function (accounts) {
      setAccount(accounts[0])
      dispatch(setAccountAsync(accounts[0]))
      await web3Handler()
    })
  }

  const loadContracts = async () => {
    const authwork = new ethers.Contract(AuthworkAddress.address, AuthworkAbi.abi, signer)
    setAuthwork(authwork)
    const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer)
    setNFT(nft)
    const postwork = new ethers.Contract(PostworkAddress.address, PostworkAbi.abi, signer)
    setPostwork(postwork)

    const newToken = new ethers.Contract(NewTokenAddress.address, NewTokenAbi.abi, signer)
    setNewToken(newToken)
    setLoading(false)
  }

  const handleAirdrop = async ()=>{
    const resp = await newToken.transferFrom('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',account,1000000000)
    sessionStorage.setItem('already',true)
    dispatch(setAlready(true))
  }

  const handleAlready= async()=>{
    sessionStorage.setItem('post',false)
    sessionStorage.setItem('like',false)
    sessionStorage.setItem('already',false)
    setTimeout(()=>{
      console.log('sessionStorage post:   ',sessionStorage.getItem('post'))
    },500)
    
    setTimeout(()=>{
      dispatch(setPostAsync(null))
      dispatch(setLikeAsync(null))
      dispatch(setAlready(null))
      setShow(false)
    },1000)
  }

  const _handleCopy=(e)=>{
    navigator.clipboard.writeText(NewTokenAddress.address)
    setPopOpen(!popOpen)
    setPopTarget(e.target)
  }

  return (
    <BrowserRouter>
      <div className="App bg-white h-100vh">
        <>
          <Navigation web3Handler={web3Handler} account={account}/>
        </>
        <div>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
              <Spinner animation="border" style={{ display: 'flex' }} />
              <p className='mx-3 my-0'>Awaiting Metamask Connection...</p>
            </div>
          ) : (
              <>
                <Routes>
                  <Route path="/" element={
                    <Home postwork={postwork} nft={nft} authwork={authwork} newToken={newToken}/>
                  } />
                  <Route path="/create" element={
                    <Create authwork={authwork} nft={nft} postwork={postwork} />
                  } />
                  <Route path="/personal/:id" element={
                    <Personal postwork={postwork} nft={nft} authwork={authwork} newToken={newToken} />
                  } />
                  <Route path="/signup" element={
                    <Singup authwork={authwork} nft={nft} newToken={newToken} />
                  } />
                </Routes>
              </>
          )}
        </div>
        <Modal show={show} onHide={()=>{setShow(false)}}>
          <Modal.Header closeButton>
            <Modal.Title>{already ? "領取成功" : "空投來囉"}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            { already ? (
                <>
                  <p>Token 地址:</p>
                  <div className="d-flex">
                    {NewTokenAddress.address}
                    <Button onClick={_handleCopy} className='border-0 p-0 copy_btn bg-transparent'><FiClipboard className='text-primary'/></Button>
                  </div>
                  <div className="d-flex justify-content-end">
                    <Button onClick={handleAlready} className="bg-purple-blue-linear">確認</Button>
                  </div>
                  <Overlay
                    show={popOpen}
                    target={popTarget}
                    placement="top"
                    containerPadding={20}
                  >
                    <Popover id="popover-contained">
                      <Popover.Body>
                        複製成功
                      </Popover.Body>
                    </Popover>
                  </Overlay>
                </>
              ):
              (
                <>
                  <p>領取新用戶空投!</p>
                  <div className="d-flex justify-content-end">
                    <Button onClick={handleAirdrop} className="bg-purple-blue-linear">領取</Button>
                  </div>
                </>
              )
            }
            
          </Modal.Body>
        </Modal>
      </div>
    </BrowserRouter>
  );
}

export default App;
