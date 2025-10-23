# Graduation-Project


## 🚀 프로젝트 실행 방법

### 1\. 사전 요구 사항

  * Java 17 (JDK)
  * Node.js (v18 이상)
  * MySQL
  * Docker (Qdrant를 가장 쉽게 실행하는 방법)
  * OpenAI API Key

### 2\. 서비스 실행

#### 1\) DB - Qdrant (Vector DB) 실행

Docker를 사용하여 Qdrant 서버를 실행합니다.

```bash
docker pull qdrant/qdrant
docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant
```

  * `6333`: gRPC 포트 (Spring AI가 사용)
  * `6334`: 웹 UI 및 REST API 포트

#### 2\) DB - MySQL 실행

로컬 환경에 MySQL 서버를 실행하고, RDBMS 스키마를 생성합니다. (예: `club_platform` 데이터베이스 생성)

```sql
CREATE DATABASE club_platform;
```

#### 3\) Backend (Spring Boot) 실행

1.  백엔드 디렉토리로 이동합니다.

2.  `src/main/resources/application.properties` 파일로 이동합니다.

    ```properties
    spring.application.name=backend
    
    # MySQL 설정 (개발 환경 기준)
    spring.datasource.url=jdbc:mysql://localhost:3306/club_platform
    spring.datasource.username=YOUR_MYSQL_USERNAME
    spring.datasource.password=YOUR_MYSQL_PASSWORD
    spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

    spring.jpa.hibernate.ddl-auto=update
    spring.jpa.properties.hibernate.show_sql=true
    spring.jpa.show-sql=true
    spring.jackson.serialization.fail-on-empty-beans=false
    
    # Qdrant 설정 (REST API 포트 6334 사용)
    spring.ai.vectorstore.qdrant.host=localhost
    spring.ai.vectorstore.qdrant.port=6334
    spring.ai.vectorstore.qdrant.collection-name=documents
    spring.ai.vectorstore.qdrant.initialize-schema=true
    
    # OpenAI API Key 설정
    # 실제 키를 여기에 입력하거나, 환경 변수로 설정해야 합니다.
    spring.ai.openai.api-key=YOUR_OPENAI_API_KEY
    
    # OpenAI 모델 설정 (LLM 및 Embedding)
    spring.ai.openai.chat.options.model=gpt-4o
    spring.ai.openai.embedding.enabled=true
    spring.ai.openai.embedding.model=text-embedding-3-small
    ```

3.  애플리케이션을 실행합니다. (IDE 또는 Gradle 사용)

    ```bash
    # Gradle 사용 시
    ./gradlew bootRun


#### 4\) Frontend (React) 실행

1.  프론트엔드 디렉토리로 이동합니다.
2.  필요한 패키지를 설치합니다.
    ```bash
    npm install
    ```
3.  개발 서버를 실행합니다.
    ```bash
    npm run dev
    ```
