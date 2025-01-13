// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn init_sql() {
    sql::init_sql().unwrap();
}

#[tauri::command]
fn get_students() -> Vec<Student> {
    let students = sql::get_students()?;
    students
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .invoke_handler(tauri::generate_handler![init_sql])
        .invoke_handler(tauri::generate_handler![get_students])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

mod sql;
use rusqlite::{Error, Result};
