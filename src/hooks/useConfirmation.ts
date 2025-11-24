import { useState, useCallback, ReactNode } from 'react';

/**
 * 确认框配置接口
 */
export interface ConfirmationOptions {
  title: string;
  description?: ReactNode; // 支持 JSX，方便传入复杂排版
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive'; // 区分普通/危险操作
  onConfirm: () => Promise<void> | void; // 核心：闭包函数，直接包含业务逻辑
}

interface ConfirmationState extends ConfirmationOptions {
  isOpen: boolean;
  isLoading: boolean;
}

const DEFAULT_OPTIONS: Partial<ConfirmationOptions> = {
  confirmText: '确认',
  cancelText: '取消',
  variant: 'default'
};

export function useConfirmation() {
  const [state, setState] = useState<ConfirmationState>({
    isOpen: false,
    isLoading: false,
    title: '',
    onConfirm: async () => {}
  });

  /**
   * 唤起确认框
   * @param options 本次确认的配置
   */
  const confirm = useCallback((options: ConfirmationOptions) => {
    setState({
      ...DEFAULT_OPTIONS,
      ...options,
      isOpen: true,
      isLoading: false
    });
  }, []);

  /**
   * 关闭确认框
   */
  const close = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  /**
   * 处理点击确认
   */
  const handleConfirm = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      await state.onConfirm();
      close();
    } catch (error) {
      // 如果业务层抛出错误，停止 loading，保持弹窗打开供用户重试
      setState((prev) => ({ ...prev, isLoading: false }));
      console.error('Confirmation action failed:', error);
    }
  }, [state.onConfirm, close]);

  return {
    confirm,
    // 将属性打包，方便 <ConfirmationDialog {...dialogProps} /> 透传
    dialogProps: {
      isOpen: state.isOpen,
      isLoading: state.isLoading,
      title: state.title,
      description: state.description,
      confirmText: state.confirmText,
      cancelText: state.cancelText,
      variant: state.variant,
      onConfirm: handleConfirm,
      onCancel: close
    }
  };
}
