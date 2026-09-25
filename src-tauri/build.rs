fn main() {
    tauri_build::try_build(tauri_build::Attributes::new().plugin(
        "content-resolver",
        tauri_build::InlinedPlugin::new().commands(&["write_text_to_uri"]),
    ))
    .expect("error while running tauri-build");
}
