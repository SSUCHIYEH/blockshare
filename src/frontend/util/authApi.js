export const getAuthURL = async(authwork,nft,owner) => {
    const filter = authwork.filters.Register(null,null,null,owner)
    const results = await authwork.queryFilter(filter)
    const uri = await nft.tokenURI(results[0].args.tokenId)
    return uri
}

export const getAuthData = async(uri) => {
    const response = await fetch(uri)
    const metadata = await response.json()
    return metadata
}


export const getFollow = async(authwork,nft,account) => {
    const filter = authwork.filters.Follow(account,null)
    const results = await authwork.queryFilter(filter)

    // return results
    const users = []
    if(results.length > 0){
      for (let i = 0; i < results.length; i++){
        const uri = await getAuthURL(authwork,nft,results[i].args.follow)
        const metadata = await getAuthData(uri)
        users.push({
          name: metadata.name,
          image: metadata.image
        })
      }
    }
    return users
}

export const getFans = async(authwork,nft,account) => {
  const filter = authwork.filters.Follow(null,account)
  const results = await authwork.queryFilter(filter)
  const users = []
  if(results.length > 0){
    for (let i = 0; i < results.length; i++){
      const uri = await getAuthURL(authwork,nft,results[i].args.fans)
      const metadata = await getAuthData(uri)
      users.push({
        name: metadata.name,
        image: metadata.image
      })
    }
  }
  return users
}

export const authValid = async(authwork,nft,account) => {
  const filter =  authwork.filters.Register(null,null,null,account)
  const results = await authwork.queryFilter(filter)
  return results
}

export const getAuthRecord = async(authwork,nft,account) => {
  const filter =  authwork.filters.Record(null,account,null,null)
  const results = await authwork.queryFilter(filter)
  const records = []
  for (let index = 0; index < results.length; index++) {
    const element = results[index];
    const trigger_uri = await getAuthURL(authwork,nft,element.args.trigger)
    const trigger_data = await getAuthData(trigger_uri)
    const state = element.args.state == 'follow' ? '追蹤了你': ''
    records.push({
      trigger: trigger_data.name,
      image: trigger_data.image,
      event: state,
      time: element.args.time
    })
  }
  const filter2 =  authwork.filters.Record(null,null,account,null)
  const results2 = await authwork.queryFilter(filter2)
  for (let index = 0; index < results2.length; index++) {
    const element = results2[index];
    const trigger_uri = await getAuthURL(authwork,nft,element.args.owner)
    const trigger_data = await getAuthData(trigger_uri)
    const state = element.args.state == 'follow' ? '已成功追蹤': ''
    records.push({
      image: trigger_data.image,
      trigger: trigger_data.name,
      event: state,
      time: element.args.time
    })
  }
  console.log(results2)
  return records
}