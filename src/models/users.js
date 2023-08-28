/**
 * 비밀번호를 데이터베이스에 저장할 때 플레인(아무런 가공도 하지 않은) 텍스트로 저장하면 보안상 위험
 * => 단방향 해싱 함수를 지원해 주는 bcrypt 라이브러리를 사용하여 비밀번호 저장
 *
 * ** 인스턴스 메소드를 작석할 때는 화살표 함수가 아닌 function 키워드를 사용하여야 한다. => 함수 내부에서 this에 접근해야 하기 때문
 * 여기서 this는 문서 인스턴스를 가리킨다. 화살표 함수를 사용하면 this는 문서 인스턴스를 가리키지 못하게 된다.
 *
 */

import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const UserSchema = new Schema({
    username: String,
    hashedPassword: String,
})

/**
 * 인스턴스 메소드
 * 비밀번호를 파라미터로 받아서 계정의 hashedPassword 값을 설정
 * @param {} password
 */
UserSchema.methods.setPassword = async function (password) {
    const hash = await bcrypt.hash(password, 10)
    this.hashedPassword = hash
}

/**
 * 인스턴스 메소드
 * 파라미터로 받은 비밀번호가 해당 계정의 비밀번호와 일치하는지 검증
 * @param {*} password
 * @returns
 */
UserSchema.methods.checkPassword = async function (password) {
    const result = await bcrypt.compare(password, this.hashedPassword)
    return result // true / false
}

/**
 * 인스턴스 메소드
 * 비밀번호를 제외한 나머지 데이터 전달
 * @returns
 */

UserSchema.methods.serialize = function () {
    const data = this.toJSON()
    delete data.hashedPassword
    return data
}

UserSchema.methods.generateToken = function () {
    const token = jwt.sign(
        // 첫 번째 파라미터에는 토큰 안에 넣고 싶은 데이터를 넣는다.
        {
            _id: this.id,
            username: this.username,
        },
        process.env.JWT_SECRET, // 두 번째 파라미터에는 JWT 암호를 넣는다.
        {
            expiresIn: '7d', // 7일 동안 유요함
        },
    )
    return token
}

/**
 * 스태틱 메소드
 * username으로 데이터를 찾을 수 있게 해줌.
 * 여기서 this 는 모델을 가리킴
 * @param {*} username
 * @returns
 */
UserSchema.statics.findByUsername = function (username) {
    return this.findOne({ username })
}

const User = mongoose.model('User', UserSchema)
export default User
