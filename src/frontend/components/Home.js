import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card, Button, Container, Form, Modal} from 'react-bootstrap'
import { BsFillPlusSquareFill } from 'react-icons/bs'
import { Alchemy, Network } from "alchemy-sdk";
import PostItem from './PostItem';
import { useSelector, useDispatch } from 'react-redux'
import client from '../util/client';
import { setFirstAsync, setImageAsync, setNameAsync, setPostAsync } from '../reducer/slice';
import { useNavigate } from 'react-router';
import { authValid, getAuthData, getAuthRecord, getAuthURL, getFollow } from '../util/authApi';
import { getPostRecord } from '../util/postApi';

const Home = ({ postwork, authwork, nft, newToken }) => {
  const [posts, setPosts] = useState([])
  const [follows, setFollows] = useState([])
  const [items, setItems] = useState([])
  const [member, setMember] = useState(false)
  const [content, setContent] = useState(null)
  const [searchUser, setSearchUser] = useState([])
  const [actives,setActives]=useState([])
  const [video, setVideo] = useState(null)
  const [show, setShow] = useState(true)

  const {account, search, first} = useSelector((state) =>  state.home)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const checkHasNFT = async() => {
    const results = await authValid(authwork,nft,account)
    if(results.length > 0) {
      const uri = await getAuthURL(authwork,nft,account)
      const metadata = await getAuthData(uri)
      dispatch(setNameAsync(metadata.name))
      dispatch(setImageAsync(metadata.image))
      loadPostItem()
    }else {
      navigate('/signup');
    }
  }

  const loadPostItem = async () => {
    const itemCount = await postwork.itemCount()
    let items = []
    for (let i = 1; i <= itemCount; i++) {
      const item = await postwork.items(i)
      if (!item.sold) {
        items.push({
          tokenId: item.tokenId,
          itemId: item.itemId,
          seller: item.seller,
          address: item.nft 
        })
      }
    }
    setItems(items)
    const filter =  postwork.filters.Posted(null,null,null,null)
    const results = await postwork.queryFilter(filter)
    setPosts(results)
  }

  const newPost = async (uri) => {
    await(await nft.mint(uri)).wait()
    const id = await nft.tokenCount()
    await(await postwork.postItem(member,nft.address, id)).wait()
    // await (await nft.setTokenURL(uri,items[0].tokenId)).wait()
    // await (await postwork.postItem(items[0].itemId)).wait()
    setContent(null)
    setVideo(null)
    loadPostItem()
    sessionStorage.setItem('post',true)
    dispatch(setPostAsync(true))
  }

  const uploadToIPFS = async (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    if (typeof file !== 'undefined') {
      try {
        const result = await client.add(file)
        setVideo(`https://nft-login.infura-ipfs.io/ipfs/${result.path}`)
      } catch (error){
        console.log("ipfs image upload error: ", error)
      }
    }
  }

  const addIpfs = async () => {
    if (!content || !video ) return
    try{
      const result = await client.add(JSON.stringify({video,content}))
      const uri = `https://nft-login.infura-ipfs.io/ipfs/${result.path}`
      newPost(uri)
    } catch(error) {
      console.log("ipfs uri upload error: ", error)
    }
  }

  const loadUsers = async() => {
    const filter = authwork.filters.Register(null,null,null,null)
    const results = await authwork.queryFilter(filter)
    let users = []
    if(results.length > 0){
      for (let i = 0; i < results.length; i++){
        const uri = await nft.tokenURI(results[i].args.tokenId)
        if (uri != "https://ipfs.infura.io/ipfs"){
          const response = await fetch(uri)
          const metadata = await response.json()
          if(metadata.name.includes(search)){
            users.push({
              name: metadata.name,
              image: metadata.image
            })
          }
        }
      }
      setSearchUser(users)
    }
  }

  const handlGetFollow = async() => {
    const follow = await getFollow(authwork,nft,account);
    setFollows(follow)
  }

  const handleGetAuthReord = async() => {
    const reps = await getAuthRecord(authwork,nft,account)
    const resp = await getPostRecord(postwork,authwork,nft,account)

    setActives(reps.concat(resp))
  }

  useEffect(() => {
    if(account!=''){
      checkHasNFT()
      handlGetFollow()
      handleGetAuthReord()
    }
  }, [account])

  useEffect(()=>{
    if(search != "") loadUsers()
  },[search])

  useEffect(()=>{
    if(first) setShow(false)
    else setShow(true)
  },[first])

  const handleHide = () => {
    sessionStorage.setItem('first',true)
    dispatch(setFirstAsync(true))
  }

  return (
    <Container fluid className="min-vh-100 p-3 pt-5">
      <Row>
        <Col>
          <div className="bg-purple-100 rounded p-4 shadow-md">
            <div className='mx-auto text-start'>
              <h5>動態</h5>
              {
                actives.map((a)=>(
                  <div className="active_content mt-3" key={a.trigger+a.event}>
                    <img alt="" src={a.image} className='active_img rounded-circle'/>
                    <span className='ms-3'>{a.trigger} {a.event}</span>
                  </div>
                ))
              }
            </div>
          </div>
        </Col>
        { search == "" ? 
          <Col lg="5">
            <div className="rounded p-4 mb-4 bg-purple-100 shadow-md">
              { video ?  
                <iframe src={video} title="" height="240px" className='w-100'></iframe>
                : (
                  <div className='d-flex '>
                    <input type="file" required id="video" onChange={uploadToIPFS} className="d-none"/>
                    <label htmlFor="video" className='text-primary cursor-pointer'>
                      <BsFillPlusSquareFill className='me-3 text-primary'/>
                      尚未選取影片
                    </label>
                  </div>
                )
              }
              <textarea 
                className='w-100 border-0 mt-3 text-black bg-transparent'
                onChange={(e) => setContent(e.target.value)} />
              <div className='d-flex justify-content-between mt-3'>
                <Button
                  variant={member ?"primary" : "outline-primary"}
                  onClick={()=>{setMember(!member)}}>
                  會員
                </Button>
                <Button onClick={() => addIpfs()} variant='primary' className="text-white fw-bold bg-purple-blue-linear">分享</Button>
              </div>
            </div>
            { posts.map((post)=>(
              <PostItem nft={nft} args={post.args} key={post.args.tokenId} authwork={authwork} postwork={postwork} newToken={newToken}/>
            )) }

        </Col>
        : 
          <Col lg="5">
            { searchUser.map((u)=>(
              <div className='bg-purple-100 rounded p-4 shadow-md mb-4'>
                <img alt="" src={u.image} className='follow_img rounded-circle'/>
                <span className='ms-3'>{u.name}</span>
              </div>
            )) }
          </Col>
        }
        
        <Col>
          <div className="bg-purple-100 rounded p-4 shadow-md text-start text-dark">
            <h5 className='text-dark fw-bold'>追蹤</h5>
            {
              follows.map((f)=>(
                <div className='mt-4' key={f.name}>
                  <img alt="" src={f.image} className='follow_img rounded-circle'/>
                  <span className='ms-3'>{f.name}</span>
                </div>
              ))
            }
          </div>
        </Col>
      </Row>
      <Modal show={show} onHide={()=>{handleHide()}}>
        <Modal.Header closeButton>
          <Modal.Title>歡迎加入</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>發布你的第一個貼文，並按讚支持他人的貼文獲取新用戶空投!</p>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
export default Home