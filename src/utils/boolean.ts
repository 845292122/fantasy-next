export class BooleanUtils {
  // 内置真值与假值集合
  private static truthy = new Set(['true', '1', 'yes', 'y', 'on', 'enable', 'enabled'])
  private static falsy = new Set(['false', '0', 'no', 'n', 'off', 'disable', 'disabled', ''])

  /**
   * 解析为布尔值
   */
  static toBoolean(input: unknown): boolean {
    if (typeof input === 'boolean') return input
    if (typeof input === 'number') return input !== 0
    if (input == null) return false
    const str = String(input).trim().toLowerCase()
    if (this.truthy.has(str)) return true
    if (this.falsy.has(str)) return false
    // 其他非空字符串默认 true
    return !!str
  }

  /**
   * 解析为 1 | 0（适合后端 status / isActive 数字字段）
   */
  static toNumericFlag(input: unknown): 1 | 0 {
    return this.toBoolean(input) ? 1 : 0
  }

  /**
   * 允许动态扩展真值
   */
  static addTruthy(...values: string[]) {
    values.forEach(v => this.truthy.add(v.toLowerCase()))
  }
}
