# ocoder

ios代码自动生成工具

已实现功能：
* 使用类似css的解释型语言对UI进行布局(基于EasyIOS框架)
* ios各种尺寸的icon自动生成

待实现功能：
* 基于json生成EasyIOS中可用的Model层代码

## Installation

```
npm install ocoder -g
```

## Usage

```
ocoder css test/ShareDetailView:UIView.css test/
ocoder icon test/icon.png test/icon/
```

## Example

```
convert
https://github.com/zhuchaowe/ocoder/blob/master/test/ShareDetailView:UIView.css
to
https://github.com/zhuchaowe/ocoder/blob/master/test/ShareDetailView.h
https://github.com/zhuchaowe/ocoder/blob/master/test/ShareDetailView.m
```
