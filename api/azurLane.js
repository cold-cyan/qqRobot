/*
 * @Author: Ayanami-y 1787984719@qq.com
 * @Date: 2022-08-06 17:07:06
 * @LastEditors: kang.yin
 * @LastEditTime: 2022-08-23 15:33:06
 * @FilePath: \qqRobot\api\azurLane.js
 * @Description: 
 */
const { get } = require('./request');

const searchWarship = function(text){
    return get(`https://wiki.biligame.com/blhx/${text}`)
}
const searchPageApi = function(keyword){
    return get(`https://searchwiki.biligame.com/blhx/index.php?search=${keyword}&go=%E5%89%8D%E5%BE%80`)
}
module.exports = {
    searchWarship,
    searchPageApi
}



