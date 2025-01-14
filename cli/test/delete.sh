#!/bin/bash

# 定义变量
DELETE_DIR="temp-delete-dir"

# 创建测试目录结构
mkdir -p  $DELETE_DIR/test-dir1/sub1 $DELETE_DIR/test-dir1/sub2 $DELETE_DIR/test-dir2/sub1 $DELETE_DIR/test-dir2/sub2 $DELETE_DIR/test-dir3 $DELETE_DIR/node_modules/test-dir3

# 创建根目录文件
echo 'test1' > $DELETE_DIR/test1.txt
echo 'test2' > $DELETE_DIR/test2.txt

# 创建test-dir1目录文件
echo 'test1' > $DELETE_DIR/test-dir1/test1.txt
echo 'test3' > $DELETE_DIR/test-dir1/test3.txt
echo 'test4' > $DELETE_DIR/test-dir1/sub1/test4.txt
echo 'test5' > $DELETE_DIR/test-dir1/sub2/test5.txt

# 创建test-dir2目录文件
echo 'test6' > $DELETE_DIR/test-dir2/test6.txt
echo 'test7' > $DELETE_DIR/test-dir2/sub1/test7.txt
echo 'test8' > $DELETE_DIR/test-dir2/sub2/test8.txt

# 创建test-dir3目录文件
echo 'test9' > $DELETE_DIR/test-dir3/test9.txt

# 创建node_modules目录文件
echo 'test9' > $DELETE_DIR/node_modules/test9.txt

# 执行删除操作
node dist/bin.mjs delete "**/test-dir1" "**/test-dir2" "**/test1.txt" "**/test2.txt" "$DELETE_DIR/node_modules/test9.txt" -r -l

node dist/bin.mjs delete "$DELETE_DIR/test-dir3" -l

node dist/bin.mjs delete "$DELETE_DIR" -l

# node dist/bin.mjs delete 

