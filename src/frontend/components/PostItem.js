import { useEffect } from "react";
import { useState } from "react"
import { Button } from "react-bootstrap";
import { BsHeartFill,BsHeart } from 'react-icons/bs'

export default function PostItem({args,marketplace,postwork}) {
    const [like, setLike] = useState(false);
    const [name, setName] = useState("")
    const getPostName = async() => {
      const filter =  marketplace.filters.Bought(null,null,null,null,args.buyer,null)
      const results = await marketplace.queryFilter(filter)
      setName(results[0].args._username)
    }

    const setLikeIt = async() => {
      await postwork.likeItem(args.itemId)
      setLike(true)
    }
    useEffect(()=>{
      getPostName()
    },[])

    return(
        <div className="text-start bg-white rounded p-4 shadow-sm mb-4">
            <div>{name}</div>
            <div>
                <p style={{whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>{args.content}</p>
            </div>
            <div onClick={()=>{setLikeIt()}} className="cursor-pointer">
                { like ? (
                    <BsHeartFill color="red" />
                ):(
                    <BsHeart color="red" />
                )}
            </div>
            
        </div>
    )
}
