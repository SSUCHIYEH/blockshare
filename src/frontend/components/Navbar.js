import {
    Link
} from "react-router-dom";
import { Navbar, Nav, Button, Container, Form } from 'react-bootstrap'
import market from './market.png'
import { useState } from "react";

const Navigation = ({ web3Handler, account, name, image }) => {
  const [input, setInput] =  useState("")
  
  return (
    <Navbar expand="lg" bg="white" variant="dark">
      <Container>
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="w-100  justify-content-between">
            <Navbar.Brand>
            <div className="text-primary fw-bold" >TAPTAP</div>
            </Navbar.Brand>
            <div>
              <input onChange={(e) => setInput(e.target.value)}/>
              <Button>search</Button>
            </div>
            {account ? (
              <div className="d-flex">
                <img alt="" src={image ? image : ""} className='active_img rounded-circle'/>
                <div className="text-primary ms-2">{name ? name : account}</div>
              </div>
            ) : (
                <Button onClick={web3Handler} variant="outline-primary">Connect Wallet</Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Navigation;