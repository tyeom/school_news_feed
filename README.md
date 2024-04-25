## School News Feed
학교 뉴스 피드 구독 백앤드 구현 (Node.js Express)<br/>
School News Feed Subscription Backend Implementation (Node.js Express)

***

<br/>

🛠️ Development Env
-
- IDE : Visual Source Code
- Language : Javascript (Node.js)
- Platform : Node.js v21.7.3
- Databse : MongoDB

```
MongoDB가 설치되어 있어야 합니다. (You must have MongoDB installed.)
https://www.mongodb.com
```

Manual Installation
-

Clone the repo:
```
git clone https://github.com/tyeom/school_news_feed.git
cd school_news_feed
```

Set the environment variables:
```
# open .env and modify the environment variables
```

Commands
-
Package install:
```
npm install
```

Running in development:
```
npm run start
```

Running in production:
```
# build
npm run build
```

Environment Variables
-
The environment variables can be found and modified in the .env file.
```
# App name
APP_NAME = school_news_feed

# Host
HOST = 127.0.0.1
# Port
PORT = 777

# URL of the Mongo DB
DATABASE_URI = mongodb://127.0.0.1:27017/school_news_feed

# JWT
JWT_ACCESS_TOKEN_SECRET = ByYM000OLlMQG6VVVp1OH7Xzyr7gHuw1qvUC5dcGt3SDQ
# Token expires
JWT_ACCESS_TOKEN_EXPIRATION_MINUTES = 500
```

Project Structure
-
```
src\
 |--config\         # Environment variables and configuration
 |--controllers\    # Controllers
 |--enums\          # Enum object
 |--helpers\        # Helper classes and functions
 |--middlewares\    # Custom express middlewares
 |--models\         # Mongoose models
 |--mongoPlugin\    # Mongoose model class plugin (ToJson, Paginate)
 |--routes\         # Routes
 |--services\       # Business logic
 |--validations\    # Request data validation schemas
 |--index.js        # App entry point
```

Refer to APIs specification description
-
- [API Endpoints (link : Notion)](https://arooong.notion.site/API-cd65a7f7c2e54bd69bacfa9b6fd3422c?pvs=4)

✅ Features
-

``인증 관련``
- [x] 회원가입
- [x] 로그인 / 로그아웃

``관리자``
- [x] 학교 생성
- [x] 학교 정보 수정
- [x] 학교 정보 조회
- [x] 학교 검색
- [x] 학교 삭제
- [x] 학교 소식 생성
- [x] 학교 소식 조회
- [x] 학교별 소식 조회
- [x] 학교 소식 수정
- [x] 학교 소식 삭제

``구독``
- [x] 학교 구독
- [x] 학교 구독 취소
- [x] 구독중인 학교 정보 조회
- [x] 학교별 소식 정보 조회 (구독을 취소해도 기존 소식 정보는 유지)
