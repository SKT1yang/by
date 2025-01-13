#!/bin/bash

# 定义变量
DELETE_DIR="temp-delete-dir"

# 创建测试目录结构
mkdir -p $DELETE_DIR/test-dir1/sub1 $DELETE_DIR/test-dir1/sub2 $DELETE_DIR/test-dir2/sub1 $DELETE_DIR/test-dir2/sub2

# 创建根目录文件
echo 'test1' > $DELETE_DIR/test1.txt
echo 'test2' > $DELETE_DIR/test2.txt

# 创建test-dir1目录文件
echo 'test3' > $DELETE_DIR/test-dir1/test3.txt
echo 'test4' > $DELETE_DIR/test-dir1/sub1/test4.txt
echo 'test5' > $DELETE_DIR/test-dir1/sub2/test5.txt

# 创建test-dir2目录文件
echo 'test6' > $DELETE_DIR/test-dir2/test6.txt
echo 'test7' > $DELETE_DIR/test-dir2/sub1/test7.txt
echo 'test8' > $DELETE_DIR/test-dir2/sub2/test8.txt

# 执行删除操作
node dist/index.mjs delete "**/test-dir1" "**/test-dir2" "**/test1.txt" "**/test2.txt" -r -l
