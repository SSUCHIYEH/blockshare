import { create } from 'ipfs-http-client'
import {Buffer} from 'buffer'

const projectId = '2L5kc3U7jOUe0kv4NwoxM5L1NAJ';
const projectSecret = '4303a8c9f253bd5e42c871708ff5fc31';
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  apiPath: '/api/v0',
  headers: {
    authorization: auth
  }
});


export default client;