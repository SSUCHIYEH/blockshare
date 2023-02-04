import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card, Button } from 'react-bootstrap'
import { Alchemy, Network } from "alchemy-sdk";

const Home = ({ marketplace, nft }) => {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])


  return (
    <div className="min-vh-100 d-flex justify-content-center bg-light ">
      成功登入
    </div>
  );
}
export default Home