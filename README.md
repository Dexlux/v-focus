# v-focus 自动聚焦指令

一个优雅的 Vue3 自定义指令，用于处理表单输入框的自动聚焦。支持 Element Plus 等 UI 组件库，可以让你从繁琐的 `ref` 和 `nextTick` 中解脱出来。

## ✨ 特性

- 🎯 智能识别输入框元素
- 🔄 支持动态更新
- 🎨 完美配合 Element Plus
- 🛡️ 类型安全
- 🧹 自动资源清理

## 📦 安装

```bash
# 复制 focus.ts 到你的项目目录
cp focus.ts src/directives/

# 在 main.ts 中注册
app.directive('focus', vFocus)
```

## 🚀 使用

### 基础用法

```vue
<!-- 普通输入框自动聚焦 -->
<el-input v-focus />

<!-- 数字输入框自动聚焦 -->
<el-input-number v-focus />

<!-- 文本域自动聚焦 -->
<el-textarea v-focus />
```

### 进阶用法

```vue
<!-- 禁用自动聚焦 -->
<el-input v-focus="false" />

<!-- 自定义聚焦目标 -->
<div v-focus="{ target: '.custom-input' }">
  <input class="custom-input" />
</div>
```

## ⚙️ 配置项

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `target` | 目标元素选择器 | `string` | `'input, textarea'` |
| `enabled` | 是否启用自动聚焦 | `boolean` | `true` |

## 💡 工作原理

1. 指令会在元素挂载时自动寻找合适的输入框
2. 使用 IntersectionObserver 监听元素可见性
3. 元素进入视口时触发聚焦
4. 自动处理文本选择和光标位置
5. 组件卸载时清理资源

## 🎯 最佳实践

```vue
<!-- 在弹窗中使用 -->
<el-dialog v-model="visible">
  <el-form>
    <el-input v-focus placeholder="我会自动聚焦" />
  </el-form>
</el-dialog>

<!-- 在表单中使用 -->
<el-form>
  <el-form-item label="用户名">
    <el-input v-focus />
  </el-form-item>
</el-form>
```

## 🤝 贡献

欢迎提交 Issue 和 PR，一起让这个指令变得更好！

## 📝 注意事项

- 确保目标元素是可聚焦的
- 在动态渲染的组件中使用时，建议配合 `v-show` 而不是 `v-if`
- 如果遇到聚焦时机不对，可以尝试调整父元素的渲染时序

## 📄 协议

Apache License 2.0
