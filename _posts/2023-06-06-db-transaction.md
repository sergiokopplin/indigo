---
title: "Transaction"
layout: post
date: 2023-06-01 00:00
headerImage: false
tag:
- database
category: blog
author: sean
description: description is empty
---

기본적으로 Transaction 정합성을 위해서 사용되고, Lock 은 동시성을 위해서 사용된다.

# Transaction

Isolation level 은 다음과 같이 네 종류로 나뉜다.
1. READ UNCOMMITTED
2. READ COMMITTED
3. REPEATABLE READ
4. TRANSACTIONAL

||DIRTY READ|NON REPEATABLE READ|PAHNTOM READ|
|-|-|-|-|
|READ UNCOMMITTED|-|-|YES|
|READ COMMITTED|-|-|YES|
|REPEATABLE READ|-|-|YES|
|TRANSACTIONAL|NO|NO|YES|

다음 세 가지 개념을 이해하고 있어야 한다.  
1. Dirty read
2. Non-repeatable read
3. Phantom read

### Dirty Read
<!-- https://www.tablesgenerator.com/markdown_tables -->
|   | Transaction A                                     | Transaction B                                     |
|---|---------------------------------------------------|---------------------------------------------------|
| 1 | SET TRANSACTION ISOLATION LEVEL read uncommitted; | SET TRANSACTION ISOLATION LEVEL read uncommitted; |
| 2 | begin;                                            |                                                   |
| 3 | select * from test;                               |                                                   |
| 4 |                                                   | begin;                                            |
| 5 |                                                   | select * from test;                               |
| 6 | update test set amount = 155 where id = 6;        |                                                   |
| 7 |                                                   | select * from test where id = 6;                  |
| 8 | rollback;                                         |                                                   |
| 9 |                                                   | select * from test where id = 6;                  |

### Non-repeatable Read

|   | Transaction A                                     | Transaction B                                     |
|---|---------------------------------------------------|---------------------------------------------------|
| 1 | SET TRANSACTION ISOLATION LEVEL read uncommitted; | SET TRANSACTION ISOLATION LEVEL read uncommitted; |

### Phantom Read - 1
|   | Transaction A                                     | Transaction B                                     |
|---|---------------------------------------------------|---------------------------------------------------|
| 1 | SET TRANSACTION ISOLATION LEVEL read uncommitted; | SET TRANSACTION ISOLATION LEVEL read uncommitted; |

### Phantom Read - 2
|   | Transaction A                                     | Transaction B                                     |
|---|---------------------------------------------------|---------------------------------------------------|
| 1 | SET TRANSACTION ISOLATION LEVEL read uncommitted; | SET TRANSACTION ISOLATION LEVEL read uncommitted; |



# Lock
