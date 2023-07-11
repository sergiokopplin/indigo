---
title: "스칼라, 벡터, 텐서"
layout: post
date: 2023-07-10 00:00
headerImage: false
tag:
- math
category: blog
author: sean
description: description is empty
---

- 나무위키 + 모바일 앱에서 본 자료를 활용해서 적당한 증명을 적어두자.
- 이 글을 작성하게 된 이유는 선형대수학에서 최소다항식이 나오고 → 최소 공배수가 나오는데 → 유클리드 호제법 부터 모르겠다 → 유클리드 호제법 아이디어를 정리해두면 좋지 않을까 생각함

유클리드 호제법 / Euclidean algorithm

- d가 최대 공약수라고 한다면
- a = d + d + d + d ... + d
- b = d + d + d 
- a 에서 b 를 빼더라도 최대 공약수는 변하지 않는다.

[증명]
Prove the Edulidean algorithm
d is the greatest common divisor of a and b
a = d + d + d + d + d + d + d + d
b = d + d + d

a = b * q + r ( 0 <= r < b )
