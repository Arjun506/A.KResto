/**
 * Modern animated UI components for online food ordering platform
 * Includes glass morphism, smooth animations, and cinematic design
 */

'use client';

import React, { ReactNode } from 'react';
import { ChevronDown, Star, Clock, Truck, MapPin, AlertCircle, Check } from 'lucide-react';

// ============================================
// ANIMATED CONTAINER - GLASS MORPHISM
// ============================================

interface GlassContainerProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const GlassContainer: React.FC<GlassContainerProps> = ({ children, className = '', onClick }) => (
  <div
    onClick={onClick}
    className={`glass p-4 sm:p-6 transition-all duration-300 ease-out ${className}`}
  >
    {children}
  </div>
);

// ============================================
// ANIMATED BUTTON
// ============================================

interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  loading = false,
  type = 'button',
}) => {
  const baseClasses = `
    font-semibold rounded-2xl transition-all duration-350 ease-out
    transform hover:scale-[1.02] active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100
    focus:outline-none focus:ring-2 focus:ring-offset-2
    flex items-center justify-center gap-2
  `;

  const variants = {
    primary: 'bg-[#4F46E5] text-white hover:bg-[#4338CA] dark:bg-primary dark:hover:bg-primary/95 shadow-md hover:shadow-lg focus:ring-[#4F46E5] dark:focus:ring-primary',
    secondary: 'bg-white dark:bg-surface text-gray-900 dark:text-text-secondary border border-[#E7ECF5] dark:border-border hover:bg-[#F3F7FC] dark:hover:bg-hover-bg focus:ring-slate-500',
    danger: 'bg-[#EF4444] text-white hover:bg-red-700 dark:bg-accent-danger dark:hover:bg-accent-danger/95 shadow-md hover:shadow-lg focus:ring-red-500',
    ghost: 'text-gray-700 dark:text-text-secondary hover:bg-[#F3F7FC] dark:hover:bg-hover-bg',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 h-[48px] text-base',
    lg: 'px-8 h-[54px] text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};

// ============================================
// RESTAURANT CARD - ANIMATED
// ============================================

interface RestaurantCardProps {
  image: string;
  name: string;
  rating: number;
  reviewCount: number;
  deliveryTime: number;
  deliveryCharge: number;
  offer?: number;
  tags: string[];
  onClick?: () => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  image,
  name,
  rating,
  reviewCount,
  deliveryTime,
  deliveryCharge,
  offer,
  tags,
  onClick,
}) => (
  <div
    onClick={onClick}
    className="group relative cursor-pointer rounded-2xl overflow-hidden border border-[#E7ECF5] dark:border-[#1E293B]"
  >
    {/* Image with overlay animation */}
    <div className="relative h-48 overflow-hidden">
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Offer badge */}
      {offer && (
        <div className="absolute top-3 left-3 bg-[#4F46E5] text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
          {offer}% OFF
        </div>
      )}
    </div>

    {/* Content */}
    <GlassContainer className="absolute bottom-0 left-0 right-0 translate-y-1/2 mx-2 group-hover:translate-y-0 transition-transform duration-300">
      <div className="space-y-2">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1">
          {name}
        </h3>

        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{rating}</span>
            <span>({reviewCount})</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{deliveryTime} min</span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-3">
          <span className="text-sm font-bold text-gray-900 dark:text-white">Rs. {price}</span>
          <span
            className="text-xs bg-[#F3F7FC] dark:bg-surface text-[#4F46E5] dark:text-primary px-2 py-1 rounded-full"
          >
            {category}
          </span>
        </div>

        <div className="text-xs text-gray-600 dark:text-gray-400">
          ₹{deliveryCharge} delivery charge
        </div>
      </div>
    </GlassContainer>
  </div>
);

// ============================================
// MENU ITEM CARD - WITH ANIMATIONS
// ============================================

interface MenuItemCardProps {
  image: string;
  name: string;
  description?: string;
  price: number;
  rating?: number;
  isVeg: boolean;
  onAddClick?: () => void;
  onImageClick?: () => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  image,
  name,
  description,
  price,
  rating,
  isVeg,
  onAddClick,
  onImageClick,
}) => (
  <GlassContainer className="cursor-pointer transition-all duration-300 hover:shadow-xl">
    <div className="space-y-3">
      {/* Image */}
      <div
        onClick={onImageClick}
        className="relative h-48 rounded-xl overflow-hidden group cursor-pointer"
      >
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

        {/* Veg/Non-veg badge */}
        <div className={`absolute top-2 left-2 w-6 h-6 rounded border-2 flex items-center justify-center ${isVeg ? 'border-green-500 bg-green-50/50' : 'border-red-500 bg-red-50/50'}`}>
          <div className={`w-2 h-2 rounded-full ${isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
        </div>

        {/* Rating badge */}
        {rating && (
          <div className="absolute top-2 right-2 bg-white/90 dark:bg-slate-900/90 border border-[#E7ECF5] dark:border-[#233045] text-slate-800 dark:text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
            <Star className="w-3 h-3 fill-[#4F46E5] text-[#4F46E5] dark:fill-[#6366F1] dark:text-[#6366F1]" />
            {rating}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-2">
        <h4 className="font-bold text-gray-900 dark:text-white line-clamp-2">
          {name}
        </h4>

        {description && (
          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
            {description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <span className="font-bold text-lg text-gray-900 dark:text-white">
            ₹{price}
          </span>
          <AnimatedButton
            variant="primary"
            size="sm"
            onClick={onAddClick}
          >
            + Add
          </AnimatedButton>
        </div>
      </div>
    </div>
  </GlassContainer>
);

// ============================================
// SEARCH BAR - ANIMATED
// ============================================

interface AnimatedSearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const AnimatedSearchBar: React.FC<AnimatedSearchBarProps> = ({
  placeholder = 'Search restaurants or dishes...',
  value,
  onChange,
  onFocus,
  onBlur,
}) => (
  <GlassContainer className="w-full rounded-2xl">
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={onFocus}
      onBlur={onBlur}
      className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none text-lg"
    />
  </GlassContainer>
);

// ============================================
// FILTER CHIP - ANIMATED
// ============================================

interface FilterChipProps {
  label: string;
  icon?: ReactNode;
  selected?: boolean;
  onClick?: () => void;
}

export const FilterChip: React.FC<FilterChipProps> = ({
  label,
  icon,
  selected = false,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-150 ${
        selected
        ? 'bg-[#4F46E5] dark:bg-primary text-white shadow-md'
        : 'bg-white dark:bg-surface text-gray-700 dark:text-text-secondary border border-[#E7ECF5] dark:border-border'
      }`}
  >
    {icon}
    {label}
  </button>
);

// ============================================
// ANIMATED LOADING SKELETON
// ============================================

export const SkeletonCard: React.FC = () => (
  <div className="rounded-2xl overflow-hidden space-y-4">
    <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
    <div className="space-y-3 px-4">
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse w-3/4" />
      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse w-2/3" />
    </div>
  </div>
);

// ============================================
// STATUS BADGE - ANIMATED
// ============================================

interface StatusBadgeProps {
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'picked_up' | 'in_delivery' | 'delivered' | 'cancelled';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    pending: { label: 'Pending', color: 'bg-cyan-50 text-cyan-600 dark:bg-accent-cyan/15 dark:text-accent-cyan', icon: null },
    accepted: { label: 'Accepted', color: 'bg-blue-50 text-blue-600 dark:bg-accent-blue/10 dark:text-accent-blue', icon: Check },
    preparing: { label: 'Preparing', color: 'bg-purple-50 text-purple-600 dark:bg-accent-purple/10 dark:text-accent-purple', icon: null },
    ready: { label: 'Ready to Pick', color: 'bg-green-50 text-green-600 dark:bg-accent-emerald/10 dark:text-accent-emerald', icon: Check },
    picked_up: { label: 'Picked Up', color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400', icon: Truck },
    in_delivery: { label: 'On the Way', color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400', icon: Truck },
    delivered: { label: 'Delivered', color: 'bg-emerald-50 text-emerald-600 dark:bg-accent-emerald/10 dark:text-accent-emerald', icon: Check },
    cancelled: { label: 'Cancelled', color: 'bg-red-50 text-red-600 dark:bg-accent-danger/10 dark:text-accent-danger', icon: null },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 ${config.color}`}>
      {Icon && <Icon className="w-4 h-4" />}
      {config.label}
    </div>
  );
};

// ============================================
// ANIMATED POPUP/MODAL
// ============================================

interface AnimatedPopupProps {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  actions?: ReactNode;
}

export const AnimatedPopup: React.FC<AnimatedPopupProps> = ({
  isOpen,
  title,
  children,
  onClose,
  actions,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Popup */}
      <div className="relative bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-3xl w-full sm:w-96 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-5 duration-300">
        <div className="sticky top-0 bg-white dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          {children}
        </div>

        {actions && (
          <div className="sticky bottom-0 bg-white dark:bg-gray-900 px-6 py-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// ORDER TIMELINE - ANIMATED
// ============================================

interface TimelineEvent {
  status: string;
  timestamp: string;
  description?: string;
}

interface OrderTimelineProps {
  events: TimelineEvent[];
  currentStatus: string;
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ events, currentStatus }) => (
  <GlassContainer>
    <div className="space-y-6">
      {events.map((event, index) => (
        <div key={index} className="flex gap-4">
          {/* Timeline dot */}
          <div className="flex flex-col items-center">
            <div
              className={`
                w-4 h-4 rounded-full transition-all duration-300
                ${currentStatus === event.status
                  ? 'bg-[#4F46E5] dark:bg-[#6366F1] ring-4 ring-[#4F46E5]/15 dark:ring-[#6366F1]/20'
                  : 'bg-gray-300 dark:bg-gray-600'
                }
              `}
            />
            {index < events.length - 1 && (
              <div className="w-1 h-12 bg-gray-300 dark:bg-gray-600 mt-2" />
            )}
          </div>

          {/* Content */}
          <div className="pt-1">
            <p className="font-semibold text-gray-900 dark:text-white">
              {event.status}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {new Date(event.timestamp).toLocaleString()}
            </p>
            {event.description && (
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                {event.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  </GlassContainer>
);

// ============================================
// NOTIFICATION/ALERT COMPONENT
// ============================================

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ type, title, message, onClose }) => {
  const variants = {
    success: { bg: 'bg-green-50 dark:bg-accent-emerald/10', border: 'border-green-200 dark:border-accent-emerald/20', icon: '✓', color: 'text-green-600 dark:text-accent-emerald' },
    error: { bg: 'bg-red-50 dark:bg-accent-danger/10', border: 'border-red-200 dark:border-accent-danger/20', icon: '⚠', color: 'text-red-600 dark:text-accent-danger' },
    warning: { bg: 'bg-purple-50 dark:bg-accent-purple/10', border: 'border-purple-200 dark:border-accent-purple/20', icon: '!', color: 'text-purple-600 dark:text-accent-purple' },
    info: { bg: 'bg-blue-50 dark:bg-accent-blue/10', border: 'border-blue-200 dark:border-accent-blue/20', icon: 'i', color: 'text-blue-600 dark:text-accent-blue' },
  };

  const config = variants[type];

  return (
    <div
      className={`
        ${config.bg} border ${config.border}
        rounded-xl p-4 flex items-start gap-3
        animate-in slide-in-from-top-5 duration-300
      `}
    >
      <div className={`text-lg font-bold ${config.color}`}>
        {config.icon}
      </div>
      <div className="flex-1">
        <p className="font-semibold text-gray-900 dark:text-white">
          {title}
        </p>
        {message && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {message}
          </p>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          ✕
        </button>
      )}
    </div>
  );
};

// ============================================
// DELIVERY PARTNER CARD
// ============================================

interface DeliveryPartnerCardProps {
  name: string;
  rating: number;
  image?: string;
  vehicle: string;
  distance?: number;
  estimatedTime?: number;
}

export const DeliveryPartnerCard: React.FC<DeliveryPartnerCardProps> = ({
  name,
  rating,
  image,
  vehicle,
  distance,
  estimatedTime,
}) => (
  <GlassContainer className="flex items-center gap-4">
    <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
      <img
        src={image || '/images/default-avatar.png'}
        alt={name}
        className="w-full h-full object-cover"
      />
    </div>

    <div className="flex-1 min-w-0">
      <h4 className="font-bold text-gray-900 dark:text-white truncate">
        {name}
      </h4>
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span>{rating}</span>
        <span>• {vehicle}</span>
      </div>
      {distance && estimatedTime && (
        <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          {distance} km • {estimatedTime} min
        </div>
      )}
    </div>
  </GlassContainer>
);

