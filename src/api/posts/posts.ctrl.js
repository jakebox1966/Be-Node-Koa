/**
 * 컨트롤러를 만들면서 exports.이름 = ... 형식으로 함수를 내보내 주었다. 이렇게 내보낸 코드는 다음 형식으로 불러올 수 있다.
 *
 * const 모듈이름 = require('파일이름')
 * 모듈이름.이름()
 */

import Post from '../../models/post.js'

/**
 * 포스트 작성
 * POST /api/posts
 * {
 * title : '제목',
 * body : '내용',
 * tags: ['태그 1', '태그 2']
 *  }
 */

export const write = async (ctx) => {
    console.log(ctx.request.body)
    // REST API의 Request Body는 ctx.request.body에서 조회할 수 있다.
    const { title, body, tags } = ctx.request.body

    const post = new Post({
        title,
        body,
        tags,
    })
    try {
        await post.save()
        ctx.body = post
    } catch (e) {
        ctx.throw(500, e)
    }
}

/**
 * 포스트 목록 조회
 * GET /api/posts
 */

export const list = async (ctx) => {
    try {
        const posts = await Post.find().exec()
        ctx.body = posts
    } catch (e) {
        ctx.throw(500, e)
    }
}

/**
 * 특정 포스트 조회
 * GET /api/posts/:id
 */

export const read = async (ctx) => {
    const { id } = ctx.params
    try {
        const post = await Post.findById(id).exec()
        if (!post) {
            ctx.status = 404 // Not Found
            return
        }
        ctx.body = post
    } catch (e) {
        ctx.throw(500, e)
    }
}

/**
 * 특정 포스트 제거
 * DELETE /api/posts/:id
 */

export const remove = async (ctx) => {
    const { id } = ctx.params
    try {
        await Post.findByIdAndRemove(id).exec()
        ctx.status = 204 // No Content(성공하기는 했지만 응답할 데이터는 없음)
    } catch (e) {
        ctx.throw(500, e)
    }
}

/**
 * 포스트 수정(교체)
 * PUT /api/posts/:id
 * {title, body}
 */

// export const replace = (ctx) => {
// PUT 메소드는 전체 포스트 정보를 입력하여 데이터를 통째로 교체할 때 사용한다.
// }

/**
 * 포스트 수정(특정 필드 변경)
 * PATCH /api/posts/:id
 * {title, body}
 */

export const update = async (ctx) => {
    // PATCH 메소드는 주어진 필드만 교체한다.

    const { id } = ctx.params
    try {
        const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
            new: true, // 이 값을 설정하면 업데이트된 데이터를 반환한다. false일 때는 업데이트되기 전의 데이터를 반환한다.
        }).exec()
        if (!post) {
            ctx.status = 404
            return
        }
        ctx.body = post
    } catch (e) {
        ctx.throw(500, e)
    }
}
