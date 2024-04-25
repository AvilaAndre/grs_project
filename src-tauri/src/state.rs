use tauri::{AppHandle, Manager, State};

use crate::manager::ConfigManager;

pub struct AppState {
    pub manager: std::sync::Mutex<Option<ConfigManager>>,
}

pub trait ServiceAccess {
    fn manager<F, TResult>(&self, operation: F) -> TResult
    where
        F: FnOnce(&ConfigManager) -> TResult;

    fn manager_mut<F, TResult>(&self, operation: F) -> TResult
    where
        F: FnOnce(&mut ConfigManager) -> TResult;
}

impl ServiceAccess for AppHandle {
    fn manager<F, TResult>(&self, operation: F) -> TResult
    where
        F: FnOnce(&ConfigManager) -> TResult,
    {
        let app_state: State<AppState> = self.state();
        let manager_connection_guard = app_state.manager.lock().unwrap();
        let manager = manager_connection_guard.as_ref().unwrap();

        operation(manager)
    }

    fn manager_mut<F, TResult>(&self, operation: F) -> TResult
    where
        F: FnOnce(&mut ConfigManager) -> TResult,
    {
        let app_state: State<AppState> = self.state();
        let mut manager_connection_guard = app_state.manager.lock().unwrap();
        let manager = manager_connection_guard.as_mut().unwrap();

        operation(manager)
    }
}
