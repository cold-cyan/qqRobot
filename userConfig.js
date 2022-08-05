
module.exports = {
    user:'',
    pass:'',
    adminUser:'',//管理员账号
    //Group chat white list的缩写 即群聊白名单 放入需要回复的群的id 类型必须是string类型 853622065
    GCWL:[],
    robot:'小绫',//机器人自称
    keyword:'&',
    systemAll:['你好','你是谁','你叫什么','早上好','中午好','晚上好','时间','当前时间','申请禁言','图片','搜索图片','搜图','识别图片','识图','搜索歌曲','搜歌','音乐'],
    //系统命令白名单 即：不需要 keyword 关键字开头也能执行的命令
    systemWL:['']
}