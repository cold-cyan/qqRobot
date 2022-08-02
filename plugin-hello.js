"use strict"

const { bot } = require("./index")
const handleMessage = require('./message')
// hello world
bot.on("message", function (msg) {
	// if (msg.raw_message === "hello")
	// 	msg.reply("hello world", true) //改为false则不会引用
})

// 撤回和发送群消息
bot.on("message.group", function (msg) {
	//sender:发送人信息 group_id:群聊id raw_message:消息内容
	handleMessage(msg,bot)
})

// 接收戳一戳
bot.on("notice.group.poke", function (e) {
	if (e.target_id === this.uin)
		e.group.sendMsg("dont poke me")
})
