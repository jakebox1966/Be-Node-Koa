const Router = require('koa-router')
const posts = require('./posts')
const api = new Router()

api.use('/posts', posts.routes())
// api.get('/test', (ctx) => {
//     ctx.body = 'test 성공'
// })

// 라우터를 내보낸다.
module.exports = api
