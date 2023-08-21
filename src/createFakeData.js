import Post from './models/post.js'

export default function createFakeData() {
    const posts = [...Array(40).keys(0)].map((i) => ({
        title: `포스트 #${i}`,
        body: 'akljfaksdfjklsadfjkalsdfjklasdfjkldasjkflaksjdlasdkjfkld',
        tags: ['가짜', '데이터'],
    }))
    Post.insertMany(posts).then((docs) => {
        console.log(docs)
    })
}
