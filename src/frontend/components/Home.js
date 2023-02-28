import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card, Button, Container, Form } from 'react-bootstrap'
import { Alchemy, Network } from "alchemy-sdk";
import PostItem from './PostItem';

const Home = ({ postwork, marketplace }) => {
  const [posts, setPosts] = useState([])
  const [items, setItems] = useState([])
  const [content, setContent] = useState(null)
  const loadPostItem = async () => {
    const itemCount = await postwork.itemCount()
    let items = []
    for (let i = 1; i <= itemCount; i++) {
      const item = await postwork.items(i)
      if (!item.sold) {
        items.push({
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

  const newPost = async () => {
    await (await postwork.postItem(content, items[0].itemId)).wait()
  }

  useEffect(() => {
    loadPostItem()
  }, [])

  return (
    <Container fluid className="min-vh-100 bg-light p-3 pt-5">
      <Row>
        <Col>
          <div className="bg-white rounded p-4 shadow-sm">
            <div className='mx-auto text-start'>
              <h5>Active</h5>
              <div className="active_content mt-3">
                <img alt="" src="/images\headphoto.png" className='active_img'/>
                <span className='ms-3'>andy追蹤了你</span>
                <span className='ms-1'>10mins</span>
              </div>
              <div className="active_content mt-3">
                <img alt="" src="/images\headphoto.png" className='active_img'/>
                <span className='ms-3'>andy說你的貼文讚</span>
                <span className='ms-1'>10mins</span>
              </div>
              <div className="active_content mt-3">
                <img alt="" src="/images\headphoto.png" className='active_img'/>
                <span className='ms-3'>andy說你的貼文讚</span>
                <span className='ms-1'>10mins</span>
              </div>
            </div>
          </div>
        </Col>
        <Col lg="6">
          <div className="bg-white rounded p-4 shadow-sm mb-4 text-end">
            <textarea 
              className='w-100 border-0'
              onChange={(e) => setContent(e.target.value)} />
            <Button onClick={() => newPost()} variant='primary' className="text-white fw-bold">share{items.length}</Button>
          </div>
            { posts.map((post)=>(
              <PostItem args={post.args} marketplace={marketplace} postwork={postwork}/>
            )) }
        </Col>
        <Col>
        <div className="bg-white rounded p-4 shadow-sm text-start text-dark">
          <h5 className='text-dark fw-bold'>Follow</h5>
          <div className='mt-4'>
            <img alt="" src="/images\headphoto.png" className='follow_img'/>
            <span className='ms-3'>Andy</span>
          </div>
          <div className='mt-4'>
            <img alt="" src="/images\headphoto.png" className='follow_img'/>
            <span className='ms-3'>Cana</span>
          </div>
        </div>
        </Col>
      </Row>
    </Container>
  );
}
export default Home