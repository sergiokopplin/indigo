---
title: "Java反射机制"
layout: post
date: 2017-08-24
tag:
- Java
category: blog
author: ingerchao
description: Java notes - Java reflection
---

JAVA反射机制可以在编译期之外的运行期获得任何一个类的字节码，包括接口、变量、方法等，还可以在运行期实例化对象，通过调用get/set方法获取变量的值。

反射机制可以用来做以下几种事情：

- 在运行中分析类的能力；
- 在运行中查看对象；
- 实现通用的数组操作代码；
- 利用 Method 对象。

使用反射机制的主要人员是工具构造这，而不是应用程序员。所以如果对造轮子并不感兴趣，可以跳过此条目。

***Class对象***

JAVA是面向对象的语言，所有类的对象都是Class的实例，当我们想知道一个类的信息时，首先需要获取类的Class对象。

```JAVA
//获得一个Class对象
        String className = "reflection.Example";
        Class<?> aClass = null;
        Class<?> bClass = null;
        Class<?> cClass = null;
        try {
            //尽量采用这种方法
            aClass = Class.forName(className);
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
        bClass = new Example().getClass();
        cClass = Example.class;
```

***类名***

可以在编译期得到class对象的类名
```java
        aClass.getName();//输出包名.类名
        aClass.getPackage();//输出包名
        aClass.getSimpleName();//输出类名
```

***修饰符***

也可以获取到类对象的修饰符，即public、private、abstract等关键字，关键代码如下：

```java
        aClass.getModifiers();
```

修饰符是一个int型的值，可以使用java.lang.reflect.Modifier类中的方法来检查修饰符的类型：

```java
        Modifier.isAbstract(int modifiers);
        Modifier.isFinal(int modifiers);
        Modifier.isInterface(int modifiers);
        Modifier.isNative(int modifiers);
        Modifier.isPrivate(int modifiers);
        Modifier.isProtected(int modifiers);
        Modifier.isPublic(int modifiers);
        Modifier.isStatic(int modifiers);
        Modifier.isStrict(int modifiers);
        Modifier.isSynchronized(int modifiers);
        Modifier.isTransient(int modifiers);
        Modifier.isVolatile(int modifiers);
```

***父类***

```java
        Class superClass = aClass.getSuperclass();//得到aClass的父类
```

父类也是一个class对象，也可以进行反射操作。

***接口***

```java
Class<?> interfaces[] = aClass.getInterfaces();
        System.out.println(interfaces[0]);
```

运行结果：
```
interface reflection.InterA
```

***构造函数***

通过Class对象获取构造函数Constructor类的实例：

```Java
        Constructor<?> constructors[] = aClass.getConstructors();//获取构造方法
        for (Constructor i : constructors){
            Class<?> parameterTypes[] = i.getParameterTypes();
            System.out.println("constructor: "+i);//输出构造方法
            for (Class j : parameterTypes){
                System.out.println("parameterType: "+j);//输出参数类型
            }
        }
```

运行结果：

```
    constructor: public reflection.Example(java.lang.String,int)
    parameterType: class java.lang.String
    parameterType: int
    constructor: public reflection.Example(int)
    parameterType: int
    constructor: public reflection.Example(java.lang.String)
    parameterType: class java.lang.String
    constructor: public reflection.Example()
```

可以利用Constructor对象实例化一个类：

```java
 try {
            Example example1 = (Example) constructors[0].newInstance();
        } catch (InstantiationException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        }
```

***Method对象***

```java
Method[] methods = aClass.getMethods();//获得Example类中的所有public方法
```

可以通过getMethod获取具体的方法，第一个参数为方法名，第二个为参数类型。

```java
        try {
            Method methodSetStr = aClass.getMethod("setStr",new Class[]{String.class});
            System.out.println(methodSetStr.getReturnType());//输出返回类型
            System.out.println(methodSetStr.getParameterTypes()[0]);//输出第一个参数类型
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        }

```

运行结果：

```
void
class java.lang.String
```

还可以通过Method对象来调用一个方法

```java
            Object o = aClass.newInstance();
            Object returnValue = methodSetStr.invoke(o,"nihaoya");
            System.out.println("returnValue: " + returnValue);
```

运行结果
```
returnValue: null
```

***成员变量***

可以通过反射机制访问类的成员变量，代码如下

```java
        /**
         * 可以获得类的成员变量
         */
        try {
            Field field = aClass.getField("d");//只能获得public成员变量
            System.out.println("publicField" + field);
        } catch (NoSuchFieldException e) {
            e.printStackTrace();
        }
        Field[] privateFields = aClass.getDeclaredFields();//获得所有成员变量，包括私有成员变量
        for (Field i : privateFields){
            System.out.println("allFields: " + i);
            i.setAccessible(true);//这行代码会关闭i的反射访问检查。
        }
```

运行结果：
```
publicField: public double reflection.Example.d
allFields: public double reflection.Example.d
allFields: private java.lang.String reflection.Example.str
allFields: private int reflection.Example.x
```

***泛型***

1. 声明一个需要被参数化（parameterizable）的类/接口。
2. 使用一个参数化类。


获知他们具体的参数化类型。在Example中定义一个List<String>类型的集合，并生成getter和setter。

```java
        try {
            Method methodGetList = aClass.getMethod("getStringList",null);
            Type returnType = methodGetList.getGenericReturnType();

            if (returnType instanceof ParameterizedType){
                ParameterizedType type = (ParameterizedType) returnType;
                Type[] typeArguments = type.getActualTypeArguments();
                for(Type typeArgument : typeArguments){
                    Class typeArgClass = (Class) typeArgument;
                    System.out.println("typeArgClass = " + typeArgClass);
                }
            }
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        }
```

运行结果：

```
typeArgClass = class java.lang.String
```

可以知道返回类型是一个代表 java.lang.String 的 Class 类的实例

```java
       /**
         * 获取参数泛型的参数类型
         */
        try {
            Method methodSetList = aClass.getMethod("setStringList", List.class);

            Type[] genericParameterTypes = methodSetList.getGenericParameterTypes();

            for (Type i : genericParameterTypes){
                if (i instanceof ParameterizedType){
                    ParameterizedType type = (ParameterizedType) i;
                    Type[] parameterTypes = type.getActualTypeArguments();
                    for (Type parameterArgType : parameterTypes){
                        Class parameterArgClass = (Class) parameterArgType;
                        System.out.println("parameterArgClass = " + parameterArgClass);
                    }
                }
            }
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        }
```

运行结果：

```
parameterArgClass = class java.lang.String
```

------------------------------------------------------------------------------------------------
[源码](https://github.com/Joki-memeda/MyLearning/edit/master/Java/Java%20Reflection/reflection)
