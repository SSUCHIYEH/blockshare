import { useEffect } from "react";
import { useState } from "react"
import { Button } from "react-bootstrap";
import { BsHeartFill,BsHeart } from 'react-icons/bs'
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setLikeAsync } from "../reducer/slice";
import { getAuthData,getAuthURL } from "../util/authApi";
import { checkMember } from "../util/postApi";

export default function PostItem({args,postwork,authwork,nft,newToken}) {
    const [like, setLike] = useState(false);
    const [name, setName] = useState("")
    const [image, setImage] = useState("")
    const [content, setContent] = useState("")
    const [video,setVideo] = useState("")
    const [count, setCount] = useState(0)
    const account = useSelector((state) =>  state.home.account)
    const [member, setMember] = useState(false)

    const dispatch = useDispatch()

    const setPostData = async() => {
      const uri= await getAuthURL(authwork,nft,args.owner)
      const metadata = await getAuthData(uri)

      setName(metadata.name)
      setImage(metadata.image)

      const content_uri = await nft.tokenURI(args.tokenId)
      const content_response = await fetch(content_uri)
      const content_metadata = await content_response.json()
      setContent(content_metadata.content)
      setVideo(content_metadata.video)
      await setIfLike()
    }

  const setIfLike = async() =>{
    if(account != ""){
      const like_filter = postwork.filters.Liked(null,args.nft,null,null,null)
      const liked_results = await postwork.queryFilter(like_filter)
      const result = liked_results.filter(like => like.args.tokenId.toHexString() == args.tokenId.toHexString());
      const is_like = result.find((e)=> e.args.liker.toUpperCase() == account.toUpperCase())

      if (is_like) setLike(true)
      setCount(result.length)
    }
  }

    const setLikeIt = async() => {
      if(!like){
        const resp = await newToken.transferFrom('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',args.owner,30000000)
        await (await postwork.likeItem(args.itemId)).wait()
        
        dispatch(setLikeAsync(true))
        sessionStorage.setItem('like',true)
      }
      setLike(!like)
      await setIfLike()
    }

    const checkIfMember= async() => {
      if (args.member) {
        const resp = await checkMember(authwork,args.owner,account)
        setMember(resp)
      }else {
        setMember(true)
      }
    }
    useEffect(()=>{
      setPostData()
      if(account != '') checkIfMember()
    },[account])

    return(
        <div className={`${member ? 'd-block':'d-none'} rounded-3 mb-4 p-4 text-start bg-purple-100 shadow-md`}>
            <div className="d-flex justify-content-between">
              <div className="d-flex">
                <img alt="" src={image} className='active_img rounded-circle'/>
                <Link to={`/personal/${args.owner}`} className="ms-2 text-black">{name}</Link>
              </div>
              { args.member ? 
                <div className="text-black">會員</div>
                : <></>
              }
            </div>
            <div className="mt-3">
                <p 
                  className="text-black"
                  style={{whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>
                  {content}
                </p>
                <iframe src={video} title="" height="240px" className='w-100'></iframe>
            </div>
            <div onClick={()=>{setLikeIt()}} className="cursor-pointer">
                { like ? (
                    <BsHeartFill color="red" />
                ):(
                    <BsHeart color="red" />
                )}
                <span className="ms-2">{ count }</span>
            </div>
            
        </div>
    )
}
