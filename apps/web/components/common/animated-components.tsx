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
    className={`
      backdrop-blur-xl bg-white/10 dark:bg-white/5
      border border-white/20 dark:border-white/10
      rounded-2xl p-4 sm:p-6
      transition-all duration-300 ease-out
      hover:bg-white/15 dark:hover:bg-white/8
      hover:border-white/30 dark:hover:border-white/15
      hover:shadow-2xl
      ${className}
    `}
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
    font-semibold rounded-xl transition-all duration-300 ease-out
    transform hover:scale-105 active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100
    focus:outline-none focus:ring-2 focus:ring-offset-2
    flex items-center justify-center gap-2
  `;

  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl focus:ring-purple-500',
    secondary: 'bg-white/20 dark:bg-white/10 text-gray-900 dark:text-white border border-white/30 dark:border-white/20 hover:bg-white/30 dark:hover:bg-white/15 focus:ring-blue-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-xl focus:ring-red-500',
    ghost: 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
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
    className="group relative cursor-pointer rounded-2xl overflow-hidden"
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
        <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
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

        <div className="flex gap-2 flex-wrap">
          {tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
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
          <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-400 to-orange-400 text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
            <Star className="w-3 h-3 fill-white" />
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
  <GlassContainer className="w-full">
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
    className={`
      px-4 py-2 rounded-full transition-all duration-300 ease-out
      flex items-center gap-2 font-medium whitespace-nowrap
      ${selected
        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
        : 'bg-white/10 dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-white/20 hover:bg-white/20 dark:hover:bg-white/10'
      }
    `}
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
    <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-xl animate-pulse" />
    <div className="space-y-3 px-4">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse w-3/4" />
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse w-2/3" />
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
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300', icon: null },
    accepted: { label: 'Accepted', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300', icon: Check },
    preparing: { label: 'Preparing', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300', icon: null },
    ready: { label: 'Ready to Pick', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', icon: Check },
    picked_up: { label: 'Picked Up', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300', icon: Truck },
    in_delivery: { label: 'On the Way', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300', icon: Truck },
    delivered: { label: 'Delivered', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300', icon: Check },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300', icon: null },
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
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 ring-4 ring-purple-200 dark:ring-purple-900'
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
  const alertConfig = {
    success: { bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800', icon: '✓', color: 'text-green-600 dark:text-green-400' },
    error: { bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800', icon: '⚠', color: 'text-red-600 dark:text-red-400' },
    warning: { bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-200 dark:border-yellow-800', icon: '!', color: 'text-yellow-600 dark:text-yellow-400' },
    info: { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800', icon: 'i', color: 'text-blue-600 dark:text-blue-400' },
  };

  const config = alertConfig[type];

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
