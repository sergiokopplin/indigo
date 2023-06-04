---
title: "Distance vs Metric vs Norm"
layout: post
date: 2023-06-01 00:00
headerImage: false
tag:
- math
- topology
- distance
category: blog
author: sean
description: description is empty
---


# Distance vs Metric vs Norm
<div style="text-align: center;">
    <img class="title-image" src="{{ site.url }}/assets/images/blog/Mathematical_Spaces.png" style="width: 50%;">
</div>

세 개념 모두 어떤 도메인에서 실수로 보내는 함수인데, 각자가 다루는 도메인과 성질이 다르다. 
셋 모두 추상적인 “거리" 와 같은 개념을 정의하고자 도입된 것이며, 일상어에서 사용하는 “거리”의 추상적 의미를 엄밀하게 정의하다보니 갈래가 나눠진 듯 하다.

Definition of Measure
---

X 를 집합이라고 하고, $\Sigma$ 를 X위의 $\sigma$-algebra 라고 하자.  ( Mesurable Space )

***Measure*** 는 다음과 같은 성질을 만족하는 함수이다. 

$$ \mu: \Sigma\rightarrow \mathbb{R}\ \cup \{ \infty,-\infty\} $$

1. Non-negativity
2. Null empty set
3. Countable additivity


Definition of Metric
---

***Metric*** 은 집합 X 에서 정의된 다음과 같은 성질을 따르는 함수이다. ( Just set )

$$ d:X \times X \rightarrow \mathbb{R} $$

1. identity of indicernibles :  $d(x,y)=0 \iff x=y$
2. symmetry : $d(x,y) =d(y,x)$
3. trangle inequality : $d(x,z) \le d(x,y) +d(y,z)$

위 axiom 으로부터 non-negativity 가 유도된다.

Definition of Norm
---

***Norm*** 은 **vector space** X 에서 정의된 다음과 같은 성질을 만족하는 함수이다.  ( Vector space )

$d:X \rightarrow \mathbb{R}$ 이고 다음과 같은 성질을 만족한다. 

1. Triangle inequality
2. Absolute homogenity
3. Positive Definiteness
4. Non-Negativity