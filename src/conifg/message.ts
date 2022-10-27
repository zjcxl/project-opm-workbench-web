import type { MessageUtilConfig } from '@dc-basic-component/config'
import { createDiscreteApi } from 'naive-ui'

const {
  message: messageUtil,
  dialog: dialogUtil,
} = createDiscreteApi(['message', 'dialog'])

/**
 * 信息配置
 */
export const messageConfig: MessageUtilConfig<string, void> = {
  method: {
    success(content: string, duration?: number, onClose?: () => void): void {
      messageUtil.success(content, {
        duration,
        onClose,
      })
    },
    info(content: string, duration?: number, onClose?: () => void): void {
      messageUtil.info(content, {
        duration,
        onClose,
      })
    },
    warning(content: string, duration?: number, onClose?: () => void): void {
      messageUtil.warning(content, {
        duration,
        onClose,
      })
    },
    error(content: string, duration?: number, onClose?: () => void): void {
      messageUtil.error(content, {
        duration,
        onClose,
      })
    },
    loading(content: string, duration?: number, onClose?: () => void): void {
      messageUtil.loading(content, {
        duration,
        onClose,
      })
    },
    confirm(title: string | (() => string), ok?: () => void, cancel?: () => void): void {
      dialogUtil.success({
        onPositiveClick: ok,
        onNegativeClick: cancel,
        positiveText: '确定',
        negativeText: '取消',
        content: title,
        title: '确认信息',
      })
    },
  },
}
