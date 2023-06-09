---
title: "TRANSACTION"
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
**반복 가능하지 않은 조회 ( NON-REPEATABLE READ )** - **한 트랜잭션 내의 같은 행에 두 번 이상 조회했는데 그 값이 다른 경우**.

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
9번 **오른쪽은 내가 선택한게 아닌데 → 업데이트 됨** 이런 것을 팬텀리드라고 한다.  


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
- https://www.postgresql.kr/blog/pg_phantom_read.html

### SERIALIZATION
말 그대로 직렬화해서 트랜잭션을 순차적으로 처리한다는 것  
무조건 락을 획득해야하며, 모든 read 는 sharable lock 개념으로 적용된다.
동시성의 이슈에서 자유로워지지만, 동시에 성능이 매우 저하되어서 현업에서는 잘 사용하지 않는다.  