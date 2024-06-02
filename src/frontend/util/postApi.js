import { getAuthData, getAuthURL } from "./authApi"

export const getPostRecord = async(postwork,authwork,nft,account) => {
    const filter =  postwork.filters.Record(null,account,null,null)
    const results = await postwork.queryFilter(filter)
    const records = []
    for (let index = 0; index < results.length; index++) {
      const element = results[index];
      const trigger_uri = await getAuthURL(authwork,nft,element.args.trigger)
      const trigger_data = await getAuthData(trigger_uri)
      const state = element.args.state == 'like' ? '說你的貼文讚': ''
      records.push({
        trigger: trigger_data.name,
        event: state,
        time: element.args.time
      })
    }
    return records
  }

  export const checkMember = async(authwork,creator,account) => {
    if(creator.toUpperCase() == account.toUpperCase()){
      return true
    }
    else {
      let isMember = false
      const filter =  authwork.filters.Member(null,null)
      const results = await authwork.queryFilter(filter)
      for (let index = 0; index < results.length; index++) {
        const args_creator = results[index].args.creator
        const args_fans = results[index].args.fans
        if (args_fans.toUpperCase() == creator.toUpperCase() && args_creator.toUpperCase() == account.toUpperCase()){
          isMember = true
        }
      }
      return isMember
    }
  }