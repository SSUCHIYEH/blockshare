import { useState, useEffect } from 'react';
import { setImageAsync, setNameAsync } from '../reducer/slice';
import { useNavigate } from 'react-router';
import { authValid, getAuthData, getAuthURL, getFollow } from '../util/authApi';

import { Row, Col, Card, Button, Container, Form } from 'react-bootstrap'

import PostItem from './PostItem';
import { useSelector, useDispatch } from 'react-redux'
import client from '../util/client';
import { useParams } from 'react-router';
import { getFans } from '../util/authApi';
import { checkMember } from '../util/postApi';

const Personal = ({postwork, authwork, nft,newToken}) => {
  const [posts, setPosts] = useState([])
  const [follow, setFollow] = useState(false)
  const [member, setMember] = useState(false)
  const [fans,setFans] = useState([])
  const [name, setName] = useState("")
  const [image, setImage] = useState("")
  const {id} = useParams();
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const account = useSelector((state) =>  state.home.account)

  const loadMyPost = async () => {
    const uri = await getAuthURL(authwork,nft,id)
    const metadata = await getAuthData(uri)
    setName(metadata.name)
    setImage(metadata.image)

    const filter =  postwork.filters.Posted(null,null,null,id)
    const results = await postwork.queryFilter(filter)
    setPosts(results)
  }
  
  const checkFollow = async () => {
    const filter =  authwork.filters.Follow(account,id)
    const results = await authwork.queryFilter(filter)
    if(results.length > 0) {
      setFollow(true)
    }
  }

  const checkIfMember = async() => {
    const resp =  await checkMember(authwork,id,account)
    setMember(resp)
  }

  const handleFollow = async() => {
    await(await authwork.FollowAuth(id)).wait()
    checkFollow()
  }

  const handleMember = async() => {
    const resp = await newToken.transfer(id,700000)
    await(await authwork.Subscribe(id)).wait()
    await checkIfMember()
  }

  const handleGetFans = async() => {
    const fan = await getFans(authwork,nft,id)
    setFans(fan)
  }

  const checkHasNFT = async() => {
    const results = await authValid(authwork,nft,account)
    if(results.length > 0) {
      const uri = await getAuthURL(authwork,nft,account)
      const metadata = await getAuthData(uri)
      dispatch(setNameAsync(metadata.name))
      dispatch(setImageAsync(metadata.image))
    }
  }

  useEffect(() => {
    if(id != "") {
      loadMyPost()
    }
    if(account != "") {
      checkHasNFT()
      checkFollow()
      handleGetFans()
      checkIfMember()
    }
  }, [id,account])

  return (
    <Container className="min-vh-100 p-3 pt-5">
      <Row>
        <Col>
          <div className="bg-white rounded p-3 shadow-sm">
            <div className="bg_personal text-start bg-white rounded">
              <div className="bg_yellow h-75 d-flex align-items-end justify-content-end rounded">
                <small className='text-white me-5'>{name}</small>
                <div className="head_photo">
                  <img alt="" src={image} className='w-100 h-100 rounded-circle border border-5 border-white'/>
                </div>
              </div>
              { account.toUpperCase() == id.toUpperCase() ? <></>
                :
                <div className='personal_btn pt-2'>
                  <Button className='me-2' size="sm" variant={follow ? 'secondary':'outline-secondary'} onClick={handleFollow}>{follow ? "已追蹤" : "追蹤"}</Button>
                  <Button size="sm" variant={member ? 'secondary':'outline-secondary'} onClick={handleMember}>{member ? "已訂閱" : "訂閱"}</Button>
                </div>
              }
            </div>
            <div className='mt-5 text-start'>
              <h5>Achivement</h5>
              <img alt="" src="/images\headphoto.png" className='active_img'/>
            </div>
          </div>
        </Col>
        <Col lg="6">
          
          { posts.map((post)=>(
              <PostItem args={post.args} authwork={authwork} postwork={postwork} nft={nft} key={post.args.tokenId}/>
          ))}
          
        </Col>
        <Col>
          <div className="rounded-3 p-4 shadow-md text-start text-dark bg-purple-100">
            <h5 className='text-dark fw-bold'>Fans</h5>
            {
              fans.map((f)=>(
                <div className='mt-4'>
                  <img alt="" src={f.image} className='follow_img rounded-3'/>
                  <span className='ms-3'>{f.name}</span>
                </div>
              ))
            }
          </div>
        </Col>
      </Row>
    </Container>
  );
}
export default Personal;