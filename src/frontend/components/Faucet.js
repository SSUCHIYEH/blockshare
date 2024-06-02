import { useEffect } from "react";
import { useSelector } from "react-redux";

const Faucet = ({ newToken }) => {
  const account = useSelector((state) =>  state.home.account)
  useEffect(()=>{
    console.log(newToken)
  },[])


  const getOCTHandler = async () => {
    try {
      const resp = await newToken.transferFrom('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',account,100000000)
      console.log(resp.hash)
    } catch (err) {
      console.log(err)
    }
  };

  return (
    <div>
      <section className="hero is-fullheight">
        <div className="faucet-hero-body">
          <div className="container has-text-centered main-content">
            <h1 className="title is-1">Faucet</h1>
            <p>Fast and reliable. 50 OCT/day.</p>
            <div className="box address-box">
              <div className="columns">
                <div className="column is-four-fifths">
                  <input
                    className="input is-medium"
                    type="text"
                    placeholder="Enter your wallet address (0x...)"
                  />
                </div>
                <div className="column">
                  <button
                    className="button is-link is-medium"
                    onClick={getOCTHandler}
                  >
                    GET TOKENS
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Faucet