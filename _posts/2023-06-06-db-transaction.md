---
title: "[MYSQL] TRANSACTION & LOCK"
layout: post
date: 2023-06-01 00:00
headerImage: false
tag:
- database
category: blog
author: sean
description: description is empty
---
## TRANSACTION
기본적으로 Transaction 정합성을 위해서 사용되고, Lock 은 동시성을 위해서 사용된다.  
트랜잭션은 데이터베이스에서 하나의 논리적 기능을 수행하기 위한 작업의 단위를 말하며 데이터베이스에 접근하는 방법은 쿼리이므로, 즉 여러 개의 쿼리들을 하나로 묶는 단위를 말한다.  
기본적으로 A.C.I.D 속성을 가지고 있어야 한다.

- Atomic (원자성) - 관련된 일이 모두 수행되거나 수행되지 않았음을 보장.
- Consitency (일관성) - 허용된 방식으로 데이터를 변경해야한다는 것. 즉 특정한 방식을 통해서만 조작되어야 한다.
- Isolation (격리성) - 트랜잭션 수행 시 서로 끼어들지 못한다는 것.
- Durability (지속성) - 성공적으로 반영된 트랜잭션은 영원히 반영되어야한다는 것.

ISOLATION LEVEL 은 다음과 같이 네 종류로 나뉜다.
1. READ UNCOMMITTED
2. READ COMMITTED
3. REPEATABLE READ
4. TRANSACTIONAL


|                  | DIRTY READ | NON REPEATABLE READ | PAHNTOM READ |
|------------------|------------|---------------------|--------------|
| READ UNCOMMITTED | YES        | YES                 | YES          |
| READ COMMITTED   | NO         | YES                 | YES          |
| REPEATABLE READ  | NO         | NO                  | YES          |
| TRANSACTIONAL    | NO         | NO                  | YES          |

### READ UNCOMMITTED - DIRTY READ
**더티 리드 ( DIRTY READ )** - 한 트랜잭션이 수행중일 때 다른 트랜잭션이 Commit 하지 않은 값을 읽을 수 있다는 것.  
**반복 가능하지 않은 조회 ( NON-REPEATABLE READ )** - 한 트랜잭션 내의 같은 행에 두 번 이상 조회했는데 그 값이 다른 경우.

|   | Transaction A                                     | Transaction B                                     |
|---|---------------------------------------------------|---------------------------------------------------|
| 1 | SET TRANSACTION ISOLATION LEVEL read uncommitted; | SET TRANSACTION ISOLATION LEVEL read uncommitted; |
| 2 | begin;                                            |                                                   |
| 3 | select * from test;                               |                                                   |
| 4 |                                                   | begin;                                            |
| 5 |                                                   | select * from test;                               |
| 6 | update test set amount = 155 where id = 6;        |                                                   |
| 7 |                                                   | _**select * from test where id = 6;**_              |
| 8 | rollback;                                         |                                                   |
| 9 |                                                   | **select * from test where id = 6;**              |

아직 commit 되지 않은 값임에도 불구하고 다른 Transaction 에서 해당 값이 공유되어서 읽을 수 있게되는 현상
Transaction B 의 7번 라인에서 Transaction A 에서 [아직 커밋되지 않은] 수정된 amount 155의 값을 확인할 수 있다.


### REPEATABLE READ - EXAMPLE
하나의 트랜잭션이 수정한 행을 다른 트랜잭션이 수정할 수 없도록 막아준다. 그러나 새로운 행을 추가하는 것은 막지 않는다. 따라서 이후에 추가된 행이 발견될 수도 있다.

|    | Transaction A                                     |                   Transaction B                   |
|----|---------------------------------------------------|---------------------------------------------------|
| 1  | SET TRANSACTION ISOLATION LEVEL repeatable read;  | SET TRANSACTION ISOLATION LEVEL repeatable read;  |
| 2  | begin;                                            |                                                   |
| 3  | select * for table;                               |                                                   |
| 4  |                                                   | begin                                             |
| 5  |                                                   | select * from table;                              |
| 6  | update table set amount = 100 where id = 1;       |                                                   |
| 7  |                                                   | select * from table where id = 1;                 |
| 8  | commit;                                           |                                                   |
| 9  |                                                   | select * from where id = 1;                       |
| 10 |                                                   | commit;                                           |
| 11 |                                                   | select * from table where id = 1;                 |

8번 라인에서 Transaction A 에서 commit 된 id = 1 의 amount 100 은 Transaction B 안에서는 7번라인과 9번 라인에서 동일하다.   
Transaction 이 종료된 시점인 11번 라인에서는 Transaction A 에 의해서 변경된 값으로 보인다.  
기본적으로 자기가 수행하고 있는 트랜잭션 내에서 다른 트랜잭션을 변경된 것에 영향을 받고 싶지 않음. 트랜잭션 시작하면 Temporary 로 값 저장해두고 돌려준다.  
기본 적으로 행에 대한 값을 저장해두는 것

---
### REPEATABLE READ - PHANTOM READ 1
**팬텀 리드 ( PHANTOM READ )** - **한 트랜잭션 내에서 동일한 쿼리를 보냈는데 조회 결과가 다른 경우**를 의미한다.

|    | Transaction A                                    | Transaction B                                    |
|----|--------------------------------------------------|--------------------------------------------------|
| 1  | SET TRANSACITON ISOLATION LEVEL repeatable read; | SET TRANSACITON ISOLATION LEVEL repeatable read; |
| 2  | begin;                                           |                                                  |
| 3  | select * from table;                             |                                                  |
| 4  |                                                  | begin;                                           |
| 5  |                                                  | select * from table;                             |
| 6  | insert into table values ("hello", "world");     |                                                  |
| 7  |                                                  | update table set x = "bye" and y = "world";      |
| 8  | commit;                                          |                                                  |
| 9  |                                                  | select * from table;                             |
| 10 |                                                  | rollback;                                        |


6번에서 왼쪽이 락잡고 있음. 그래서 7번 update 가 바로 적용되지 않고 lock 을 기다리고 있다.  
8 번 Trnsaction A가 락을 해제한다. ( 데이터베이스에서의 락(Lock)은 트랜잭션이 완료될 때 해제. 해당 트랜잭션이 커밋되거나 롤백되면 락이 해제).   
7 번 업데이트 된다  
9번 **오른쪽은 내가 선택한게 아닌데 → 업데이트 됨** 이런 것을 *팬텀리드*라고 한다.  


### REPEATABLE READ - PHANTOM READ 2

|    | Transaction A                                    | Transaction B                                    |
|----|--------------------------------------------------|--------------------------------------------------|
| 1  | SET TRANSACITON ISOLATION LEVEL repeatable read; | SET TRANSACITON ISOLATION LEVEL repeatable read; |
| 2  | begin;                                           |                                                  |
| 3  | select * from table;                             |                                                  |
| 4  |                                                  | begin;                                           |
| 5  |                                                  | select * from table;                             |
| 6  | delete from table where id = 1;                  |                                                  |
| 7  | commit;                                          |                                                  |
| 8  |                                                  | update table set x = 1 where id = 1;             |
| 9  |                                                  | select * from table;                             |
| 10 |                                                  | commit;                                          |
| 11 |                                                  | select * from table;                             |

6번 Transaction A 가 id = 1 을 지우고 커밋해버림
8번 Transaction B 가 Transaction A 에서 지워진 row 를 업데이트 하고자 함.
8번 에러가 안뜨고 0 row 가 처리됨 ( 오류가 아니라 처리 되었다고 함 )
9번 Transaction B에서는 id = 1 이 있는 것 처럼 보이고, 업데이트가 된 것 처럼 보인다. ( Repeatable Read 상태임 )
11번 트렌젝션이 끝나면 사라져버림   

참고로 PostgreSQL 에서는 Phantom read 현상이 발생하지 않는다. 
- [https://www.postgresql.kr/blog/pg_phantom_read.html](https://www.postgresql.kr/blog/pg_phantom_read.html)

### SERIALIZATION
말 그대로 직렬화해서 트랜잭션을 순차적으로 처리한다는 것  
무조건 락을 획득해야하며, 모든 read 는 sharable lock 개념으로 적용된다.
동시성의 이슈에서 자유로워지지만, 동시에 성능이 매우 저하되어서 현업에서는 잘 사용하지 않는다.  

---

## LOCK

Lock 은 데이터에 동시 엑세스를 제어하는 데 사용되는 메커니즘으로, 여러 트랜젝션이 동일한 데이터를 동시에 수정하지 못하게 함으로써 데이터의 일관성과 무결성을 보장한다.  
mysql 은 dbengine 을 여러개 쓸 수 있어서 여러개 락이 있음

### Shared Lock vs Exclusive Lock
**Shared lock (공유 잠금):**
공유 잠금은 다른 트랜잭션에서도 읽기 작업을 수행할 수 있도록 허용하는 잠금 유형입니다. 즉, 여러 트랜잭션이 동일한 자원에 대한 읽기 작업을 동시에 수행할 수 있습니다. 공유 잠금은 동시성을 향상시키는 데 사용될 수 있습니다.

**Exclusive lock (배타적 잠금):**
배타적 잠금은 트랜잭션이 자원에 대한 배타적인 접근을 가지도록 하는 잠금 유형입니다. 다른 트랜잭션이 동일한 자원에 접근하려고 할 때 충돌을 방지하기 위해 잠금이 설정됩니다. 배타적 잠금이 설정된 자원은 다른 트랜잭션에서 읽거나 수정할 수 없습니다.

**Blocking (블로킹):**
베타 잠금으로 인한 경합이 발생해 트랜잭션 작업을 진행하지 못하는 상태를 의미한다. 선점한 트랜잭션이 COMMIT 되거나 ROLLBACK되어야 진행이 가능하다.

### MySQL Engine Lock 
1. Table Lock:
    - 테이블 락(Table Lock)은 데이터베이스에서 특정 테이블에 대한 잠금을 설정하는 것을 의미합니다.
    - 테이블 락은 다른 사용자들이 해당 테이블에 대한 읽기 또는 쓰기 작업을 수행하지 못하도록 차단합니다.
    - 테이블 락은 일반적으로 테이블 단위로 설정되며, 락이 설정된 테이블에 대한 작업은 락이 해제될 때까지 대기해야 합니다.
    - `LOCK TABLES table_name [READ|WRITE]` 명령을 통해서 테이블을 잠글 수 있습니다. 
    - `Full Table Scan` 데이터베이스에서 특정 테이블의 모든 레코드를 검색하는 작업을 말합니다.
        - Full Table Scan을 수행하는 동안 데이터베이스는 해당 테이블에 대한 읽기 잠금을 설정할 수 있습니다.
        - Full Table Scan은 테이블의 크기와 인덱스의 존재 여부에 따라 성능에 영향을 줄 수 있으므로 주의가 필요합니다.
    - `Analyze Table`: MySQL에서 사용되는 문법입니다. 이를 통해 데이터베이스 엔진은 테이블의 통계 정보를 분석하고 업데이트할 수 있습니다.
        - `ANALYZE TABLE`을 실행하면 테이블에 대한 읽기 잠금이 설정될 수 있습니다. 이는 테이블 통계 정보를 업데이트하는 동안 다른 작업이 차단될 수 있음을 의미합니다.
2. Metadata Lock:
    - 메타데이터 락(Metadata Lock)은 데이터베이스 객체(테이블, 인덱스, 뷰 등)의 정의와 속성 정보를 보호하기 위해 사용되는 잠금입니다.
    - 메타데이터 락은 다른 사용자들이 동일한 메타데이터에 대한 변경 작업을 동시에 수행하지 못하도록 차단합니다.
    - 예를 들어, 테이블의 스키마를 수정하는 경우 해당 테이블에 대한 메타데이터 락이 설정되어 다른 사용자가 동시에 스키마를 변경하는 것을 방지합니다.
    - 메타데이터 락은 데이터 정합성을 유지하고 충돌을 방지하기 위해 사용됩니다.
3. Named Lock:
    - Named Lock은 데이터베이스에서 사용자가 지정한 이름으로 잠금을 설정하는 것을 의미합니다.
    - Named Lock은 사용자가 임의의 이름을 정의하여 해당 잠금을 설정하고 해제할 수 있는 유연한 방식의 잠금입니다.
    - 예를 들어, 여러 스레드 또는 프로세스가 공유 자원에 접근하기 전에 해당 자원에 대한 특정 이름의 잠금을 획득하도록 할 수 있습니다.
    - Named Lock은 사용자가 임의의 로직에 따라 잠금을 설정하고 해제할 때 유용합니다.
    - `SELECT GET_LOCK('lock', 2);` - lock 이라는 문자열에 대해 잠금을 획득하고, 이미 잠금을 사용 중이면 2초 동안 대기한다.  성공 시 1,
    - `SELECT IS_FREE_LOCK('lock');` lock 이라는 문자열에 대해 잠금이 설정되어 있는지 확인 걸려있으면 0, 걸려있지 않으면 1
    - `SELECT RELEASE_LOCK('lock');` lock 이라는 문자열에 대해 잠금 해제 성공 시 1, 실패 시 NULL

### InnoDB Engine Lock

### InnoDB ?
- InnoDB는 MySQL에서 사용되는 관계형 데이터베이스 관리 시스템(RDBMS)의 한 종류인 스토리지 엔진(Storage Engine)입니다.   
- InnoDB 엔진은 트랜잭션 지원, 높은 동시성, 데이터 무결성, 안정성 및 복구 기능 등을 갖춘 기능적으로 완전한 엔진입니다.  

InnoDB 엔진의 특징과 기능은 다음과 같습니다:

1. 트랜잭션 지원: InnoDB는 ACID(원자성, 일관성, 고립성, 지속성) 특성을 준수하며, 트랜잭션을 지원합니다. 이는 데이터 일관성과 안전한 동시성 제어를 보장합니다.
2. 동시성 제어: InnoDB는 다중 사용자 환경에서의 동시성을 관리하기 위한 다양한 기술을 제공합니다. 행 단위 잠금(row-level locking)을 사용하여 동시성을 높이고 충돌을 방지할 수 있습니다.
3. 외래 키 제약 조건: InnoDB는 외래 키(Foreign Key) 제약 조건을 지원하여 데이터 무결성을 강화합니다. 외래 키 관계를 설정하고 무결성 규칙을 강제로 적용할 수 있습니다.
4. 롤백 세그먼트: InnoDB는 트랜잭션 롤백을 위해 롤백 세그먼트를 사용합니다. 이를 통해 롤백 작업이 빠르고 효율적으로 처리됩니다.
5. 데이터 복구: InnoDB는 데이터베이스의 안정성과 복구 기능을 강화하기 위해 로그 기반의 복구 메커니즘을 제공합니다. 이를 통해 시스템 장애 발생 시 데이터의 일관성을 유지하고 복구할 수 있습니다.
6. 크기 조정: InnoDB는 테이블과 인덱스의 크기를 동적으로 조정할 수 있는 기능을 제공합니다. 이는 데이터의 용량 증가 또는 감소에 유연하게 대응할 수 있도록 도와줍니다.

### InnoDB Engine Lock

1. **Row-Level Lock (Shared Lock / Exclusive Lock):**  
    - Row-Level Lock은 특정 행에 대한 잠금을 설정하는 것을 말합니다.
    - Shared Lock은 읽기 작업에 대한 잠금입니다. 다른 트랜잭션이 동일한 행에 대한 읽기 작업을 수행할 수 있지만, 쓰기 작업은 차단됩니다.
    - Exclusive Lock은 쓰기 작업에 대한 잠금입니다. 특정 행에 대한 쓰기 작업을 수행 중인 트랜잭션은 다른 트랜잭션이 동시에 동일한 행에 대한 읽기 및 쓰기 작업을 수행하지 못하도록 차단합니다.  

    ```sql 
    -- https://dev.mysql.com/doc/refman/8.0/en/lock-tables.html
    -- Shared Lock ( 트랜잭션 내에서만 유효하다 )
    SELECT * FROM table_name WHERE column = value LOCK FOR SHARE;
    -- Exclusive Lock ( 트랜잭션 내에서만 유효하다 )
    SELECT * FROM table_name WHERE column = value FOR UPDATE;
    ```

    |   | Transaction A                                            | Transaction B                                   |
    |---|----------------------------------------------------------|-------------------------------------------------|
    | 1 | begin;                                                   | begin;                                          |
    | 2 | select * from table where id between 8 and 12 for share; |                                                 |
    | 3 |                                                          | select * from table where id between 10 and 15; |
    | 4 |                                                          | commit;                                         |
    | 5 | commit;                                                  |                                                 |

    두 트랜젝션에서 Shared Lock 은 Transction B 의 SELECT 에 영향을 주지 못한다. 

    |   | Transaction A                                            | Transaction B                                                |
    |---|----------------------------------------------------------|--------------------------------------------------------------|
    | 1 | begin;                                                   |                                                              |
    | 2 | select * from table where id between 8 and 12 for share; |                                                              |
    | 3 |                                                          | update table set amount=amount+1 where id between 10 and 15; |
    | 4 | commit;                                                  |                                                              |

    Transaction B 에서 DML 을 실행할 경우 Exclusive Lock 을 획득하고자 하므로, 2에서 Shared Lock 이 해제될 때 까지 기다리게 될 것이다.  
    Transaction B 에서 Transaction을 걸지 않았더라도, Auto Commit mode 에서 Update 는 순간적으로 Transaction 을 열고, DML 은 X락을 획득하려고한다.  
    "Auto Commit" 모드에서는 각 SQL 문이 개별적인 트랜잭션으로 처리되며, 각 SQL 문의 실행 후 자동으로 COMMIT이 수행된다.  
    \+ Lock 은 없는 값에 대해서 잡을 수 없다. 즉 between 에서 없는 값은 락이 잡히지 않는다.

2. **Intention Lock (Shared Lock / Exclusive Lock):**  
    - Intention Lock은 특정 테이블에 대한 잠금을 설정하는 것을 나타냅니다.
    - Shared Intention Lock은 다른 트랜잭션이 동일한 테이블의 행에 대한 읽기 잠금을 설정할 수 있지만, 해당 테이블에 대한 쓰기 잠금은 차단됩니다.
    - Exclusive Intention Lock은 다른 트랜잭션이 동일한 테이블에 대한 읽기 및 쓰기 작업을 차단합니다.

    ```sql
    -- https://dev.mysql.com/doc/refman/8.0/en/lock-tables.html
    LOCK TABLES table_name WRITE;
    LOCK TABLES table_name READ;
    ```

3. **Record Lock (Shared Lock / Exclusive Lock):**  
    - Record Lock은 레코드(행)에 대한 잠금을 나타냅니다.
    - Shared Record Lock은 읽기 작업에 대한 잠금으로, 다른 트랜잭션이 동일한 레코드를 읽을 수 있지만, 쓰기 작업은 차단됩니다.
    - Exclusive Record Lock은 쓰기 작업에 대한 잠금으로, 특정 레코드에 대한 쓰기 작업을 수행 중인 트랜잭션은 다른 트랜잭션이 동시에 동일한 레코드에 대한 읽기 및 쓰기 작업을 수행하지 못하도록 차단합니다.
    - 상용 DBMS는 record lock은 record에만 걸린다. MySQL 의 경우 index에 Lock 걸린다. index가 같은값에 대해서는 모두 Lock이 걸린다. ( Index 값이 같은 모든 레코드에 대해서 Lock 이 걸린다.)
    - MySQL 에서 `SELECT * FROM table_name where name 'a' and 'c' and amount = 0` 이라면 
        - Primary key 와 같이 uniqueness 가 보장이 된다면 해당 record 만 lock 을 잡는다.
        - Secondary Key 라면 uniqueness 가 보장되지 않기 때문에 GAP Lock 을 같이 잡는다.
    - 모든 DML 실행 시 Exclusive Lock 이 실행된다.

4. **Gap Lock (Next-Key Lock / Auto-incremental Lock):**  
    - **레코드와 바로 인접한 (존재하는) 레코드 사이의 간격만을 잠그는 것**. 레코드와 레코드 사이의 간격에 새로운 레코드가 생성(INSERT)되는 것을 제어하는 것 
    - Gap Lock은 인덱스 범위 내의 공간(간격)에 대한 잠금을 설정합니다.
    - Next-Key Lock은 레코드와 레코드 사이의 간격을 잠금으로 설정하여 다른 트랜잭션이 해당 간격에 새로운 레코드를 삽입하거나 삭제하는 작업을 차단합니다.
    - Auto-incremental Lock은 자동 증가(auto-increment) 열을 갖는 테이블에서 새로운 값을 할당할 때 해당 값을 잠금으로 설정하여 다른 트랜잭션이 동시에 동일한 값을 할당하는 것을 방지합니다.

    <details>
    <summary> INSERT INTENTION GAP LOCK </summary>
        Secondary index에서 gap lock이 함께 설정되는 이유는 일관성과 격리 수준을 유지하기 위해서입니다. Gap lock은 인덱스 범위 내의 공간(간격)에 대한 잠금을 설정합니다.<br>
        Secondary index는 인덱스 자체와 실제 데이터 레코드 간에 격차(gap)가 발생할 수 있습니다. 이러한 격차에는 새로운 인덱스 값이 삽입될 수 있는 위치가 포함됩니다.<br>
		<br>
        예를 들어, Secondary index에 다음과 같은 값들이 있다고 가정해 봅시다: 10, 20, 30. 이 때, 10과 20 사이에는 격차가 존재합니다. Secondary index의 공간은 실제 데이터 레코드에 대응하지 않는 것이기 때문에 이러한 격차에 대한 잠금이 필요합니다.<br>
		<br>
        Gap lock은 다른 트랜잭션이 해당 격차에 새로운 값을 삽입하거나 삭제하는 작업을 방지하기 위해 설정됩니다. 따라서 Secondary index에서는 next-key lock(레코드 락 + gap lock)이 설정되어 인덱스 레코드와 그 전후의 격차를 동시에 잠그는 것입니다.<br>
		<br>
        이렇게 함으로써 두 개의 트랜잭션이 동시에 동일한 인덱스 범위 내에 새로운 값을 삽입하려고 시도하면, 격차 락(gap lock)에 의해 한 트랜잭션이 대기 상태에 들어가게 됩니다. 이는 격리 수준을 유지하고 삽입 충돌을 방지하기 위한 메커니즘이며, 데이터 일관성과 무결성을 보장하기 위해 필요한 잠금입니다.<br>
		<br>
        Gap lock은 Secondary index에서 주로 사용되며, 데이터의 일관성과 동시성을 보장하기 위한 중요한 동시성 제어 메커니즘 중 하나입니다.<br>
		<br>
        Secondary Index의 Gap Lock은 인덱스 범위 내의 격차(gap)에 대한 잠금을 설정합니다. 이 격차는 실제 데이터 레코드와 인덱스 레코드 사이에 존재하는 공간을 의미합니다.<br>
		<br>
        Gap Lock은 다음과 같은 범위에 적용됩니다:<br>
		<br>
        1. 인덱스 레코드와 그 이전의 실제 데이터 레코드 사이의 격차 (preceding gap):<br>
        - 인덱스 레코드보다 작은 값을 가진 실제 데이터 레코드의 후속 격차<br>
		<br>
        2. 인덱스 레코드와 그 이후의 실제 데이터 레코드 사이의 격차 (following gap):<br>
        - 인덱스 레코드보다 큰 값을 가진 실제 데이터 레코드의 선행 격차<br>
		<br>
        즉, Gap Lock은 Secondary Index에서 인덱스 레코드와 그 이전 또는 이후의 실제 데이터 레코드 사이에 있는 격차를 잠그는 역할을 합니다. 이를 통해 다른 트랜잭션이 해당 격차에 새로운 값을 삽입하거나 삭제하는 작업을 방지합니다.<br>
		<br>
        예를 들어, Secondary Index에 다음과 같은 값들이 있다고 가정해 봅시다: 10, 20, 30. 이 때, 10과 20 사이에는 격차가 존재합니다. Gap Lock은 이러한 격차에 대한 잠금을 설정하여 다른 트랜잭션이 해당 격차에 새로운 값을 삽입하거나 삭제하는 것을 방지합니다.<br>
		<br>
        Gap Lock은 인덱스 범위 내의 격차에 대해서만 설정되며, 인덱스 레코드와 그 전후의 격차를 동시에 잠그는 역할을 합니다. 이는 데이터의 일관성과 동시성을 보장하기 위한 중요한 동시성 제어 메커니즘입니다.<br>
		<br>
        -> B-tree 와 같은 데이터 구현 형식 때문에 앞 뒤로 Lock 을 생겼나보다.<br>

    </details>
    <br/>

5. **Next-Key Lock:**  
   - Record Lock + Gap Lock ( 자기 자신을 포함하는 Lock )
   - Next-Key Lock은 레코드와 레코드 사이의 간격을 잠그는 방식입니다.
   - 이 락은 인덱스 범위 스캔(index range scan)에서 사용됩니다.
   - Next-Key Lock은 Record Lock과 Gap Lock을 함께 사용하여 인덱스 범위 내의 간격에 대한 잠금을 설정합니다.
   - Next-Key Lock은 레코드 자체와 간격을 동시에 잠그기 때문에 다른 트랜잭션이 해당 간격에 새로운 레코드를 삽입하거나 삭제하는 작업을 방지합니다.

6. **Auto-increment Lock**:  
   - Auto-increment Lock은 자동 증가(auto-increment) 열을 갖는 테이블에서 새로운 값을 할당할 때 해당 값을 잠그는 방식입니다.
   - 이 락은 동시에 여러 트랜잭션이 자동 증가 열에 대한 값을 할당하는 것을 방지합니다.
   - Auto-increment Lock은 값을 할당하는 트랜잭션이 커밋되거나 롤백할 때까지 유지되며, 다른 트랜잭션들은 해당 값을 참조할 수 없습니다.
   - 이를 통해 각 트랜잭션이 고유한 자동 증가 값을 얻을 수 있게 됩니다.


### 인덱스와 잠금

```sql
UPDATE t SET c='col' WHERE A AND B
```

위 SQL문에서 A조건을 만족하는 레코드는 250개 B를 만족하는 조건은 1개라고 가정하자.   
인덱스로 이용할 수 있는 칼럼이 A조건일 때, 해당 SQL문은 인덱스 리프 노드를 통해 250개의 레코드만 탐색하면서 B조건을 만족하는 칼럼을 찾아 총 250개의 레코드가 잠기게 된다.   
**만약 테이블에 인덱스가 하나도 없다면, UPDATE는 풀 스캔을 하면서 모든 레코드를 잠그게 된다.** 이것이 인덱스 설계가 중요한 이유다.  

## Ref
- 매스프레소 내부 DB 세미나 자료
- https://dev.mysql.com/doc/refman/8.0/en/innodb-locking.html
- https://velog.io/@fortice/MySQL-트랜잭션-잠금Lock
- https://medium.com/daangn/mysql-gap-lock-다시보기-7f47ea3f68bc


# [노트] 정리하고 이해 안된 것들
- Transaction 이 시작되면 DML 에서 자동으로 Lock 을 잡는데 굳이 Intention Lock 왜 잡는지 모르겠다.
- Transaction Isolation Level 과 Lock 을 잡는 수준에 차이가 있나보다.
    - READ COMMITTED / REPEATABLE READ 각각에 대해서 같은 DML 인데 락 수준이 다른 예제를 봤다. 
- GAP LOCK 을 잡는 이유는 Index 의 무결성 ? 일관성 ? 때문이라는데 제대로 이해가 안된다.
    - https://medium.com/daangn/mysql-gap-lock-다시보기-7f47ea3f68bc 도움이 많이 된다. 
- Index 가 없는 경우 Lock 이 잡히는 범위 -> 테이블 전체
- MYSQL 공식 문서에서 여기 구문 이해가 안간다. S-lock 잡혔는데 왜 X-Lock 가능한거지 ? It is also worth noting here that conflicting locks can be held on a gap by different transactions. For example, transaction A can hold a shared gap lock (gap S-lock) on a gap while transaction B holds an exclusive gap lock (gap X-lock) on the same gap. The reason conflicting gap locks are allowed is that if a record is purged from an index, the gap locks held on the record by different transactions must be merged.
