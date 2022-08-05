const {
    get
} = require('./request')

const getMusic = function (songName) {
    return get(`http://mobilecdn.kugou.com/api/v3/search/song?format=json&keyword=${songName}&page=1&pagesize=20&showtype=1`)
}
module.exports = {
    getMusic
}