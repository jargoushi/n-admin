import { useState, useCallback } from 'react';

// 1. 定义通用的对话框状态类型
export interface GenericDialogState<T = any> {
  type: string | null; // 对话框的唯一标识符 (例如: 'init', 'distribute', 'detail')
  data: T | null; // 传入对话框的数据 (例如: 详情数据)
  open: boolean;
}

/**
 * 通用对话框管理 Hook
 * @returns 包含状态和操作函数的对象
 */
export function useGenericDialogs<T = any>() {
  const [dialogState, setDialogState] = useState<GenericDialogState<T>>({
    type: null,
    data: null,
    open: false
  });

  /**
   * 打开指定类型的对话框，可传入初始数据
   * @param type - 对话框类型标识符
   * @param data - 传递给对话框的数据
   */
  const openDialog = useCallback((type: string, data: T | null = null) => {
    setDialogState({ type, data, open: true });
  }, []);

  /**
   * 关闭当前对话框
   * @param callback - 可选的回调函数，在关闭后执行 (例如: 刷新列表)
   */
  const closeDialog = useCallback((callback?: () => void) => {
    setDialogState({ type: null, data: null, open: false });
    if (callback) {
      callback();
    }
  }, []);

  return {
    dialogState,
    openDialog,
    closeDialog,
    setDialogState // 提供一个设置原始状态的方法以应对特殊场景
  };
}
