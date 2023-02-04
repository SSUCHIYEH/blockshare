import {
    Link
} from "react-router-dom";
import { Navbar, Nav, Button, Container } from 'react-bootstrap'
import market from './market.png'

const Navigation = ({ web3Handler, account }) => {
  return (
    <Navbar expand="lg" bg="white" variant="dark">
      <Container>
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="w-100  justify-content-between">
            <Navbar.Brand>
            <div className="text-primary fw-bold" >LIFESHARE</div>
            </Navbar.Brand>
            {account ? (
              <div className="text-primary">{account.slice(0, 5) + '...' + account.slice(38, 42)}</div>
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