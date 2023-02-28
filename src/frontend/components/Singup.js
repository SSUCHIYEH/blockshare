import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Button, Form } from 'react-bootstrap'
import { create } from 'ipfs-http-client'
import {Buffer} from 'buffer'

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



const Singup = ({ authwork, nft }) => {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [name, setName] = useState('')
  const [image, setImage] = useState('https://nft-login.infura-ipfs.io/ipfs')

  const uploadToIPFS = async (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    if (typeof file !== 'undefined') {
      try {
        const result = await client.add(file)
        console.log(result)
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
      console.log(uri)
      registerItem(uri)
    } catch(error) {
      console.log("ipfs uri upload error: ", error)
    }
  }
  const registerItem = async (uri) => {
    await (await nft.setTokenURL(uri,items[0].itemId)).wait()
    await (await authwork.RegisterItem(items[0].itemId)).wait()
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
    <div className="flex justify-center bg-light h-100 pt-4">
      {items.length > 0 ?
        <div className="bg-white rounded p-5 shadow-sm mb-4 text-end w-50 mx-auto mt-4">
          <div className="mt-4 px-5 container text-center">
            <Row xs={1} md={2} lg={4} className="justify-content-center">
            <Form.Control
                type="file"
                required
                name="file"
                onChange={uploadToIPFS}
              />
              <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="用戶名稱" className='w-50'/>
            </Row>
            <div className='d-flex justify-content-center mt-4'>
              <Button onClick={() => addIpfs()} variant="primary" className='w-50'>
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
    </div>
  );
}
export default Singup;