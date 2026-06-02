#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{
    AppHandle, CustomMenuItem, Manager, SystemTray,
    SystemTrayEvent, SystemTrayMenu, WindowBuilder, WindowUrl,
};

#[tauri::command]
fn open_overlay(app: AppHandle, data: String) {
    match app.get_window("overlay") {
        Some(win) => {
            win.show().unwrap();
            win.set_always_on_top(true).unwrap();
            win.emit("layout-data", data).unwrap();
        }
        None => {
            let win = WindowBuilder::new(
                &app,
                "overlay",
                WindowUrl::App("overlay.html".into()),
            )
            .title("배치 도우미")
            .inner_size(600.0, 500.0)
            .min_inner_size(200.0, 200.0)
            .decorations(false)
            .transparent(true)
            .always_on_top(true)
            .resizable(true)
            .build()
            .unwrap();

            let win2 = win.clone();
            let data2 = data.clone();
            win.once("overlay-ready", move |_| {
                win2.emit("layout-data", data2).unwrap();
            });
        }
    }
}

#[tauri::command]
fn close_overlay(app: AppHandle) {
    if let Some(win) = app.get_window("overlay") {
        win.hide().unwrap();
    }
}

#[tauri::command]
fn save_calibration(
    app: AppHandle,
    cell_size: f64,
    drag_ratio: f64,
    scroll_ratio: f64,
) {
    app.emit_all("calibration-saved", serde_json::json!({
        "cell_size": cell_size,
        "drag_ratio": drag_ratio,
        "scroll_ratio": scroll_ratio,
    }))
    .unwrap();
}

#[tauri::command]
fn check_game_running() -> bool {
    #[cfg(target_os = "windows")]
    {
        use std::process::Command;
        if let Ok(output) = Command::new("tasklist").output() {
            let stdout = String::from_utf8_lossy(&output.stdout);
            return stdout.to_lowercase().contains("endfield");
        }
        false
    }
    #[cfg(not(target_os = "windows"))]
    {
        false
    }
}

fn main() {
    let tray_menu = SystemTrayMenu::new()
        .add_item(CustomMenuItem::new("open", "계산기 열기"))
        .add_item(CustomMenuItem::new("overlay", "배치 도우미"))
        .add_native_item(tauri::SystemTrayMenuItem::Separator)
        .add_item(CustomMenuItem::new("quit", "종료"));

    let tray = SystemTray::new().with_menu(tray_menu);

    tauri::Builder::default()
        .system_tray(tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "open" => {
                    if let Some(win) = app.get_window("main") {
                        win.show().unwrap();
                        win.set_focus().unwrap();
                    }
                }
                "overlay" => {
                    open_overlay(app.clone(), "{}".to_string());
                }
                "quit" => {
                    std::process::exit(0);
                }
                _ => {}
            },
            SystemTrayEvent::LeftClick { .. } => {
                if let Some(win) = app.get_window("main") {
                    win.show().unwrap();
                    win.set_focus().unwrap();
                }
            }
            _ => {}
        })
        .invoke_handler(tauri::generate_handler![
            open_overlay,
            close_overlay,
            save_calibration,
            check_game_running,
        ])
        .on_window_event(|event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event.event() {
                if event.window().label() == "main" {
                    event.window().hide().unwrap();
                    api.prevent_close();
                }
            }
        })
        .run(tauri::generate_context!())
        .expect("앱 실행 중 오류 발생");
}