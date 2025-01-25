/**
 * 自动聚焦指令
 * 功能：当元素进入视口时自动聚焦到指定表单元素，支持动态配置和组件卸载时的资源清理
 */
import { nextTick } from "vue";
import type { Directive, DirectiveBinding } from "vue";

// 配置项类型定义
interface FocusOptions {
  /**
   * 目标元素选择器，用于定位需要聚焦的表单元素
   * @default 'input, textarea'
   * @example 
   * - 使用类选择器：'.custom-input'
   * - 复合选择器：'input[type="text"]'
   */
  target?: string;
  
  /**
   * 是否启用自动聚焦功能
   * @default true
   */
  enabled?: boolean;
}

// 默认配置项
const DEFAULT_OPTIONS: FocusOptions = {
  target: "input, textarea",
  enabled: true,
};

/**
 * 查找目标元素
 * @param el - 指令绑定的宿主元素
 * @param selector - 目标元素选择器
 * @returns 找到的表单元素或null
 */
const findTarget = (el: HTMLElement, selector: string): HTMLElement | null => {
  try {
    // 优先尝试用户自定义选择器
    return el.matches(selector) ? el : el.querySelector(selector);
  } catch {
    // 处理非法选择器的情况，回退到默认选择器
    return el.querySelector('input, textarea');
  }
};

/**
 * 执行聚焦操作
 * @param target - 需要聚焦的目标元素
 */
const focusTarget = (target: HTMLElement) => {
  // 处理标准表单元素
  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
    // 防止聚焦时触发滚动
    target.focus({ preventScroll: true });
    
    // 等待DOM更新后处理文本选择
    nextTick(() => {
      // 安全检查：确保元素仍在文档中
      if (!target.isConnected) return;
      
      if (target.value) {
        // 有内容时全选文本
        target.select();
      } else {
        // 无内容时将光标置于末尾
        target.setSelectionRange(target.value.length, target.value.length);
      }
    });
  } else {
    // 处理非标准表单元素（如contenteditable）
    target.focus();
  }
};

/**
 * 解析指令配置
 * @param binding - 指令绑定值
 * @returns 合并后的配置对象
 */
const parseOptions = (binding: DirectiveBinding<FocusOptions | boolean>): FocusOptions => {
  // 处理布尔简写形式：v-focus="false"
  if (typeof binding.value === "boolean") {
    return { ...DEFAULT_OPTIONS, enabled: binding.value };
  }
  // 合并用户配置和默认配置
  return { ...DEFAULT_OPTIONS, ...binding.value };
};

// 导出自定义指令
export const vFocus: Directive<HTMLElement, FocusOptions | boolean> = {
  /**
   * 元素挂载时执行
   * @param el - 绑定的DOM元素
   * @param binding - 指令绑定值
   */
  mounted(el, binding) {
    const options = parseOptions(binding);
    
    // 检查功能是否启用
    if (!options.enabled || !options.target) return;

    // 创建交叉观察器实例（每个元素独立实例）
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = findTarget(el, options.target!);
          if (target) focusTarget(target);
        }
      });
    });

    // 将观察器实例附加到元素属性（Weak Reference模式）
    (el as any)._focusObserver = observer;
    observer.observe(el);
  },

  /**
   * 元素卸载时执行
   * @param el - 绑定的DOM元素
   */
  unmounted(el) {
    // 清理观察器资源
    const observer = (el as any)._focusObserver;
    if (observer instanceof IntersectionObserver) {
      observer.disconnect();
    }
  }
};
