const {
    GCWL,
    adminUser,
    robot,
    keyword,
    commandAll
} = require('./userConfig');
const {
    segment
} = require("oicq")
const {
    RandomNum
} = require('./utils')
const oldMsg = null;

const {
    searchImage,
    randomImage
} = require('./api/image')

module.exports = function (msg, bot) {
    const {
        sender,
        group_id,
        raw_message
    } = msg
    if (GCWL.indexOf(group_id.toString()) !== -1) {
        const reg = new RegExp(`^[${keyword}]`)
        if (reg.test(raw_message)) {
            let isFlag = false
            commandAll.forEach(item => {
                if (raw_message.indexOf(item) !== -1) {
                    isFlag = true
                }
            })
            if(!isFlag) {
                msg.group.sendMsg('暂无此命令');
                return
            }
            try {
                if (raw_message.indexOf('你好') !== -1) {
                    msg.reply(`你好啊${sender.nickname},我是小绫,一只刚诞生不久的(智障?)机器人(◦˙▽˙◦)`, true)
                }
                if (raw_message.indexOf('你是谁') !== -1 || raw_message.indexOf('你叫什么') !== -1) {
                    msg.reply(`我是小绫,一只刚诞生不久的(智障?)机器人(◦˙▽˙◦),请多关照！`, true)
                }
                if (raw_message.indexOf('早上好') !== -1) {
                    let date = new Date();
                    let houes = date.getHours()
                    console.log("1111**")
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
                    // msg.reply(`你好啊${sender.nickname},我是小绫,一只刚诞生不久的(智障?)机器人(◦˙▽˙◦)`,true)
                }
                if (raw_message.indexOf('时间') !== -1 || raw_message.indexOf('当前时间') !== -1) {
                    let date = new Date()
                    msg.reply(`现在是北京时间：${date.getHours()}时${date.getMinutes()}分${date.getSeconds()}秒`, true)
                }
                //需要管理员权限

                if (raw_message.indexOf('申请禁言') !== -1) {
                    if (msg.group.is_admin) {
                        let timeList = raw_message.match(/\d+/g)
                        if (timeList && timeList.length > 0) {
                            if (raw_message.indexOf('时') !== -1 || raw_message.indexOf('小时') !== -1) {
                                // Number(timeList[0])
                                msg.group.muteMember(sender.user_id, 60 * 60 * Number(timeList[0]))
                            } else if (raw_message.indexOf('分') !== -1 || raw_message.indexOf('分钟') !== -1) {
                                msg.group.muteMember(sender.user_id, 60 * Number(timeList[0]))
                            } else if (raw_message.indexOf('秒') !== -1) {
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
                }
                if (raw_message.indexOf('图片') !== -1) {
                    randomImage().then(res => {
                        const {
                            data: {
                                rows
                            },
                            code,
                            message
                        } = res
                        if (code === 0) {
                            const random = RandomNum(0, rows.length - 1)

                            function isCartoonTag(list) {
                                if (list[RandomNum(0, list.length - 1)].tags.indexOf('漫画') !== -1) {
                                    return isCartoonTag(list)
                                }
                                return list[RandomNum(0, list.length - 1)]
                            }
                            const row = isCartoonTag(rows)
                            msg.reply([`图片原始链接:${row.original_url}`, segment.image(row.original_url)], true)
                        }
                    })
                }
                if (raw_message.indexOf('搜索图片') !== -1 || raw_message.indexOf('搜图') !== -1) {
                    let splitList = raw_message.indexOf('搜索图片') !== -1?raw_message.split('搜索图片'):raw_message.split('搜图')
                        text = splitList[splitList.length - 1].trim();
                    searchImage(text).then(res => {
                        const {
                            data: {
                                rows
                            },
                            code,
                            message
                        } = res
                        if (code === 0) {
                            const random = RandomNum(0, rows.length - 1)

                            function isCartoonTag(list) {
                                if (list[RandomNum(0, list.length - 1)].tags.indexOf('漫画') !== -1&&list[RandomNum(0, list.length - 1)].tags.indexOf(text)!==-1) {
                                    return isCartoonTag(list)
                                }
                                return list[RandomNum(0, list.length - 1)]
                            }
                            const row = isCartoonTag(rows)
                            console.log(row,'row')
                            msg.reply([`图片原始链接:${row.original_url}`, segment.image(row.original_url)], true)
                        }
                    })
                }
            } catch (error) {
                msg.reply(['系统出错啦,请等待维护人员查看', segment.face(104), segment.at(adminUser), '⁽⁽ƪ(•̩̩̩̩＿•̩̩̩̩)ʃ⁾⁾ᵒᵐᵍᵎᵎ'], true)
            }
            oldMsg = msg
        }

    }
}