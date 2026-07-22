import React from 'react'

export function Button({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  variant = 'primary',
  size = 'md',
  ...props
}) {
  const baseClasses = 'rounded-xl font-medium transition-colors duration-200 flex justify-center items-center focus:outline-none'
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-hover',
    secondary: 'bg-surface-white border border-primary text-primary hover:bg-background-main',
    danger: 'bg-error text-white hover:opacity-90',
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  const combinedClasses = `${baseClasses} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClasses}
      {...props}
    >
      {children}
    </button>
  )
}
