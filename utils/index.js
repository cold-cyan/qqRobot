/**
 * @param { Number } Min 最小数
 * @param { Number } Max 最大数
 * @description  min ≤ r ≤ max 
*/
function RandomNum(Min,Max){
    var Range = Max - Min;
    var Rand = Math.random();
    var num = Min + Math.round(Rand * Range); //四舍五入
    return num;
}
module.exports = {
    RandomNum
}