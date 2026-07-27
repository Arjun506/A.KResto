import React, { ForwardRefRenderFunction, useId, useState } from 'react';

// ==========================================
// TYPOGRAPHY Component
// ==========================================
export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
  color?: 'primary' | 'secondary' | 'muted';
}
export const Typography: React.FC<TypographyProps> = ({
  children,
  variant = 'body',
  color = 'primary',
  className = '',
  ...props
}) => {
  const tags = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    body: 'p',
    caption: 'span',
  };
  const Tag = tags[variant] as any;
  const classes = `
    ${variant === 'h1' ? 'text-3xl font-black' : ''}
    ${variant === 'h2' ? 'text-2xl font-bold' : ''}
    ${variant === 'h3' ? 'text-xl font-semibold' : ''}
    ${variant === 'body' ? 'text-base font-normal' : ''}
    ${variant === 'caption' ? 'text-xs font-medium' : ''}
    ${color === 'primary' ? 'text-slate-900 dark:text-slate-100' : ''}
    ${color === 'secondary' ? 'text-slate-600 dark:text-slate-400' : ''}
    ${color === 'muted' ? 'text-slate-400 dark:text-slate-500' : ''}
    ${className}
  `;
  return <Tag className={classes} {...props}>{children}</Tag>;
};

// ==========================================
// BUTTON & ICON BUTTON Components
// ==========================================
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', size = 'md', loading = false, className = '', disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:pointer-events-none rounded-xl';
    const variants = {
      primary: 'bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600',
      secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
      outline: 'border border-slate-300 text-slate-750 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800',
      ghost: 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
      danger: 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600',
    };
    const sizes = {
      sm: 'h-9 px-3 text-xs',
      md: 'h-11 px-5 text-sm',
      lg: 'h-13 px-7 text-base',
    };
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {loading ? <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : null}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export interface IconButtonProps extends ButtonProps {
  icon: React.ReactNode;
}
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, className = '', ...props }, ref) => {
    return (
      <Button ref={ref} className={`p-2 rounded-full ${className}`} {...props}>
        {icon}
      </Button>
    );
  }
);
IconButton.displayName = 'IconButton';

// ==========================================
// LABEL Component
// ==========================================
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}
export const Label: React.FC<LabelProps> = ({ children, className = '', ...props }) => (
  <label className={`text-sm font-semibold text-slate-800 dark:text-slate-200 ${className}`} {...props}>
    {children}
  </label>
);

// ==========================================
// INPUT, PASSWORD & TEXTAREA Components
// ==========================================
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const defaultId = useId();
    const inputId = id || defaultId;
    return (
      <div className="space-y-2 w-full">
        {label && <Label htmlFor={inputId}>{label}</Label>}
        <input
          ref={ref}
          id={inputId}
          className={`flex h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 ${
            error ? 'border-red-500 focus:ring-red-500' : ''
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref) => {
    const [show, setShow] = useState(false);
    return (
      <div className="relative w-full">
        <Input
          ref={ref}
          type={show ? 'text' : 'password'}
          className={`pr-10 ${className}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-650"
        >
          {show ? 'Hide' : 'Show'}
        </button>
      </div>
    );
  }
);
PasswordInput.displayName = 'PasswordInput';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
}
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const defaultId = useId();
    const textareaId = id || defaultId;
    return (
      <div className="space-y-2 w-full">
        {label && <Label htmlFor={textareaId}>{label}</Label>}
        <textarea
          ref={ref}
          id={textareaId}
          className={`flex min-h-24 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 ${
            error ? 'border-red-500 focus:ring-red-500' : ''
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

// ==========================================
// CHECKBOX, RADIO & SWITCH Components
// ==========================================
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = '', id, ...props }, ref) => {
    const defaultId = useId();
    const checkboxId = id || defaultId;
    return (
      <div className="flex items-center space-x-2">
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          className={`h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950 ${className}`}
          {...props}
        />
        {label && <Label htmlFor={checkboxId}>{label}</Label>}
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}
export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ label, className = '', id, ...props }, ref) => {
    const defaultId = useId();
    const radioId = id || defaultId;
    return (
      <div className="flex items-center space-x-2">
        <input
          ref={ref}
          type="radio"
          id={radioId}
          className={`h-4 w-4 border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950 ${className}`}
          {...props}
        />
        {label && <Label htmlFor={radioId}>{label}</Label>}
      </div>
    );
  }
);
Radio.displayName = 'Radio';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}
export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, className = '', id, checked, onChange, ...props }, ref) => {
    const defaultId = useId();
    const switchId = id || defaultId;
    return (
      <div className="flex items-center space-x-2">
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={() => onChange && onChange({ target: { checked: !checked } } as any)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            checked ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
          } ${className}`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition-transform ${
              checked ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
        {label && <Label htmlFor={switchId}>{label}</Label>}
        <input
          ref={ref}
          type="checkbox"
          id={switchId}
          checked={checked}
          onChange={onChange}
          className="sr-only"
          {...props}
        />
      </div>
    );
  }
);
Switch.displayName = 'Switch';

// ==========================================
// BADGE & AVATAR Components
// ==========================================
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
}
export const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
    secondary: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-350',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback: string;
}
export const Avatar: React.FC<AvatarProps> = ({ src, alt, fallback, className = '', ...props }) => (
  <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 ${className}`} {...props}>
    {src ? (
      <img src={src} alt={alt} className="aspect-square h-full w-full object-cover" />
    ) : (
      <span className="flex h-full w-full items-center justify-center rounded-full font-bold text-slate-650 dark:text-slate-300 text-sm">
        {fallback}
      </span>
    )}
  </div>
);

// ==========================================
// CARD Component
// ==========================================
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}
export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => (
  <div className={`rounded-3xl border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 ${className}`} {...props}>
    {children}
  </div>
);

// ==========================================
// DIVIDER, SPINNER & SKELETON Components
// ==========================================
export const Divider: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', ...props }) => (
  <div className={`h-[1px] w-full bg-slate-200 dark:bg-slate-850 ${className}`} {...props} />
);

export const Spinner: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', ...props }) => (
  <div className={`animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600 h-8 w-8 dark:border-slate-800 dark:border-t-indigo-500 ${className}`} {...props} />
);

export const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', ...props }) => (
  <div className={`animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800 ${className}`} {...props} />
);

// ==========================================
// ALERT Component
// ==========================================
export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
}
export const Alert: React.FC<AlertProps> = ({ children, variant = 'info', title, className = '', ...props }) => {
  const variants = {
    info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/10 dark:border-blue-900/20 dark:text-blue-300',
    success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/10 dark:border-green-900/20 dark:text-green-300',
    warning: 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/10 dark:border-amber-900/20 dark:text-amber-300',
    danger: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/10 dark:border-red-900/20 dark:text-red-300',
  };
  return (
    <div className={`rounded-2xl border p-4 text-sm ${variants[variant]} ${className}`} {...props}>
      {title && <h5 className="font-bold mb-1">{title}</h5>}
      {children}
    </div>
  );
};

// ==========================================
// PROGRESS Component
// ==========================================
export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
}
export const Progress: React.FC<ProgressProps> = ({ value, className = '', ...props }) => (
  <div className={`h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden ${className}`} {...props}>
    <div
      className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-300"
      style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
    />
  </div>
);

// ==========================================
// CONTAINER, STACK & GRID Components
// ==========================================
export const Container: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full ${className}`} {...props}>
    {children}
  </div>
);

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'col';
  spacing?: number; // Tailwind spacing values 1 to 8
}
export const Stack: React.FC<StackProps> = ({ children, direction = 'col', spacing = 4, className = '', ...props }) => (
  <div
    className={`flex ${direction === 'row' ? 'flex-row items-center' : 'flex-col'} ${
      spacing === 1 ? 'gap-1' : ''
    } ${spacing === 2 ? 'gap-2' : ''} ${spacing === 3 ? 'gap-3' : ''} ${
      spacing === 4 ? 'gap-4' : ''
    } ${spacing === 5 ? 'gap-5' : ''} ${spacing === 6 ? 'gap-6' : ''} ${
      spacing === 7 ? 'gap-7' : ''
    } ${spacing === 8 ? 'gap-8' : ''} ${className}`}
    {...props}
  >
    {children}
  </div>
);

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: number; // 1 to 4 columns grid
}
export const Grid: React.FC<GridProps> = ({ children, cols = 3, className = '', ...props }) => {
  const columns = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  };
  return (
    <div className={`grid ${columns[cols as 1 | 2 | 3 | 4]} gap-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

// ==========================================
// METRIC CARD Component
// ==========================================
export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon?: React.ReactNode;
}
export const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, isPositive = true, icon, className = '', ...props }) => (
  <Card className={`relative overflow-hidden ${className}`} {...props}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">{title}</p>
        <h3 className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-slate-100">{value}</h3>
        {change && (
          <div className="mt-2 flex items-center text-xs font-bold">
            <span className={isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
              {isPositive ? '↑' : '↓'} {change}
            </span>
            <span className="ml-1.5 text-slate-600 dark:text-slate-400">vs last period</span>
          </div>
        )}
      </div>
      {icon && <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">{icon}</div>}
    </div>
  </Card>
);

// ==========================================
// STANDARD APPLICATION STATES
// ==========================================
export interface StateComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<StateComponentProps> = ({ title, description, actionLabel, onAction, icon, className = '', ...props }) => (
  <div className={`flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl ${className}`} {...props}>
    {icon ? <div className="mb-4 text-slate-600 dark:text-slate-400">{icon}</div> : <div className="mb-4 text-4xl">📂</div>}
    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h4>
    <p className="mt-1 max-w-sm text-sm text-slate-600 dark:text-slate-400">{description}</p>
    {actionLabel && onAction && (
      <Button onClick={onAction} className="mt-4" size="sm">
        {actionLabel}
      </Button>
    )}
  </div>
);

export const ErrorState: React.FC<StateComponentProps> = ({ title, description, actionLabel = 'Try Again', onAction, className = '', ...props }) => (
  <div className={`flex flex-col items-center justify-center p-8 text-center bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 rounded-3xl ${className}`} {...props}>
    <div className="mb-4 text-4xl text-rose-500">⚠️</div>
    <h4 className="text-lg font-bold text-rose-900 dark:text-rose-100">{title}</h4>
    <p className="mt-1 max-w-sm text-sm text-rose-600 dark:text-rose-400">{description}</p>
    {onAction && (
      <Button onClick={onAction} variant="danger" className="mt-4" size="sm">
        {actionLabel}
      </Button>
    )}
  </div>
);

export const OfflineState: React.FC<StateComponentProps> = ({ title = 'You are Offline', description = 'Changes saved locally will sync automatically when connection returns.', actionLabel, onAction, className = '', ...props }) => (
  <div className={`flex flex-col items-center justify-center p-8 text-center bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-3xl ${className}`} {...props}>
    <div className="mb-4 text-4xl text-amber-500">📡</div>
    <h4 className="text-lg font-bold text-amber-900 dark:text-amber-100">{title}</h4>
    <p className="mt-1 max-w-sm text-sm text-amber-600 dark:text-amber-400">{description}</p>
    {actionLabel && onAction && (
      <Button onClick={onAction} variant="secondary" className="mt-4" size="sm">
        {actionLabel}
      </Button>
    )}
  </div>
);

export const PermissionDenied: React.FC<StateComponentProps> = ({ title = 'Access Denied', description = 'You do not have the required permissions to view this module.', className = '', ...props }) => (
  <div className={`flex flex-col items-center justify-center p-8 text-center bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl ${className}`} {...props}>
    <div className="mb-4 text-4xl text-slate-600 dark:text-slate-400">🔒</div>
    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h4>
    <p className="mt-1 max-w-sm text-sm text-slate-600 dark:text-slate-400">{description}</p>
  </div>
);

export const UpgradeRequired: React.FC<StateComponentProps> = ({ title = 'Plan Upgrade Required', description = 'This feature is available on higher subscription tier plans.', actionLabel = 'Upgrade Subscription', onAction, className = '', ...props }) => (
  <div className={`flex flex-col items-center justify-center p-8 text-center bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/30 rounded-3xl ${className}`} {...props}>
    <div className="mb-4 text-4xl text-indigo-500">⭐</div>
    <h4 className="text-lg font-bold text-indigo-900 dark:text-indigo-100">{title}</h4>
    <p className="mt-1 max-w-sm text-sm text-indigo-600 dark:text-indigo-400">{description}</p>
    {onAction && (
      <Button onClick={onAction} variant="primary" className="mt-4" size="sm">
        {actionLabel}
      </Button>
    )}
  </div>
);
