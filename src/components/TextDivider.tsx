type TextDividerProps = {
  text?: React.ReactNode
  className?: string // 外层额外样式
  lineClassName?: string // 线条样式
  contentClassName?: string // 标签样式
}

export default function TextDivider({
  text,
  className = 'my-4',
  lineClassName = 'h-px flex-1 bg-default-200',
  contentClassName = 'px-3 text-small text-default-500 bg-content1 rounded'
}: TextDividerProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <div className={lineClassName} />
      {text ? <span className={contentClassName}>{text}</span> : null}
      <div className={lineClassName} />
    </div>
  )
}
