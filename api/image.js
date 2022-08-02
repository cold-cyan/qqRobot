const { get } = require('./request')

const randomImage = function(){
    return get('https://www.vilipix.com/api/v1/picture/public?limit=18&offset=77&sort=hot&type=1')
}
const searchImage = function (text){
    return get(encodeURI(`https://www.vilipix.com/api/v1/picture/public?limit=30&tags=${text}&sort=new&offset=0`))
}
module.exports = {
    searchImage,
    randomImage
}