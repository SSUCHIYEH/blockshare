import { useState } from "react"

export default function PostItem(account) {
    const [like, setLike] = useState(false);

    return(
        <div>
            <div>{account.slice(0, 5)}</div>
            <div>LoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLorem</div>
            
        </div>
    )
}