import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Form, Button } from 'react-bootstrap'


const IMAGE_URL = "QmZXXqYD1AtiSfYaiKCrKCNDEhuPbgX6o1rQPto7JURVCv"
const URI = `https://ipfs.infura.io/ipfs`

const Create = ({ authwork, nft, postwork }) => {

  const createNFT = async (category) => {
    try{
      if(category=="auth"){
        mintThenList()
      }else{
        mintPost()
      }
    } catch(error) {
      console.log("ipfs uri upload error: ", error)
    }
  }
  const mintThenList = async () => {
    // mint nft 
    await(await nft.mint(URI)).wait()
    // get tokenId of new nft 
    const id = await nft.tokenCount()

    // approve marketplace to spend nft
    await(await nft.setApprovalForAll(authwork.address, true)).wait()

    await(await authwork.makeItem(nft.address, id)).wait()
  }

  const mintPost = async () => {
    // mint nft 
    await(await nft.mint(URI)).wait()
    // get tokenId of new nft 
    const id = await nft.tokenCount()
    // approve marketplace to spend nft
    await(await nft.setApprovalForAll(postwork.address, true)).wait()
    // add nft to marketplace
    await(await postwork.makeItem(nft.address, id)).wait()
  }

  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
          <div className="content mx-auto">
            <Row className="g-4">
              <h1>Mint Auth</h1>
              <div className="d-grid px-0">
                <Button onClick={() =>createNFT('auth')} variant="primary" size="lg">
                  Create & List NFT!
                </Button>
              </div>
            </Row>

            <Row className="g-4">
              <h1>Mint Post</h1>
              <div className="d-grid px-0">
                <Button onClick={() => createNFT('post')} variant="primary" size="lg">
                  Create POST NFT!
                </Button>
              </div>
            </Row>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Create