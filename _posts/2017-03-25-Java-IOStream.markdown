---
title: "Java输入输出流"
layout: post
date: 2017-03-25 22:48
tag:
- Java
category: blog
author: ingerchao
description: Java notes - IO Stream
---

本质：__数据传输__

## File类

File类的对象主要用来获取文件和目录本身的一些信息，例如文件所在的目录、文件的长度、文件读写权限等，不涉及对文件的读写操作。 

#### File类的构造方法

`3个`

* File(String  filename);
* File(String directoryPath, String filename);
* File(File dir, String filename);

## 流的分类

![type of stream](http://img.blog.csdn.net/20170410171950658?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvSm9raTIzMw==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)


### 字节输入流

#### 字节输入流类的常用方法

文件字节流可以调用从父类继承的read方法顺序读取文件，只要不关闭，每次调用read方法就可以顺序地读取文件中地其余内容，查到文件的末尾或文件字节输入流被关闭。

* `abstract int read()` 从输入流中读取数据的下一字节
* `int raad(byte[] b)` 从输入流中读取一定数量的字节，并将其存在缓冲区数组b中
* `int read(byte[] b,int off,int len)` 将输入流中最多len个数据字节读入byte数组b中
* ` void close()` 关闭输入流并释放所有与之关联的资源



#### 字节输出流类的常用方法 

* `void close()` 关闭输出流并释放所有与之关联的资源
* `void flush()` 刷新此输出流并强制写出所有缓冲的输出字节
* `void write(byte[] b)` 将b.length个字节从指定的byte数组写入此输出流
* `void write(byte[] b,int off,int len)` 将指定byte数组中从偏移量off开始的len个字节写入此输出流
* `abstract void write(int b)` 将指定字节写入此输入流


### 文件流

>FileInputStream是InputStream的子类，实现了抽象方法read()，并将流的数据源定义为文件。

>FileOutputStream是OutputStream的子类，实现了抽象方法write()，并将流的数据目标定义为磁盘文件。

>FileReader类是Reader的子类，并将流的数据源定义为文件。

>FileWriter是Writer的子类，并将流的数据目标定义为磁盘文件。


```Java
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

public class InputStreamDemo1 {
	
	
	public static void read1(){
		try {
			InputStream in = new FileInputStream("E:\\1.txt");
			int b = -1;
			while((b = in.read())!=-1){
				System.out.print((char)b);
			}
			in.close();
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public static void read2(){
		try {
			File f = new File("E:\\1.txt");
			InputStream in = new FileInputStream(f);
			byte [] bytes = new byte[(int) f.length()];
			int len = in.read(bytes);
			System.out.println(new String(bytes));
			System.out.println(len);
			in.close();
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
	
	public static void read3(){
		File file = new File("E:\\1.txt");
		try {
			InputStream in = new FileInputStream(file);
			byte [] bytes = new byte[10];
			int len = -1;
			StringBuilder sb = new StringBuilder();
			while((len = in.read(bytes))!=-1){
				sb.append(new String(bytes,0,len));
			}
			System.out.println(sb);
			in.close();
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public static void main(String [] args){
		//read1();
		//read2();
		read3();
	}
}
```

```Java

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;

public class OutputStreamDemo {

	/**
	 * 字节输出流的方式二：每次输出指定大小的字节
	 */
	public static void write2() {
		try {
			// 创建一个文件字节输出流对象(参数true表示追加输出)
//			追加的意思是：打开一个流后，一直写，以追加的形式，直到关闭；如果不关闭流，不管是true还是false都是追加
//			再下一次打开流后，采用追加的形式
			OutputStream out = new FileOutputStream("E:\\1.txt");

			String info = "hello,everyone我是中国人，中华人民共和国 ";
//			String info1 = " 你好 fsfkgfks";
			
			byte[] bytes = info.getBytes();
			out.write(bytes);// 输出一个字节数组
			out.write(bytes,0,5);//输出一个字节数组中的指定范围的字节
			
//			byte[] bytes1 = info1.getBytes();
//			out.write(bytes1);// 输出一个字节数组
			// 关闭流
			out.close();

		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	/**
	 * 字节输出流的方式一：每次输出一个字节
	 */
	public static void write1() {
		try {
			// 创建一个文件字节输出流对象
			OutputStream out = new FileOutputStream("E:\\1.txt");

			String info = "hello,IO";
			byte[] bytes = info.getBytes("utf-8");
			for (int i = 0; i < bytes.length; i++) {
				// 向文件中输出
				out.write(bytes[i]);
			}

			// 关闭流
			out.close();

		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public static void main(String[] args) {
//		write1();
		write2();
		System.out.println("success");
	}

}
```
