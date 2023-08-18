/**
 * 관계형 데이터베이스의 한계
 * - 데이터 스키마가 고정적이라 데이터양이 많을 때는 데이터 베이스 스키마를 변경하는 작업이 번거롭다.
 * - RDBMS는 저장하고 처리해야 할 데이터양이 늘어나면 여러 컴퓨터에 분산시키는 것이 아니라 데이터베이스 서버 성능 자체를 업그레이드하는 방식으로 확장해야한다.
 *
 * ==> 이러한 한계를 극복하고자 문서 지향적 NoSQL 데이터베이스를 사용(MongoDB)
 *
 * - NoSQL 데이터베이스가 무조건 기존의 RDBMS 보다 좋은 것은 아니다. 상황별로 적합한 데이터베이스를 사용해야한다. 데이터의 구조가 자주 바뀐다면 MongoDB가 유리하고
 *   까다로운 조건으로 데이터를 필터링해야 하거나 ACID 특성을 지켜야 한다면 RDBMS가 더 유리할 수 있다.
 *
 * **ACID란?
 * - 원자성(Atomicity), 일관성(Consistency), 고립성(Isolation), 지속성(Durability)의 앞 글자를 따서 만든 용어로, 데이터베이스 트랜잭션이 안전하게 처리되는 것을 보장하기 위한
 *   성질을 의미한다.
 *
 * MongoDB의 문서란?
 * - '문서(document)'는 RDBMS의 레코드(record)와 개념이 비슷하다. 문서의 데이터 구조는 한 개 이상의 키-값 쌍으로 되어 있다.
 * - 문서는 BSON(바이너리 형태의 JSON) 형태로 저장된다. 그렇기 때문에 나중에 JSON 형태의 객체를 데이터베이스에 저장할 때, 큰 공수를 들이지 않고도 데이터를 데이터베이스에 등록할 수 있다.
 * - 새로운 문서를 만들면 _id 라는 고윳값을 자동으로 생성하는데, 이 값은 시간, 머신 아이디, 프로세스 아이디, 순차 번호로 되어 있어 값의 고유함을 보장한다.
 * - 여러 문서가 들어 있는 곳은 '컬렉션' 이라고 한다.
 *
 * MongoDB의 구조
 * - MongoDB는 서버 하나에 데이터베이스를 여러 개 가지고 있을 수 있다. 각 데이터베이스에는 여러 개의 컬렉션이 있으며, 컬렉션 내부에는 문서들이 들어 있다.
 *
 * 스키마 디자인
 * - MongoDB에서 스키마를 디자인하는 방식은 기존 RDBMS에서 스키마를 디자인하는 방식과 다르다. RDBMS에서 블로그용 데이터 스키마를 설계한다면 각 포스트, 댓글마다 테이블을 만들어
 * 필요에 따라 JOIN해서 사용하는 것이 일반적이지만 NoSQL에서는 그냥 모든 것을 문서 하나에 넣는다. 또한 문서 내부에 또 다른 문서가 위치할 수 있는데 이를 서브다큐먼트(subDocument)라고 한다.
 *
 * - 문서 하나에는 최대 16MB만큼 데이터를 넣을 수 있다. => 서브다큐먼트에서 이 용량을 초과할 가능성이 있다면 컬렉션을 분리시키는 것이 좋다.
 *
 * =================================================================
 *
 * mongoose & dotenv
 * - mongoose는 Node.js 환경에서 사용하는 MongoDB 기반 ODM(Object Data Modelling) 라이브러리 이다. => 데이터베이스 문서들을 자바스크립트 객체처럼 사용할 수 있게 해준다.
 * - dotenv는 환경변수들을 파일에 넣고 사용할 수 있게 하는 개발 도구이다. => MongoDb에 접속할 때, 서버에 주소나 계정 및 비밀번호가 필요할 경우가 있는데 민감하거나 환경별로
 *   달라질 수 있는 값은 코드 안에 직접 작성하지 않고, 환경변수로 설정해야한다. (.gitignore 파일 작성하여 환경변수가 들어 있는 파일은 제외시켜야 한다.)
 *
 * =================================================================
 *
 *
 * 데이터베이스의 스키마와 모델
 * - mongoose에는 스키마(schema)와 모델(model) 이라는 개념이 있는데, 이 둘은 혼동하기 쉽다.
 * 스키마는 컬렉션에 들어가는 문서 내부의 각 필드가 어떤 형식으로 되어 있는지 정의하는 객체이고
 * 모델은 스키마를 사용하여 만드는 인스턴스로, 데이터베이스에서 실제 작업을 처리할 수 있는 함수들을 지니고 있는 객체이다.
 *
 * 1. 스키마 생성
 * - 모델을 만들려면 사전에 스키마를 만들어 주어야 한다. 스키마를 만들 때는 mongoose 모듈의 Schema를 사용하여 정의한다. 그리고 각 필드 이름과 필드의 데이터 타입 정보가 들어있는
 * 객체를 작성한다. 필드의 기본값으로는 default값을 설정해 주면 된다. 또한 스키마 내부에 다른 스키마를 내장시켜 배열형태로 만들 수도 있다.
 *
 * 2. 모델 생성
 * - 모델을 만들 때는 mongoose.model 함수를 사용한다. 모델 인스턴스를 만들면 export default를 통해 내보내 주는데 여기서 사용한 model() 함수는 기본적으로 두 개의 파라미터가
 * 필요하다. 첫 번째 파라미터는 스키마 이름이고, 두 번째 파라미터는 스키마 객체이다. (데이터베이스는 스키마 이름을 정해 주면 그 이름의 복수 형태로 데이터베이스에 컬렉션 이름을 만든다.)
 *
 * MongoDB Schema에서 기본적으로 지원하는 타입은 아래와 같다
 * 1. String : 문자열
 * 2. Number : 숫자
 * 3. Date : 날짜
 * 4. Buffer : 파일을 담을 수 있는 버퍼
 * 5. Boolean : true 또는 fasle 값
 * 6. Mixed(Schema.Types.Mixed) : 어떤 데이터도 넣을 수 있는 형식
 * 7. ObjectId(Schema.Types.ObjectId) : 객체 아이디, 주로 다른 객체를 참조할 때 넣음
 * 8. Array : 배열 형태의 값으로 []로 감싸서 사용
 *
 * 데이터 생성과 조회
 *
 * 1. 데이터 생성
 *
 * - 인스턴스를 만들 때는 new 키워드를 사용한다. 그리고 생성자 함수의 파라미터에 정보를 지닌 객체를 넣는다.
 *   인스턴스를 만들었다고해서 바로 데이터 베이스에 저장되는 것이 아니다. save() 함수를 실행시켜야 비로소 데이터베이스에 저장된다.
 *   이 함수의 반환 값은 Promise 이므로 async/await 문법으로 데이터베이스 저장 요청을 완료할 때까지 await를 사용하여 대기할 수 있다. 또한 await를 사용할 때는
 *   try/catch 문으로 오류를 처리해야 한다.
 *
 * 2. 데이터 조회
 * - 데이터를 조회할 때는 모델 인스턴스의 find() 함수를 사용한다. find() 함수를 호출한 후에는 exec()를 붙여 주어야 서버에 쿼리를 요청한다. 데이터를 조회할 때 특정
 *   조건을 설정하고, 불러오는 제한도 설정할 수 있다.
 *
 * 3. 특정 데이터 조회
 * - 특정 데이터를 조회할 때는 findById() 함수를 사용한다.(이 프로젝트에서는 Id 로 조회한다.)
 *
 * 데이터 삭제와 수정
 *
 * 1. 데이터 삭제
 * - 데이터를 삭제할 때는 여러 종류의 함수를 사용할 수 있다.
 *      1) remove() : 특정 조건을 만족하는 데이터를 모두 지운다.
 *      2) findByAndRemove() : id를 찾아서 지운다.
 *      3) findOneAndRemove() : 특정 조건을 만족하는 데이터 하나를 찾아서 제거한다.
 *
 * 2. 데이터 수정
 * - 데이터를 업데이트할 때는 findByIdAndUpdate() 함수를 사용한다. 이 함수를 사용할 때는 세 가지 파라미터를 넣어 주어야 한다.
 *   첫 번째 파라미터는 id, 두 번째 파라미터는 업데이트 내용, 세 번째 파라미터는 업데이트의 옵션이다.
 */