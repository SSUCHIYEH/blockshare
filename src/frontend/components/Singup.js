import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Container,Col,Row, Button, Form } from 'react-bootstrap'
import { create } from 'ipfs-http-client'
import {Buffer} from 'buffer'
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router'

const projectId = '2L5kc3U7jOUe0kv4NwoxM5L1NAJ';
const projectSecret = '4303a8c9f253bd5e42c871708ff5fc31';
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  apiPath: '/api/v0',
  headers: {
    authorization: auth
  }
});

const Singup = ({ authwork, nft, newToken }) => {
  const account = useSelector((state) =>  state.home.account)
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [name, setName] = useState('')
  const [image, setImage] = useState(null)

  const uploadToIPFS = async (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    if (typeof file !== 'undefined') {
      try {
        const result = await client.add(file)
        setImage(`https://nft-login.infura-ipfs.io/ipfs/${result.path}`)
      } catch (error){
        console.log("ipfs image upload error: ", error)
      }
    }
  }


  const loadMarketplaceItems = async () => {
    // Load all unsold items
    const itemCount = await authwork.itemCount()
    let items = []
    for (let i = 1; i <= itemCount; i++) {
      const item = await authwork.items(i)
      if (!item.sold) {
        // Add item to items array
        items.push({
          tokenId: item.tokenId,
          itemId: item.itemId,
          address: item.nft
        })
      }
    }
    setLoading(false)
    setItems(items)
  }

  const addIpfs = async () => {
    if (!image ||!name ) return
    try{
      const result = await client.add(JSON.stringify({image, name}))
      const uri = `https://nft-login.infura-ipfs.io/ipfs/${result.path}`
      registerItem(uri)
    } catch(error) {
      console.log("ipfs uri upload error: ", error)
    }
  }
  const registerItem = async (uri) => {
    await (await nft.setTokenURL(uri,items[0].tokenId)).wait()
    await (await authwork.RegisterItem(items[0].itemId)).wait()

    navigate('/')
  }

  useEffect(() => {
    loadMarketplaceItems()
  }, [])

  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )
  return (
    <Container className="flex justify-center pt-4" >
      <Row className='pt-5'>
        <Col className='mt-5 pt-5'>
          <div className='d-flex flex-column align-items-start'>
            <div className='text-xxxl font-secular text-black'>WELCOME !</div>
            <div className='text-lg text-black'>連結你的錢包</div>
            <div className='text-lg text-black'>取得用戶NFT !</div>
          </div>
        </Col>
        <Col className='mt-4'>
          {items.length > 0 ?
            <div className="rounded mx-auto mt-5 bg-purple-100 text-end shadow-md">
              <div className="mt-5 p-5 container text-center d-flex flex-column align-items-center">
                <h3 className='mb-4 w-50 text-black'>創建你的帳號</h3>
                <Form.Control
                    type="file"
                    required
                    name="file"
                    onChange={uploadToIPFS}
                    className='w-50'
                  />
                  { image ?  
                    <div className="w-50 h-auto mt-4">
                      <img src={image} className="w-100"/>
                    </div>
                  : <></>
                  }
                <Form.Control
                  onChange={(e) => setName(e.target.value)}
                  size="lg"
                  required
                  type="text"
                  placeholder="用戶名稱"
                  className='mt-4 w-50 bg-purple-100'
                />
                <div className='d-flex justify-content-center mt-4 w-50'>
                  <Button onClick={() => addIpfs()} className='w-100 bg-purple-blue-linear'>
                    註冊
                  </Button>
                </div>
              </div>
            </div>
            : (
              <main style={{ padding: "1rem 0" }}>
                <h2>目前沒有釋出的權限，請期待下一波活動</h2>
              </main>
            )}
          </Col>
        </Row>
    </Container>
  );
}
export default Singup;