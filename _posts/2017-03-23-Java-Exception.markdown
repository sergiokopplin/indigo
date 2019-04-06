---
title: "Java异常处理机制"
layout: post
date: 2017-03-23 22:48
tag:
- Java
category: blog
author: ingerchao
description: Java notes - Exception
---

## Java中处理异常的两种方式

* 捕获异常：就地解决，并使程序继续执行 `//积极的处理方式`

>当Java运行时系统得到一个异常对象时，他将会沿着方法的`调用栈`逐层回溯，寻找处理这一异常的代码。找到能够处理这种类型的异常的方法后，运行时系统把当前的异常对象交给这个异常方法后，这一过程称为捕获(catch)异常。如果Java运行时系统找不到可以捕获异常的方法，则运行时系统中将终止，相应的Java程序也将退出。

* 声明抛弃异常：将异常抛出方法之外，由调用该方法的环境去处理 `//消极的处理方式`

>如果在一个方法中生成了一个异常，但是这一方法并不确切地知道该如何对这一异常事件进行处理，这时，一个方法就应该声明抛弃异常，使得异常对象可以从调用栈向后传播，直到有合适的方法捕获它为止。

## Java中预定义的异常类

![预定义的异常类](http://img.blog.csdn.net/20170323190427885?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvSm9raTIzMw==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

### Error

Error标识不可能或难以恢复的严重问题，例如内存不足，程序一般不处理这类情况。

### RuntimeException

RuntimeException指示设计或实现上的问题，如果程序正确运行，这样的情况是不应该出现的。

#### 常见异常

* NullPointException--空指针异常
* ArrayIndexOutOfBoundsException--数据越界异常
* NegativeArraySizeException--数组负下标异常
* ArithmeticException--算数异常类
* ClassCastException--算数运算异常
* IllegalArgumentException--传递非法参数异常
* ArrayStoreException--向数组中存放与数组类型不符元素异常
* NumberFormatException--数字格式异常
* SecurityException--安全异常
* UnsupportedOperationException--不支持的操作异常

### try-catch语句

```Java
try{
        //打开文件
        //判断大小
        //分配内存
        //读入内存
        //关掉文件
    }catch(/*文件打开失败*/){
        //处理代码
    }catch(/*大小取值失败*/){
        //处理代码
    }catch(/*内存分配失败*/){
        //处理代码
    }catch(/*读取失败*/){
        //处理代码
    }catch(/*关闭文件失败*/){
        //处理代码
    }finally{
    //总是执行的代码,即使碰到return也执行finally后才return,除非遇到System.exit()，程序会立刻退出  
    }
```

### throw/throws抛出异常

```Java
//抛出的对象必须是Throwable的子类
public int read () throws IOException{
                ......
    }

public static void main(String args[]) throws IOException, IndexOutOfBoundsException {
                ······
}
```

### 堆栈调用机制

* 如果一个try-catch块中没有处理，那么将会抛向此方法的调用者
* 如果一个异常回到main方法，而且也没有处理，那么程序终将终止

![堆栈处理机制](http://img.blog.csdn.net/20170323211705302?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvSm9raTIzMw==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

## 自定义异常类

```Java
public class MydateException extends Exception{
    private String reason;
    public MydateException(String r){
        reason = r;
    }
    public String getReason(){
        return reason;
    }
}

public class Mydate {
    int year,month,day;
    void setDate(int year,int month,int day) throws MydateException{
        if(day>31)
            throw new MydateException("day too big");
        this.year = year;
        this.month = month;
        this.day = day;
    }
    public static void main(String[] args){
        Mydate t = new Mydate();
        try {
            t.setDate(2001,1,100);
        }catch (MydateException e){
            System.out.println(e.getReason());
        }
    }
}
```
