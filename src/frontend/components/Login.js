import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ marketplace, nft, account }) => {

    const loadPurchasedItems = async () => {
        const filter =  marketplace.filters.Bought(null,null,null,null,null,account)
        const results = await marketplace.queryFilter(filter)
    }
    return(
        <div>
            <button>
                sign in
            </button>
        </div>
    )
}

export default Login;