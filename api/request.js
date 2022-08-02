const axios = require('axios')
const get = function(config){
    console.log('get')
    return axios.get(config).then(res=>{
        if(res.status===200){
            return res.data
        }
        throw new Error(`get request status is not a 200,request url is ${config?.url||config}`)
    },rej=>{
        return Promise.reject(rej)
    })
}

const post = function(config){
    return axios.post(config).then(res=>{
        if(res.status===200){
            return res.data
        }
        throw new Error(`post request status is not a 200,request url is ${config?.url||config}`)
    },rej=>{
        return Promise.reject(rej)
    })
}

module.exports = {
    get,
    post
}