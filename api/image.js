const { get,post } = require('./request')

const randomImage = function(){
    return get('https://www.vilipix.com/api/v1/picture/public?limit=150&offset=77&sort=hot&type=1')
}
const searchImage = function (text){
    return get(`https://www.vilipix.com/api/v1/picture/public?limit=150&tags=${text}&sort=new&offset=0`)
}
const distinguishImage = function(uri){
    return post('https://ascii2d.net/search/uri',{
        utf8:'✓',
        authenticity_token:'3AuFK4Xdhir+f1tLMYD5R/7Se8g4CUdr83ji/uJoI5RMLD+HZXW9+Xi0N+GYgB8NDfdcBa7X2wlcydQ8U9EnBw==',
        uri
    })
}
const featuresImage = function(id){
    return get(`https://ascii2d.net/search/bovw/${id}`)
}
module.exports = {
    searchImage,
    randomImage,
    distinguishImage,
    featuresImage
}