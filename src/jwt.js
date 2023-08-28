/**
 * JWT의 이해
 *
 * - JWT는 JSON Web Token의 약자로, 데이터가 JSON으로 이루어져 있는 토큰을 의미한다. 두 개체가 서로 안전하게 정보를 주고받을 수 있도록 웹 표준으로 정의된 기술이다.
 *
 * 1. 세션 기반 인증과 토큰 기반 인증의 차이
 * - 사용자의 로그인 상태를 서버에서 처리하는 데 사용할 수 있는 대표적인 두 가지 인증 방식이 있다.
 *
 *  1) 세션 기반 : 서버가 사용자가 로그인 중임을 기억하고 있다는 뜻
 * - 세션 기반 인증 시스템에서 사용자가 로그인을 하면, 서버는 세션 저장소에 사용자의 정보를 조회하고 세션 id를 발급한다. 발급된 id는 주로 브라우저의 쿠키에 저장한다.
 *   그다음에 사용자가 다른 요청을 보낼 때마다 서버는 세션 저장소에서 세션 저장소에서 세션을 조회한 후 로그인 여부를 결정하여 작업을 처리하고 응답한다. (세션 저장소는 주로
 *   메모리, 디스크, 데이터베이스 등을 사용한다.)
 *
 * - 단점 : 서버를 확장하기가 까다롭다. => 서버의 인스턴스가 여러 개가 된다면, 모든 서버끼리 같은 세션을 공유해야 하므로 세션 전용 데이터베이스를 만들어야 할 뿐 아니라
 *          신경 써야 할 것도 많아진다.
 *
 *  2) 토큰 기반
 * - 토큰은 로그인 이후 서버가 만들어 주는 문자열이다. 해당 문자열 안에는 사용자의 로그인 정보가 들어 있고, 해당 정보가 서버에서 발급되었음을 증명하는 서명이 들어있다.
 *   서명 데이터는 해싱 알고리즘을 통해 만들어지는데, 주로 HMAC SHA256 혹은 RSA SHA256 알고리즘이 사용된다.
 *
 * - 서버에서 만들어 준 토큰은 서명이 있기 때문에 무결성이 보장된다. (무결성 : 정보가 변경되거나 위조되지 않았음을 의미하는 성질) 사용자가 로그인을 하면 서버에서
 *   사용자에게 해당 사용자의 정보를 지니고 있는 토큰을 발급해 주고, 추후 사용자가 다른 API를 요청하게 될 때 발급받은 토큰과 함께 요청하게 된다. 그러면 서버는 해당 토큰이
 *   유효한지 검사하고, 결과에 따라 작업을 처리하고 응답한다.
 *
 * - 장점 : 서버에서 사용자 로그인 정보를 기억하기 위해 사용하는 리소스가 적다. 사용자 쪽에서 로그인 상태를 지닌 토큰을 가지고 있으므로 서버의 확장성이 높다.
 *          => 서버 인스턴스가 여러 개로 늘어나도 서버끼리 사용자의 로그인 상태를 공유하고 있을 필요가 없다.
 *
 *
 * Token 사용법
 * 1. localStorage 또는 sessionStorage 사용 => 사용하기 편리하고 구현도 쉽지만 악성 스크립트 삽입(XSS(Cross Site Scripting))에 취약함
 * 2. 브라우저 쿠키 사용 => 탈취에 역시나 취약하나 httpOnlt 속성을 활성화하면 자바스크립트를 통해 쿠키를 조회할 수 없으므로 악성 스크립트로부터 안전하다.
 *                        대신 CSRF(Cross Site Request Forgery) 공격에 취약해질 수 있다. 이 공격은 토큰을 쿠키에 담으면 사용자가 서버로 요청을 할 때마다 무조건
 *                        토큰이 함께 전달되는 점을 이용해서 사용자가 모르게 원하지 않는 API 요청을 하게 만든다. (글 작성 및 삭제, 또는 탈퇴)
 *
 * ** 단, CSRF는 CSRF 토큰 사용 및 Refer 검증 등의 방식으로 제대로 막을 수 있는 반면, XSS는 보안장치를 적용해 놓아도 개발자가 놓칠 수 있는 다양한 취약점을 통해 공격을 받을 수
 *    있다.
 *
 *
 */