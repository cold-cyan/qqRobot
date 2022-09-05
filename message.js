const {
    GCWL,
    adminUser,
    robot,
    keyword,
    systemAll
} = require('./userConfig');
const {
    segment
} = require("oicq")
const {
    RandomNum
} = require('./utils')

const {
    getMusic
} = require('./api/music')

const getImages = require('./src/image')
const azurLane = require('./src/azurLane')
const oldMsg = null;

const {
    searchImage,
    randomImage
} = require('./api/image');

module.exports = function (msg, bot) {
    const {
        sender,
        group_id,
        raw_message,
        message
    } = msg;
    let speakText = ""
    message.forEach(item => {
        if (item.type === 'text') {
            speakText = item.text
            return
        }
    })
    if (GCWL.indexOf(group_id.toString()) !== -1) {
        const reg = new RegExp(`^[${keyword}]`)
        if (reg.test(speakText.trim())) {
            let isFlag = false;
            const shell = speakText.substring(speakText.indexOf('&'));
            try {
                systemAll.forEach(item => {
                    if (speakText.includes(item)) {
                        isFlag = true
                        throw new Error()
                    }
                })
            } catch (error) {}
            if (!isFlag) {
                msg.group.sendMsg('暂无此命令');
                return
            }
            try {
                let date = new Date();
                switch (true) {
                    case speakText.includes('你好'):
                        msg.reply(`你好啊${sender.nickname},我是小绫,一只刚诞生不久的(智障?)机器人(◦˙▽˙◦)`, true)
                        break;
                    case speakText.includes('你是谁') || speakText.includes('你叫什么'):
                        msg.reply(`我是小绫,一只刚诞生不久的(智障?)机器人(◦˙▽˙◦),请多关照！`, true)
                        break;
                    case speakText.includes('早上好'):

                        let houes = date.getHours()
                        let messageList = [];
                        switch (true) {
                            case houes < 11 && houes > 6:
                                messageList = [`早上好！现在是北京时间${houes}时。一日之计在于晨,请不要忘记吃早饭哦！`, `早上好，今天也是元气满满的一天呢♪`, `早啊，`]
                                break;
                            case houes >= 11 && houes < 13:
                                messageList = [`已经是午饭时间了,温馨提醒：早睡早起身体好，不要长时间熬夜哦`]
                                break;
                            case houes >= 13 && houes < 18:
                                messageList = [`现在已经是晚上啦。昼夜颠倒可不是好习惯，该注意改善睡眠时间啦`]
                                break;
                        }
                        msg.reply(messageList[RandomNum(0, messageList.length - 1)], true)
                        break;
                    case speakText.includes('晚安'):
                        msg.reply(`晚安。身体是革命的本钱,请注意早点休息哦`, true)
                        break;
                    case speakText.includes('时间') || speakText.includes('当前时间'):
                        msg.reply(`现在是北京时间：${date.getHours()}时${date.getMinutes()}分${date.getSeconds()}秒`, true)
                        break;
                    case speakText.includes('申请禁言'):
                        //需要管理员权限
                        if (msg.group.is_admin) {
                            let timeList = speakText.match(/\d+/g)
                            if (timeList && timeList.length > 0) {
                                if (speakText.includes('时') || speakText.includes('小时')) {
                                    // Number(timeList[0])
                                    msg.group.muteMember(sender.user_id, 60 * 60 * Number(timeList[0]))
                                } else if (speakText.includes('分') || speakText.includes('分钟')) {
                                    msg.group.muteMember(sender.user_id, 60 * Number(timeList[0]))
                                } else if (speakText.includes('秒')) {
                                    msg.group.muteMember(sender.user_id, Number(timeList[0]))
                                } else {
                                    msg.group.muteMember(sender.user_id, 60 * Number(timeList[0]))
                                }
                            } else {
                                msg.group.sendMsg('请先确认需要禁言的时间哦(•́ω•̀ ٥)')
                            }
                        } else {
                            msg.group.sendMsg([`很遗憾,${robot}暂无禁言的权限哦~(╥﹏╥)~`])
                        }
                        break;
                    case speakText.includes('图'):
                        getImages(msg, shell)
                        break;
                    case speakText.includes('搜索歌曲') || speakText.includes('搜歌') || speakText.includes('音乐'):
                        const textList = speakText.includes('搜索歌曲') ? speakText.split('搜索歌曲') : speakText.includes('搜歌') ? speakText.split('搜歌') : speakText.split('音乐'),
                            songName = textList.length > 1 ? textList[textList.length - 1].trim() : ''
                        if (songName.length > 0) {
                            getMusic(songName).then(res => {
                                const {
                                    status,
                                    data
                                } = res;
                                if (data.info.length > 0) {
                                    msg.group.shareMusic('kugou', data.info[0].hash)
                                } else {
                                    msg.reply(`无搜索结果,请更换关键词尝试`, true)
                                }
                            })
                        } else {
                            msg.reply(`请输入正确的歌曲名称！`, true)
                        }
                        break;
                    case speakText.includes('搜索') || speakText.includes('查询'):
                        azurLane(msg, shell)
                        break;
                    default:
                        msg.group.sendMsg('命令还在完善中ing...');
                        break;
                }
            } catch (error) {
                msg.reply(['系统出错啦,请等待维护人员查看', segment.face(104), segment.at(adminUser), '⁽⁽ƪ(•̩̩̩̩＿•̩̩̩̩)ʃ⁾⁾ᵒᵐᵍᵎᵎ'], true)
                console.error('err:', error)
            }

        }

    }
}