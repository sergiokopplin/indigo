---
title: "Java内部类与匿名内部类"
layout: post
date: 2017-03-20 22:48
tag:
- Java
category: blog
author: ingerchao
description: Java notes - Inner Class & Anonymous Inner Class
---

## 内部类

在一个类中定义另一个类，这个类就称作内部类。

### 内部类与外嵌类的关系

* 内部类仅供它的外嵌类使用，其他类不可以用某个类的内部类生命对象。
* 内部类的外嵌类的成员变量在内部类中仍然有效，内部类中的方法也可以调用外嵌类中的方法。
* 内部类的类体中不可以生命类变量和类方法。
    * 外嵌类的类体中可以用内部类生命对象，作为外嵌类的成员。

### 例子

```Java
public class RedCowForm {
    static String formName;
    RedCow cow;//内部类对象
    RedCowForm(){}
    RedCowForm(String s){
        cow = new RedCow(150,112,5000);
        formName = s;
    }
    public void showCowMess(){
        cow.speak();
    }
    class RedCow {
        String cowName = "RedCow";
        int height,weight,price;
        RedCow(int height,int weight,int price){
            this.height = height;
            this.weight = weight;
            this.price = price;
        }
        void speak(){
            System.out.println("I'm " + cowName + ", My height is "
                    + height + ", and my weight is" + weight + "kg,live in " + formName);
        }
    }//内部类结束
}//外嵌类结束

public class InnerTest {
    public static void main(String[] args){
        RedCowForm redCowForm = new RedCowForm("RedCow Farm");
        redCowForm.showCowMess();
        redCowForm.cow.speak();
    }
}
/*运行结果*/
//I'm RedCow, My height is 150, and my weight is112kg,live in RedCow Farm
//I'm RedCow, My height is 150, and my weight is112kg,live in RedCow Farm
```

注：内部类对应的字节码文件的名字格式为`外嵌类名$内部类名`

## 匿名内部类

一个子类或接口去掉类声明之后的类体，称作匿名类。

`注：匿名类是一个内部类，不能用匿名类声明对象，但是可以直接用匿名类创建一个对象。`

### 使用场景

* 临时使用 
* 没有显式地声明一个子类，而又想用子类创建一个对象

### 特点

* 匿名类可以继承父类的方法也可以重写父类的方法
* 匿名类可以访问外嵌类的成员变量和方法，匿名类的类体中不可以声明static成员变量和static方法
* 匿名类是一个子类，但没有类名，所以在用匿名类创建对象的时候，要直接使用父类的构造方法

### 使用格式

```Java
//假设Bank是类，下面就是用Bank的一个子类创建对象
new Bank(){
//匿名类的类体
};
//假设Computable是一个接口，下面就是用实现了Computable接口的类创建对象

new Computable(){
//实现接口的匿名类的类体
}
```

### 例子

```Java
/*抽象类OutputAlphabet方法*/
abstract class OutputAlphabet {
    public abstract void output();
}
/**
 * OutputEnglish是OutputAlphabet的一个子类
 */
public class OutputEnglish extends OutputAlphabet{//输出英文字母的子类
    @Override
    public void output() {
        for(char c='a' ;c <= 'z' ;c++){
            System.out.printf("%2c",c);
        }
    }
}

public class ShowBoard {
    void showMess(OutputAlphabet show){
        show.output();//参数show是OutputAlphabet类型的对象
    }
}

public class AnonymousTest {
    public static void main(String[] args){
        ShowBoard showBoard = new ShowBoard();
        showBoard.showMess(new OutputEnglish());//向参数传递OuputAlphabet的子类OutputEnglish对象
        showBoard.showMess(new OutputAlphabet() {//向参数传递OuputAlphabet的匿名子类的对象
            @Override
            public void output() {
                for(char c = 'α' ; c <= 'ω' ;c++){
                    System.out.printf("%2c",c);
                }
            }
        });
    }
}
//运行结果： a b c d e f g h i j k l m n o p q r s t u v w x y z α β γ δ ε ζ η θ ι κ λ μ ν ξ ο π ρ ς σ τ υ φ χ ψ ω
```

```Java
/**
 * 继承自接口的匿名类
 */
public interface SpeakHello {
    void speak();
}
class HelloMachine{
    public void turnOn(SpeakHello speakHello){
        speakHello.speak();
    }
}

public class InterfaceTest {
    public static void main(String[] args){
        HelloMachine helloMachine = new HelloMachine();
        helloMachine.turnOn(new SpeakHello() {//和接口SpeakHello有关的匿名类
            @Override
            public void speak() {
                System.out.println("Hello Machine!");
            }
        });
    }
}
//运行结果：Hello Machine!
```

