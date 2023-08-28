/**
 * 컨트롤러를 만들면서 exports.이름 = ... 형식으로 함수를 내보내 주었다. 이렇게 내보낸 코드는 다음 형식으로 불러올 수 있다.
 *
 * const 모듈이름 = require('파일이름')
 * 모듈이름.이름()
 */

import mongoose from 'mongoose'
import Post from '../../models/post.js'
import Joi from '@hapi/joi'

const { ObjectId } = mongoose.Types

// export const checkObjectId = (ctx, next) => {
//     const { id } = ctx.params
//     if (!ObjectId.isValid(id)) {
//         ctx.stats = 400 //Bad Request
//         return
//     }
//     return next()
// }

export const getPostById = async (ctx, next) => {
    const { id } = ctx.params
    if (!ObjectId.isValid(id)) {
        ctx.status = 400 // Bad Request
        return
    }

    try {
        const post = await Post.findById(id)
        // 포스트가 존재하지 않을 때
        if (!post) {
            ctx.status = 404 // Not Found
            return
        }
        ctx.state.post = post
        return next()
    } catch (e) {
        ctx.throw(500, e)
    }
}

export const checkOwnPost = (ctx, next) => {
    const { user, post } = ctx.state
    console.log('user', user)
    console.log('post.user', post)
    if (post.user._id.toString() !== user._id) {
        console.log('안맞는다')
        ctx.status = 403
        return
    }
    return next()
}

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
    const schema = Joi.object().keys({
        // 객체가 다음 필드를 가지고 있음을 검증
        title: Joi.string().required(), // required() 가 있으면 필수 항목
        body: Joi.string().required(),
        tags: Joi.array().items(Joi.string()).required(), // 문자열로 이루어진 배열
    })

    // 검증하고 나서 검증 실패인 경우 에러 처리
    const result = schema.validate(ctx.request.body)
    if (result.error) {
        ctx.status = 400 //Bad Request
        ctx.body = result.error
        return
    }
    console.log(ctx.request.body)
    // REST API의 Request Body는 ctx.request.body에서 조회할 수 있다.
    const { title, body, tags } = ctx.request.body

    const post = new Post({
        title,
        body,
        tags,
        user: ctx.state.user,
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
 * GET /api/posts?username=&tag=&page=
 */

export const list = async (ctx) => {
    // query는 문자열이기 때문에 숫자로 변환해 주어야 한다.
    // 값이 주어지지 않았다면 1을 기본으로 사용한다.
    const page = parseInt(ctx.query.page || '1', 10)

    if (page < 1) {
        ctx.status = 400
        return
    }

    const { tag, username } = ctx.query
    // tag,username 값이 유효하면 객체 안에 넣고, 그렇지 않으면 넣지 않음
    const query = {
        ...(username ? { 'user.username': username } : {}),
        ...(tag ? { tags: tag } : {}),
    }

    console.log('query', query)
    try {
        const posts = await Post.find(query)
            .sort({ _id: -1 })
            .limit(10)
            .skip((page - 1) * 10)
            .lean()
            .exec()

        const postCount = await Post.countDocuments(query).exec()
        ctx.set('Last-Page', Math.ceil(postCount / 10))
        ctx.body = posts
            // .map((post) => post.toJSON())
            .map((post) => ({
                ...post,
                body: post.body.length < 200 ? post.body : `${post.body.slice(0, 200)}...`,
            }))
    } catch (e) {
        ctx.throw(500, e)
    }
}

/**
 * 특정 포스트 조회
 * GET /api/posts/:id
 */

export const read = async (ctx) => {
    ctx.body = ctx.state.post
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

    // write에서 사용한 schema와 비슷한데, required()가 없다.
    const schema = Joi.object().keys({
        title: Joi.string(),
        body: Joi.string(),
        tags: Joi.array().items(Joi.string()),
    })

    // 검증하고 나서 검증 실패인 경우 에러 처리
    const result = schema.validate(ctx.request.body)
    if (result.error) {
        ctx.status = 400 // Bad Request
        ctx.body = result.error
        return
    }

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
