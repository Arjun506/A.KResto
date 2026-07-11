'use client';

import { Crown, CreditCard, ChefHat, Users } from 'lucide-react';

interface RoleSelectorProps {
  selectedRole: 'owner' | 'billing' | 'waiter' | 'chef';
  onRoleChange: (role: 'owner' | 'billing' | 'waiter' | 'chef') => void;
}

const roles = [
  {
    id: 'owner' as const,
    label: 'Restaurant Owner',
    description: 'Full admin access',
    icon: Crown,
    color: 'from-purple-500 to-indigo-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
  },
  {
    id: 'billing' as const,
    label: 'Billing Counter',
    description: 'Order & payment',
    icon: CreditCard,
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
  },
  {
    id: 'waiter' as const,
    label: 'Waiter/Staff',
    description: 'Table service',
    icon: Users,
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50 dark:bg-green-950/30',
  },
  {
    id: 'chef' as const,
    label: 'Kitchen/Chef',
    description: 'Order preparation',
    icon: ChefHat,
    color: 'from-orange-500 to-red-600',
    bgColor: 'bg-orange-50 dark:bg-orange-950/30',
  },
];

export default function RoleSelector({ selectedRole, onRoleChange }: RoleSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
          Select Your Role
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Choose your position to access the appropriate dashboard
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;
          
          return (
            <button
              key={role.id}
              onClick={() => onRoleChange(role.id)}
              className={`relative p-4 rounded-xl border-2 transition-all duration-300 group overflow-hidden ${
                isSelected
                  ? `border-current bg-gradient-to-br ${role.color} text-white shadow-lg scale-105`
                  : `border-slate-200 dark:border-slate-700 ${role.bgColor} text-slate-900 dark:text-white hover:border-slate-300 dark:hover:border-slate-600`
              }`}
              style={isSelected ? { borderColor: 'currentColor' } : {}}
            >
              <div className="flex flex-col items-center gap-2">
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold line-clamp-2">{role.label}</p>
                  <p className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
                    {role.description}
                  </p>
                </div>
              </div>
              
              {/* Active indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full border-2 border-current" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
