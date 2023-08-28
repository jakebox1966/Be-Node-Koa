import Router from 'koa-router'
import * as postsCtrl from './posts.ctrl.js'
import checkLoggedIn from '../../lib/checkedLoggedIn.js'

const posts = new Router()

// const printInfo = (ctx) => {
//     ctx.body = {
//         method: ctx.method,
//         path: ctx.path,
//         params: ctx.params,
//     }
// }

posts.get('/', postsCtrl.list)
posts.post('/', checkLoggedIn, postsCtrl.write)

posts.get('/:id', postsCtrl.getPostById, postsCtrl.read)
posts.delete('/:id', checkLoggedIn, postsCtrl.getPostById, postsCtrl.checkOwnPost, postsCtrl.remove)
// posts.put('/:id', postsCtrl.replace)
posts.patch('/:id', checkLoggedIn, postsCtrl.getPostById, postsCtrl.checkOwnPost, postsCtrl.update)

// refactoring version : 중복되는 코드가 줄어 깔끔하지만 가독성 떨어짐. 변경은 자유

// const post = new Router() // /api/posts/:id
// post.get('/', postsCtrl.read)
// post.delete('/', postsCtrl.remove)
// post.patch('/', postsCtrl.update)

// posts.use('/:id', postsCtrl.checkObjectId, post.routes())

export default posts
