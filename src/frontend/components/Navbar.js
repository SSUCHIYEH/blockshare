import {
    Link
} from "react-router-dom";
import { Navbar, Nav, Button, Container, Form } from 'react-bootstrap'
import market from './market.png'
import { useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { setSearchAsync } from "../reducer/slice";

const Navigation = ({ web3Handler }) => {
  const [input, setInput] =  useState("")
  const {account,name,image} = useSelector((state) => state.home)
  const dispatch = useDispatch()
  const searchInput = () =>{
    dispatch(setSearchAsync(input))
  }
  return (
    <Navbar expand="lg" className="border-bottom border-1 border-light">
      <Container>
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="w-100  justify-content-between">
            <Navbar.Brand>
              <Link to='/' className="text-decoration-none">
                <div className="text-black fw-bold nav_logo" >BLOCSHARE</div>
              </Link>
            </Navbar.Brand>
            {/* <div>
              <input onChange={(e) => setInput(e.target.value)}/>
              <Button onClick={searchInput}>search</Button>
            </div> */}
            {name ? (
              <div className="d-flex">
                <img alt="" src={image ? image : ""} className='active_img rounded-3'/>
                <Link to={`/personal/${account}`} className="ms-2 text-black">{name}</Link>
              </div>
            ) : (
              <></>
                // <Button onClick={web3Handler} variant="outline-primary">Connect Wallet</Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Navigation;