// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{
    AppHandle, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu,
    CustomMenuItem, Window, WindowBuilder, WindowUrl,
};
use std::sync::{Arc, Mutex};

// ── 전역 상태 ──────────────────────────────────────
#[derive(Default)]
struct OverlayState {
    visible: bool,
    x: f64,
    y: f64,
    scale: f64,
    cell_size: f64,
    drag_ratio: f64,
    scroll_ratio: f64,
}

type SharedState = Arc<Mutex<OverlayState>>;

// ── Tauri 커맨드 ────────────────────────────────────

/// 오버레이 창 열기 + 배치 데이터 전달
#[tauri::command]
fn open_overlay(app: AppHandle, data: String) {
    let overlay = app.get_window("overlay");
    match overlay {
        Some(win) => {
            win.show().unwrap();
            win.set_always_on_top(true).unwrap();
            // 배치 데이터 전달
            win.emit("layout-data", data).unwrap();
        }
        None => {
            // 창이 없으면 새로 생성
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
            .skip_taskbar(false)
            .resizable(true)
            .build()
            .unwrap();

            let data_clone = data.clone();
            win.once("overlay-ready", move |_| {
                win.emit("layout-data", data_clone).unwrap();
            });
        }
    }
}

/// 오버레이 창 닫기
#[tauri::command]
fn close_overlay(app: AppHandle) {
    if let Some(win) = app.get_window("overlay") {
        win.hide().unwrap();
    }
}

/// 캘리브레이션 저장
#[tauri::command]
fn save_calibration(
    app: AppHandle,
    cell_size: f64,
    drag_ratio: f64,
    scroll_ratio: f64,
) {
    // tauri store에 저장
    app.emit_all("calibration-saved", serde_json::json!({
        "cell_size": cell_size,
        "drag_ratio": drag_ratio,
        "scroll_ratio": scroll_ratio,
    })).unwrap();
}

/// 오버레이 투명도 설정
#[tauri::command]
fn set_overlay_opacity(app: AppHandle, opacity: f64) {
    if let Some(win) = app.get_window("overlay") {
        win.emit("set-opacity", opacity).unwrap();
    }
}

/// 게임 프로세스 실행 여부 확인
#[tauri::command]
fn check_game_running() -> bool {
    #[cfg(target_os = "windows")]
    {
        use std::process::Command;
        let output = Command::new("tasklist")
            .output()
            .unwrap_or_default();
        let stdout = String::from_utf8_lossy(&output.stdout);
        // 엔드필드 프로세스명 (실제 확인 필요)
        stdout.contains("EndField") || stdout.contains("endfield")
    }
    #[cfg(not(target_os = "windows"))]
    {
        false
    }
}

// ── 메인 ───────────────────────────────────────────
fn main() {
    // 시스템 트레이 설정
    let tray_menu = SystemTrayMenu::new()
        .add_item(CustomMenuItem::new("open".to_string(), "계산기 열기"))
        .add_item(CustomMenuItem::new("overlay".to_string(), "배치 도우미"))
        .add_native_item(tauri::SystemTrayMenuItem::Separator)
        .add_item(CustomMenuItem::new("quit".to_string(), "종료"));

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
        // URL Scheme 처리 (endfield://overlay?data=...)
        .register_uri_scheme_protocol("endfield", |app, request| {
            let uri = request.uri();

            if uri.contains("overlay") {
                // data 파라미터 추출
                let data = if let Some(pos) = uri.find("data=") {
                    uri[pos + 5..].to_string()
                } else {
                    "{}".to_string()
                };

                open_overlay(app.clone(), data);
            }

            // 빈 응답 반환
            tauri::http::ResponseBuilder::new()
                .status(200)
                .body(vec![])
        })
        .invoke_handler(tauri::generate_handler![
            open_overlay,
            close_overlay,
            save_calibration,
            set_overlay_opacity,
            check_game_running,
        ])
        .on_window_event(|event| {
            // 메인 창 닫기 → 트레이로 최소화
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
