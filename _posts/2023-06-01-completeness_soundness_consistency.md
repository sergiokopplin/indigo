---
title: "Completeness & Soundness & Consistency"
layout: post
date: 2023-06-01 00:00
headerImage: false
tag:
- math
- logic
category: blog
author: sean
description: description is empty
---

## Formal Language

---

Formal language 란 Alphabet 으로 구성된 Word 로 구성되고 특정한 규칙에 의해서 지배되는 well-formed 된 언어를 말한다. 

## First-order logic

---

- https://en.wikipedia.org/wiki/First-order_logic#Free_and_bound_variables
- 일차 논리 ( predicate logic, quantificationala logic )
- Non-logical object 에 대해서 한정사를 부여할 수 있으며, Variable 을 포함한 문장을 다룰 수 있다. 이는 propositional logic 과의 큰 차이점이다.
- Syntax 와 Semantics 로 구성된다.

**Syntax - 규칙** 

- **Alphabet**
    - **term** ( intuitively represents object )
    - **formulas** ( intuitively  express predicates that can be true or false )
    - **terms** and **formulas** 는 **symbols** 의 문자열이다.
        - **logical symbols** - 항상 동일한 의미를 가진다.
            - The quantifier symbols
            - The logical connectives symbols
            - Paranthesis
            - A finite set of variables
            - A equality symbol
        - **non-logical symbols** - interpretation 에 따라서 의미가 변화한다.
            - predicates (relations) symbols
            - functions symbols
            - constant
- **Formulation Rule**
    - Formulation Rule 은 first-order logic 의 terms 과 formulas 를 정의한다.
    - terms 와 formulas 가 symbols 의 나열로 이뤄졌을 때  Formulation rule 은 표준 문법으로 사용된다.
    
    - **Term** - Term 의 집합은 다음 규칙을 통하여 귀납적( inductively ) 으로 정의된다.
        1. **Variables** - any variable is a term
        2. **Functions** - any expression $f(t_1,t_2...,t_n)$ is term. ( $t_n$은 term 이며 f 는 n 개의 인자를 받는 함수이다. ) 개별 상수를 나타내는 symbols 은 인자가 없는 함수이므로 term 이다. 
    - **Formulas** - formula ( = well-formed formulas )의 집합은 다음 규칙을 통하여 귀납적( inductively ) 으로 정의된다.
        1. Predicate symbols
        2. Equality
        3. Negation
        4. Binary connection
        5. Quantifier 
        
- **Notational convention**
- **Free and bound variable**
    - free variable 이 없는 first-order formula 를 **first-order sentence** 라고 부른다.
- **Example : ordered abelian group**

**Semantic - 해석**

- 해석이란 formal language L 을 구성하는 non-logical symbol 에 대하여 denotation 을 부여한다.
- 해석은 한정사가 제한하는 domains of discourse 를 결정한다.
- 해석의 결과로서 Formal language 의 Term 은 domains of discourse 의 object 와 대응되며, predicate 는 object 의 property 를 나타내며,  L 의 sentence 에는 진리값이 부여된다.

- ****First-order structures****
    - 보편적으로 해석을 명시하는 방법은 Structure 를 밝히는 것이다. ( model 을 밝히는 것과 동일한 의미이다. ) Structure 는 공집합이 아닌 집합 D ( = domain of discourse ) 와 이에 대한 non-logical symbol 에 대한 해석 I 를 제시하는 것이다.
        - 여기서 해석 I 는 다음과 같은 함수이다.
            1. n-ary 함수 f 를 I 를 통해 다음과 같은 함수로 보낸다. $I(f) :D^n\rightarrow D$
            2. predicate P 를 I를 통해서 다음과 같은 함수로 보낸다. $I(P):D^n \rightarrow \{\text{true, false}\}$
    - 그리고 이런 해석의 과정을 통해서 truth value 를 부여할 수 있다.
    
- **Validity, satisfiability, and logical consequence**
    - 어떤 setence $\phi$ 가 주어진 해석 $M$에 대해서 true 로 진리값이 결정되면, 우리는 $M \text{ satisfies } \phi$ 라고 하며, $M \vDash \phi$ 라고 쓴다. 어떤 sentence 에 대해 해당 sentence 를 참으로 만드는 해석이 존재하면 우리는 그 sentence 가 satisfiable 하다고 한다.
    - 어떤 formula 가 모든 해석에 대해서 참이라면 우리는 그 formula 를 ***logically valid*** 라고 한다.
    - 만약 formula $\psi$ 를 참으로 만드는 모든 해석에 대해서 formula $\phi$ 가 참이라면, 우리는 $\phi$  는 $\psi$ 의 ***logical consequence*** 라고 부른다.
    
- **First-order theories, models and elementary classes**
    - **signature** 는 non-logical symbol 에 대해 서술하는 것을 의미한다.
    - **First-order theory** 는 axiom 의 집합을 의미한다. 이 때 이 공리집합은 어떤 signature 의 symbols 로 구성된 sentences 를 의미한다.
    - 이때 Theory 가 finite 하거나 recursively enumerable 하다면 해당 theory 를 **effective** 하다고 한다.

**Deductive System - 추론 체계**

- Rules of inference
- Hilbert-style system and natural deduction
- Sequent calculus

## Second-order logic

---

- 나의 의문점을 잘 드러내주는 [질문](https://math.stackexchange.com/questions/2617708/what-is-the-difference-between-first-order-logic-on-a-power-set-and-second-orde)을 발견했다. 그러나 단어의 정의를 몰라서 이해가 가지 않는다.
- **[Non-reducibility to first-order logic](https://en.wikipedia.org/wiki/Second-order_logic#Non-reducibility_to_first-order_logic)**
    - 혹자는 실수의 집합 전체를 Domain 으로 확장하고, 새로운 이항 predicate 를 도입함으로써 2차 논리를 1차 논리로 환원할 수 있지 않을까 생각할 수 있다.
    - 그러나 실수의 부분집합 ***모두***로 선언된 도메인은 애초에 일차 논리로 환원될 수 없다.
    - 그리고 countably finite 하게 구성된 collection of set 은 least-upper-bound axiom 을 만족할 수 없어서 model 이 하나가 아니다. second-order logic 에서는 unique ( up to isomorphism )
    - 그런데 솔직히 무슨 말인지 제대로 이해하지 못했다.
    
- 개략적인 인상은 자연수와 실수의 cardinality 차이로 인해서 모든 2차 논리를 1차 논리로 환원할 수 없기 때문에 First order logic 과 Second order logic 이 구분이 되는 듯 하다. countably infinite 한 구성으로는 uncountable 한 것을 못 만들기 때문인 것 같은데... 많은 것이 구멍이난 정도의 이해도인것 같다.

## Higher-order logic

---

- 일차 논리는 individuals 에 대해서 한정사를 다를 수 있다.
- 이차 논리는 추가적으로 individuals 의 집합에 대해서 한정사를 다룰 수 있다.
- n 차 논리는 nested 집합에 대한 한정사를 다룰 수 있다. ( 집합의 집합의 ... )

## Completeness & Soundness & Consistency

---

**Soundness**

- 형식이 Valid 하고 전제가 모두 참인 논증은 sound 하다.
- 어떤 시스템에서 증명가능한 모든 formula 가 시스템의 semantic 에 의해서 logically valid 함을 의미한다.
- 어떤 axioms 으로부터 deduction 을 통해서 formula 를 유도할 수 있다면 , 그 axiom 과 tautological consequence 이다. 즉 axiom 이 모두 참이면 → alpha 역시 참이다. ( Sementic soundness of Propositional Calculus )

$$
\text{If } \Phi \vdash_0 \alpha \text{ then also } \Phi \vDash_0 \alpha \text{. In particular, if } \vdash_0 \alpha \text{ then also } \vDash_0 \alpha
$$

**Completeness**

- 어떤 signature 안의 모든 formula 와 그 부정이 axioms of theory 의 logical consequence 라면 해당 theory 는 complete 하다고 부른다.

**Consistency**

- 모순이 없다는 것 ( alpha 가 참이고 not alpha 가 참인 것을 동시에 Deduction 할 수 있으면 안된다. )


## 메모
- 1차로 적당히 publish 해두고 내용을 추가하자
- 집합론과 형식체계에 대해서 글을 추가로 정리하고 내용을 보강하자
- 괴델의 불완전성 정리에 대해서 이해한 것을 추가 정리하자.