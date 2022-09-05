const {
    createCanvas,
    loadImage
} = require('canvas')
const fs = require('fs')


module.exports = function () {
    const width = 1200
    const height = 600

    const canvas = createCanvas(width, height)
    const context = canvas.getContext('2d')


    context.fillStyle = '#fff'
    context.fillRect(0, 0, width, height);


    const text = 'Hello, World!'

    context.font = 'bold 70pt Menlo'
    context.textAlign = 'center'
    context.fillStyle = '#fff'
    context.fillText(text, 600, 170)


    context.fillStyle = '#fff'
    context.font = 'bold 30pt Menlo'
    context.fillText('ceshi.com', 600, 530);

    // const img = new Image()
    // img.onload = (image)=>{
    //     console.log('image',image)
    // }
    // img.onerror = err=>{
    //     console.log('err',err)
    // }
    // img.src = './background.png'
    loadImage('./src/assets/images/background.png').then(image => {
        context.drawImage(image, 0, 0, width, height)
        const buffer = canvas.toBuffer('image/png')
        fs.writeFileSync('./image.png', buffer)
    })
    // const buffer = canvas.toBuffer('image/png')
    // fs.writeFileSync('./image.png', buffer)
}