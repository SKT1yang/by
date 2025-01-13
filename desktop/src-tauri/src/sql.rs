use rusqlite::{Connection, Result};
use std::{env, path::PathBuf, usize};
use serde::{Deserialize, Serialize};

const DATABASE: &str = "students.db3";

pub fn init_sql() -> Result<()> {
    // 使用 rusqlite 连接 sqlite 数据库
    let connection = Connection::open(compute_database_path())?;

    // 在 rusqlite 里使用 sqlite 语法创建表格
    create_students_table(&connection)?;

    // 在 rusqlite 里使用 sqlite 语法从表格中获取数据
    let database_students = get_students_from_database(&connection)?;

    // 如果表中不存在和要插入的数据相冋的数据，则插入数据。
    let students = generate_students();
    let exist = database_students.iter().any(|database_student| {
        students
            .iter()
            .any(|student| student.name == database_student.name)
    });

    if !exist {
        insert_students(&connection, students)?;
    }

    // 打印中表格中取出的数据
    let students = get_students_from_database(&connection)?;
    for student in students {
        println!("Found student {:?}", student);
    }

    Ok(())
}

#[derive(Debug, Deserialize, Serialize, PartialEq)]
pub struct Student {
    #[allow(dead_code)]
    id: i32,
    name: String,
    height: String,
}

pub fn compute_database_path() -> PathBuf {
    env::current_dir()
        .expect("Fail to get directory.")
        .join(DATABASE)
}

pub fn create_students_table(connection: &Connection) -> Result<usize> {
    connection.execute(
        "CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            height TEXT NOT NULL 
        )",
        (),
    )
}

pub fn get_students_from_database(connection: &Connection) -> Result<Vec<Student>> {
    // 打印connection
    println!("connection: {:?}", connection);
    let mut statement = connection.prepare("SELECT id, name, height FROM students")?;

    let student_iterator = statement.query_map([], |row| {
        let student = Student {
            id: row.get(0)?,
            name: row.get(1)?,
            height: row.get(2)?,
        };

        Ok(student)
    })?;

    student_iterator.collect::<Result<Vec<Student>>>()
}

pub fn generate_students() -> Vec<Student> {
    [
        Student {
            id: 0,
            name: "下江コハル".to_string(),
            height: "148cm".to_string(),
        },
        Student {
            id: 1,
            name: "小鳥遊ホシノ".to_string(),
            height: "145cm".to_string(),
        },
        Student {
            id: 2,
            name: "浅黄ムツキ".to_string(),
            height: "144cm".to_string(),
        },
        Student {
            id: 3,
            name: "霞沢ミユ".to_string(),
            height: "149cm".to_string(),
        },
    ]
    .into_iter()
    .collect::<Vec<Student>>()
}

pub fn insert_students(connection: &Connection, students: Vec<Student>) -> Result<()> {
    let mut statement =
        connection.prepare("INSERT INTO students (name, height) VALUES (?1, ?2)")?;

    for student in students {
        statement.execute((&student.name, &student.height))?;
    }

    Ok(())
}

pub fn get_students() -> Result<Vec<Student>> {
    let path = compute_database_path();
    let connection = Connection::open(path)?;
    get_students_from_database(&connection)
}

#[cfg(test)]
mod minimum_resqlite_tests {
    use super::*;

    #[test]
    fn database_connected() -> Result<()> {
        let path = compute_database_path();
        Connection::open(path)?;
        Ok(())
    }

    #[test]
    fn table_created() -> Result<()> {
        let path = compute_database_path();
        let connection = Connection::open(path)?;
        create_students_table(&connection)?;
        get_students_from_database(&connection)?;

        Ok(())
    }

    #[test]
    fn data_inserted() -> Result<()> {
        let path = compute_database_path();
        let connection = Connection::open(path)?;
        let students = generate_students();
        let database_students = get_students_from_database(&connection)?;

        assert!(database_students.len() == students.len());

        Ok(())
    }
}
