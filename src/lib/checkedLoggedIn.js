const checkLoggedIn = (ctx, next) => {
    if (!ctx.state.user) {
        console.log('로그인 안됨')
        ctx.status = 401 // Unauthorized
        return
    }
    return next()
}

export default checkLoggedIn
