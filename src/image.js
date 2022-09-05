const {
    searchImage,
    randomImage,
    distinguishImage,
    featuresImage
} = require('../api/image');
const {
    segment
} = require("oicq")
const {
    RandomNum
} = require('../utils');

const noData = (msg, list) => {
    if (list.length < 1) {
        msg.reply(`无搜索结果,请更换关键词尝试`, true)
        return false
    }
    return true
}
let randomImageList = [], //记录已经出现过的图片
    searchImageTags = [], //记录已经被搜索过的标签
    searchImageList = []; // 记录已经被搜索过的标签内的已经发过的图片
module.exports = function (msg, shell) {
    if (shell.includes('图片') && !shell.includes('搜索图片') && !shell.includes('识别图片')) {
        randomImage().then(res => {
            let {
                data: {
                    rows
                },
                code,
                message
            } = res
            if (code === 0) {
                if (!noData(msg, rows)) return
                rows = rows.map(item => {
                    //过滤掉漫画
                    if (!item.tags.includes('漫画') && randomImageList.indexOf(item.picture_id) === -1) {
                        return item
                    }
                })
                if (!noData(msg, rows)) return
                let index = RandomNum(0, rows.length - 1)
                randomImageList.push(rows[index].picture_id)
                msg.reply([`随机图片原始链接:${rows[index].original_url}`, segment.image(rows[index].original_url)], true)
            } else {
                msg.group.sendMsg(['Image request code error.Please contact the maintenance personnel to check', segment.at('1787984719'), 'Status code is not 0 from image.js 60/lines.', `Current status code is ${code}`])
            }
        })
    }
    if (shell.includes('搜索图片') || shell.includes('搜图')) {
        let splitList = shell.includes('搜索图片')? shell.split('搜索图片') : shell.split('搜图'),
            text = splitList[splitList.length - 1].trim();
        if (text.length < 1) {
            msg.reply('请输入搜索内容，搜索格式：&搜图xxx || &搜索图片xxx', true)
            return
        }
        searchImage(text).then(res => {
            let {
                data: {
                    rows
                },
                code,
                message
            } = res
            if (code === 0) {
                if (!noData(msg, rows)) return
                rows = rows.map((item) => {
                    if (searchImageTags.indexOf(text) === -1) {
                        searchImageTags.push(text)
                        //过滤掉漫画
                        if (!item.tags.includes('漫画')) {
                            return item
                        }
                    } else {
                        //过滤掉同一关键字下之前发送过的图片
                        if (searchImageList.indexOf(item.picture_id) === -1) {
                            return item
                        }
                    }
                }).filter(item => item);
                //判断过滤后是否还有数据
                if (!noData(msg, rows)) return
                let index = RandomNum(0, rows.length - 1)
                searchImageList.push(rows[index].picture_id)
                msg.reply([`图片原始链接:${rows[index].original_url}`, segment.image(rows[index].original_url)], true)
            } else {
                msg.group.sendMsg(['Image request code error.Please contact the maintenance personnel to check', segment.at('1787984719'), 'Status code is not 0 from image.js 107/lines', `Current status code is ${code}`])
            }
        })
    }
    if (shell.includes('识别图片') || shell.includes('识图')) {
        let imageUrl = '';
        for (let item of msg.message) {
            if (item.type === 'image') {
                imageUrl = item.url
                break;
            }
        }
        if (imageUrl.length < 1) {
            msg.reply(`请发送需要识别的图片`, true)
            return
        }
        const getImgSrc = (html)=>{
            //匹配图片标签（g表示匹配所有结果i表示区分大小写）
            let imgReg = /<img.*?(?:>|\/>)/gi,
            //匹配src属性 ([^\'\"]*)(\/thumbnail)
                srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i,
                arr = html.match(imgReg);
            let imageSrcList = [];
            for (let i = 0; i < arr.length; i++) {
                let src = arr[i].match(srcReg);
                //获取图片地址
                try {
                    if(src[1]&&/\/thumbnail/.test(src[1])){
                        //.replace(/\//g,)
                        imageSrcList.push(src[1])
                    }
                } catch (error) {}
            }
            return imageSrcList
        }
        distinguishImage(imageUrl)
        .then(res => {
            let imageSrcList = getImgSrc(res)
            if(imageSrcList.length<1){
                msg.reply(`暂无匹配结果`, true)
                return
            }else{
                ///thumbnail/f/a/9/0/fa90d819a3125cb59ee476676ce28a85.jpg
                let imageSrcArr = imageSrcList[0].split('/'),
                imgid = imageSrcArr[imageSrcArr.length-1].split('.')[0]
                featuresImage(imgid).then(res=>{
                    let featuresImageList = getImgSrc(res)
                    // console.log(imageSrcList[0],'src\ngetImgSrc',featuresImageList)
                    let seheText = imageSrcList.length>1?segment.image(`https://ascii2d.net${imageSrcList[1]}`):`色合検索无结果`,
                    tezhengText = featuresImageList.length>1?segment.image(`https://ascii2d.net${featuresImageList[1]}`):`特徴検索无结果`
                    msg.reply(["色合検索:",seheText,"\n特徴検索:",tezhengText], true)
                })
            }
        })
    }
}