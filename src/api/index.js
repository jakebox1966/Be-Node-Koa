import Router from 'koa-router'
import posts from './posts/index.js'

const api = new Router()

api.use('/posts', posts.routes())
// api.get('/test', (ctx) => {
//     ctx.body = 'test 성공'
// })

// 라우터를 내보낸다.
export default api
