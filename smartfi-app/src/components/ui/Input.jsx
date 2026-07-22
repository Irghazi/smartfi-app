import React, { useId } from 'react'

export function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon,
  className = '',
  ...props
}) {
  const inputId = useId()
  
  // Base classes: bg-[#FFFFFF], border-[#E2E8F0], rounded-xl
  const baseInputClasses = 'w-full bg-surface-white border rounded-xl px-4 py-2.5 transition-all duration-200 outline-none text-text-heading placeholder:text-text-body/50'
  
  // Focus effects: border-[#60A5FA] ditambah efek outer glow (ring)
  const defaultStateClasses = 'border-border-default focus:border-primary focus:ring-4 focus:ring-primary/20'
  
  // Error state: border merah
  const errorStateClasses = 'border-error focus:border-error focus:ring-4 focus:ring-error/20'
  
  const inputClasses = `${baseInputClasses} ${error ? errorStateClasses : defaultStateClasses} ${icon ? 'pl-11' : ''}`

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-text-heading">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 text-text-body/60 pointer-events-none flex items-center justify-center">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={inputClasses}
          {...props}
        />
      </div>
      {error && (
        <span className="text-xs text-error mt-0.5">{error}</span>
      )}
    </div>
  )
}
