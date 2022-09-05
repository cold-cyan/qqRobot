/*
 * @Author: Ayanami-y 1787984719@qq.com
 * @Date: 2022-08-06 17:06:06
 * @LastEditors: kang.yin
 * @LastEditTime: 2022-08-29 13:55:59
 * @FilePath: \qqRobot\src\azurLane.js
 * @Description:  
 */
"use strict";
const fs = require('fs')

const {
    segment
} = require("oicq");
const cheerio = require('cheerio');

const { searchWarship,searchPageApi } = require('../api/azurLane');
const canvas = require('./plugin/canvas')

module.exports = function(msg,shell){
    
    if((shell.includes('搜索')||shell.includes('查询'))){
        // canvas()
        let splitList = shell.includes('搜索')? shell.split('搜索') : shell.split('查询'),
            text = splitList[splitList.length - 1].trim();
        searchWarship(text).then(res=>{
            const $ = cheerio.load(res);
            let text = "";
            for(let item of $('.wikitable.sv-general tbody tr:eq(0) td>b')){
                text+=$(item).text()
            }
            let trList = $('.wikitable.sv-skill tbody tr>td');
            let tdText = ""
            for(let key in trList.children()){
                if(isNaN(key))continue;
                tdText+=`${key}\n`
            }
            let skillText = trList.text().split('\n')
            // &&(item.indexOf('-')===-1&&item.indexOf('专属弹幕')!==-1)
            let skillList = [...new Set(skillText.filter(item=>item.indexOf('[')===-1&&item.indexOf('{')===-1&&!!item.trim()&&item.indexOf('改造')===-1&&item.indexOf('无改')===-1))];
            let locat = []
            // for(let i=0;i<Math.meli(skillList.length/2);i+=2){
            //     locat.push(skillList.splice)
            // }
            while(skillList.length>0){
                locat.push(skillList.splice(0, 2));
            }
            skillList = locat.map(item=>item.join(':'))
            // console.log(skillList,'skillList')
            // fs.writeFile(__dirname+'/ceshi/index2.txt',trList.toString(),(err)=>{
            //     console.log(err,'err')
            // })
            msg.reply(`${text}\n技能：\n-------------------\n${skillList.join('\n-------------------\n')}\n-------------------`, true)
        })
    }
}