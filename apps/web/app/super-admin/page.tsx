'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useTheme } from 'next-themes';
import {
  LayoutDashboard,
  Store,
  Crown,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  Activity,
  Search,
  Bell,
  Plus,
  X,
  CheckCircle,
  XCircle,
  Shield,
  ArrowUpRight,
  LogOut,
  KeyRound,
  Send,
  Copy,
  Eye,
  FileText,
  Mail,
  Smartphone,
  Globe,
  Database,
  Terminal,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Cpu,
  Layers,
  Lock,
  MessageSquare,
  HelpCircle,
  AlertTriangle,
  RefreshCw,
  PhoneCall,
  Laptop,
  Sun,
  Moon
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
  Legend
} from 'recharts';

import {
  getRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant
} from '@/services/restaurant.service';
import { registerUser } from '@/services/auth.service';

type ModulePermissions = {
  orders: boolean;
  billing: boolean;
  menu: boolean;
  qrOrdering: boolean;
  reservations: boolean;
  kitchenPanel: boolean;
  waiterPanel: boolean;
  inventory: boolean;
  purchaseManagement: boolean;
  websiteBuilder: boolean;
  loyaltyProgram: boolean;
  multiBranch: boolean;
};

type LocalTenant = {
  id: string;
  name: string;
  owner: string;
  email?: string;
  phone?: string;
  gstNumber?: string;
  address?: string;
  plan: 'Starter' | 'Pro' | 'Enterprise';
  status: 'Approved' | 'Pending' | 'Suspended' | 'Expired';
  mrr: string;
  expiresAt: string;
  modules: ModulePermissions;
};

type TenantUser = {
  id: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  email: string;
  role: 'OWNER' | 'MANAGER' | 'CASHIER' | 'WAITER' | 'CHEF';
  password: string;
  status: 'Active' | 'Locked' | 'Inactive';
  lastActive: string;
  shiftDetails?: string;
};

type SupportTicket = {
  id: string;
  restaurantName: string;
  subject: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'Pending' | 'Resolved';
  category: 'Billing' | 'Technical' | 'Account' | 'Features';
  date: string;
  messages: { sender: 'Tenant' | 'Support'; text: string; time: string }[];
};

type BranchItem = {
  id: string;
  restaurantName: string;
  branchName: string;
  location: string;
  status: 'Active' | 'Inactive';
  tablesCount: number;
  staffCount: number;
  ordersToday: number;
};

type PaymentLog = {
  id: string;
  invoice: string;
  restaurantName: string;
  plan: string;
  gateway: 'Stripe' | 'Razorpay' | 'UPI' | 'Manual';
  amount: number;
  status: 'Paid' | 'Refunded' | 'Failed';
  date: string;
};

const revenueOverviewData = [
  { month: 'Jan', revenue: 180000, expenses: 90000 },
  { month: 'Feb', revenue: 210000, expenses: 95000 },
  { month: 'Mar', revenue: 240000, expenses: 110000 },
  { month: 'Apr', revenue: 310000, expenses: 120000 },
  { month: 'May', revenue: 290000, expenses: 115000 },
  { month: 'Jun', revenue: 380000, expenses: 130000 },
];

const subPlanShareData = [
  { name: 'Enterprise', value: 34, color: '#6366F1' },
  { name: 'Professional Pro', value: 48, color: '#06B6D4' },
  { name: 'Starter Trial', value: 18, color: '#10B981' },
];

const defaultModules: ModulePermissions = {
  orders: true,
  billing: true,
  menu: true,
  qrOrdering: true,
  reservations: true,
  kitchenPanel: true,
  waiterPanel: true,
  inventory: false,
  purchaseManagement: false,
  websiteBuilder: false,
  loyaltyProgram: false,
  multiBranch: false,
};

export default function SuperAdminPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [currentView, setCurrentView] = useState<
    | 'dashboard'
    | 'restaurants'
    | 'subscriptions'
    | 'users'
    | 'branches'
    | 'revenue'
    | 'analytics'
    | 'communication'
    | 'support'
    | 'website-app'
    | 'system'
    | 'ai-future'
  >('dashboard');

  const [tenants, setTenants] = useState<LocalTenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter for Restaurant table
  const [restFilter, setRestFilter] = useState<'All' | 'Active' | 'Suspended' | 'Trial' | 'Expired' | 'Pending'>('All');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // New Tenant Form State
  const [newRestName, setNewRestName] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newGstNumber, setNewGstNumber] = useState('');
  const [newPlan, setNewPlan] = useState<'Starter' | 'Pro' | 'Enterprise'>('Pro');
  const [newPassword, setNewPassword] = useState('654321');
  const [newModules, setNewModules] = useState<ModulePermissions>({ ...defaultModules });

  // Manage Tenant Modal State
  const [selectedTenant, setSelectedTenant] = useState<LocalTenant | null>(null);

  // Users Directory
  const [tenantUsers, setTenantUsers] = useState<TenantUser[]>([]);

  // Branches Mock Data
  const [branches, setBranches] = useState<BranchItem[]>([
    { id: 'b-1', restaurantName: 'Spice Corner', branchName: 'MG Road Main', location: 'Bengaluru', status: 'Active', tablesCount: 15, staffCount: 12, ordersToday: 48 },
    { id: 'b-2', restaurantName: 'Spice Corner', branchName: 'Indiranagar Hub', location: 'Bengaluru', status: 'Active', tablesCount: 10, staffCount: 8, ordersToday: 35 },
    { id: 'b-3', restaurantName: 'Food Plaza', branchName: 'Downtown Outlet', location: 'Mumbai', status: 'Active', tablesCount: 22, staffCount: 15, ordersToday: 60 },
    { id: 'b-4', restaurantName: 'Tasty Bites', branchName: 'Mall Road', location: 'Shimla', status: 'Inactive', tablesCount: 8, staffCount: 4, ordersToday: 0 }
  ]);

  // Payment Logs
  const [payments, setPayments] = useState<PaymentLog[]>([
    { id: 'p-1', invoice: 'INV-2026-001', restaurantName: 'Spice Corner', plan: 'Professional Pro', gateway: 'Stripe', amount: 2999, status: 'Paid', date: '2026-06-14' },
    { id: 'p-2', invoice: 'INV-2026-002', restaurantName: 'Food Plaza', plan: 'Enterprise Plan', gateway: 'Razorpay', amount: 7500, status: 'Paid', date: '2026-06-13' },
    { id: 'p-3', invoice: 'INV-2026-003', restaurantName: 'Tasty Bites', plan: 'Starter Plan', gateway: 'UPI', amount: 999, status: 'Paid', date: '2026-06-12' },
    { id: 'p-4', invoice: 'INV-2026-004', restaurantName: 'Juice Point', plan: 'Starter Plan', gateway: 'Manual', amount: 999, status: 'Refunded', date: '2026-06-10' }
  ]);

  // Global Alerts Campaign State
  const [alertTarget, setAlertTarget] = useState<'All' | 'Pro' | 'Enterprise'>('All');
  const [alertSubject, setAlertSubject] = useState('');
  const [alertBody, setAlertBody] = useState('');

  // Support Ticketing
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: 'TCK-201',
      restaurantName: 'Spice Corner',
      subject: 'Billing discrepancy with transaction rates',
      priority: 'High',
      status: 'Open',
      category: 'Billing',
      date: '2026-06-14',
      messages: [{ sender: 'Tenant', text: 'Hi, our invoice rates show a commission difference of ₹250 on stripe fees.', time: '10:00 AM' }]
    },
    {
      id: 'TCK-202',
      restaurantName: 'Food Plaza',
      subject: 'QR code builder styling upload issues',
      priority: 'Medium',
      status: 'Pending',
      category: 'Technical',
      date: '2026-06-13',
      messages: [{ sender: 'Tenant', text: 'Having trouble generating SVG codes with custom logo placements.', time: '02:30 PM' }]
    }
  ]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [ticketReplyText, setTicketReplyText] = useState('');

  // Backup & Recovery Log
  const [backups, setBackups] = useState<{ id: string; name: string; size: string; type: string; date: string }[]>([
    { id: 'b1', name: 'weekly_backup_14062026.sql.gz', size: '185 MB', type: 'AUTOMATED', date: '2026-06-14 02:00 AM' },
    { id: 'b2', name: 'manual_backup_preupgrade.sql.gz', size: '180 MB', type: 'MANUAL', date: '2026-06-10 11:30 PM' }
  ]);

  // Platform Audit logs
  const [adminLogs, setAdminLogs] = useState<{ id: string; action: string; category: string; ip: string; date: string }[]>([
    { id: 'l1', action: 'Approved Spice Corner registration', category: 'Tenant', ip: '192.168.1.45', date: '2026-06-17 01:45 PM' },
    { id: 'l2', action: 'Custom module set adjusted for Tasty Bites', category: 'Permissions', ip: '192.168.1.45', date: '2026-06-17 11:20 AM' },
    { id: 'l3', action: 'Database backup weekly_backup_14062026 generated', category: 'System', ip: '10.0.0.12', date: '2026-06-14 02:00 AM' }
  ]);

  // Upgrade requests
  const [upgradeRequests, setUpgradeRequests] = useState<{ id: string; restaurantName: string; currentPlan: string; requestedModule: string; fee: string; date: string; status: 'Pending' | 'Approved' | 'Rejected' }[]>([
    { id: 'ur-1', restaurantName: 'Spice Corner', currentPlan: 'Pro', requestedModule: 'Website Builder', fee: '₹500/mo', date: '2026-06-17', status: 'Pending' },
    { id: 'ur-2', restaurantName: 'Food Plaza', currentPlan: 'Enterprise', requestedModule: 'AI Forecasts Add-on', fee: '₹800/mo', date: '2026-06-16', status: 'Pending' }
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Dependent modules checklist triggers - Enforces permission integrity
  const handleNewModuleChange = (moduleKey: keyof ModulePermissions, checked: boolean) => {
    let next = { ...newModules, [moduleKey]: checked };
    if (moduleKey === 'orders' && checked) {
      next.menu = true;
      next.billing = true;
    }
    if ((moduleKey === 'menu' || moduleKey === 'billing') && !checked) {
      next.orders = false;
    }
    setNewModules(next);
  };

  const handleEditModuleChange = (moduleKey: keyof ModulePermissions, checked: boolean) => {
    if (!selectedTenant) return;
    let nextModules = { ...selectedTenant.modules, [moduleKey]: checked };
    if (moduleKey === 'orders' && checked) {
      nextModules.menu = true;
      nextModules.billing = true;
    }
    if ((moduleKey === 'menu' || moduleKey === 'billing') && !checked) {
      nextModules.orders = false;
    }
    setSelectedTenant({ ...selectedTenant, modules: nextModules });
  };

  const handleApproveUpgrade = (reqId: string, restaurantName: string, moduleName: string) => {
    setUpgradeRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'Approved' } : r));
    const tenant = tenants.find(t => t.name === restaurantName);
    if (tenant) {
      const moduleKey = Object.keys(tenant.modules).find(
        k => k.toLowerCase() === moduleName.toLowerCase().replace(/\s+/g, '')
      ) as keyof ModulePermissions || 'websiteBuilder';
      
      const updatedModules = { ...tenant.modules, [moduleKey]: true };
      setTenants(prev => prev.map(t => t.id === tenant.id ? { ...t, modules: updatedModules } : t));
      
      try {
        const stored = localStorage.getItem('tenant_modules_permissions');
        const savedModules = stored ? JSON.parse(stored) : {};
        savedModules[tenant.id] = updatedModules;
        localStorage.setItem('tenant_modules_permissions', JSON.stringify(savedModules));
      } catch (e) {
        console.error(e);
      }
    }
    setAdminLogs(prev => [
      { id: `l-${Date.now()}`, action: `Approved ${moduleName} upgrade for ${restaurantName}`, category: 'Billing', ip: '192.168.1.45', date: new Date().toLocaleString() },
      ...prev
    ]);
    triggerToast(`Approved ${moduleName} for ${restaurantName}!`);
  };

  const handleRejectUpgrade = (reqId: string, restaurantName: string, moduleName: string) => {
    setUpgradeRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'Rejected' } : r));
    setAdminLogs(prev => [
      { id: `l-${Date.now()}`, action: `Rejected ${moduleName} upgrade request for ${restaurantName}`, category: 'Billing', ip: '192.168.1.45', date: new Date().toLocaleString() },
      ...prev
    ]);
    triggerToast(`Rejected ${moduleName} request from ${restaurantName}`);
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogout = () => {
    logout();
    router.push('/login?portal=super-admin');
  };

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const list = await getRestaurants();

      // Load custom module permissions from local storage
      let savedModules: Record<string, ModulePermissions> = {};
      try {
        const stored = localStorage.getItem('tenant_modules_permissions');
        if (stored) savedModules = JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }

      const mapped: LocalTenant[] = list.map((item: any) => {
        const sub = item.subscriptions?.[0];
        const planName = (sub?.planName || 'Pro') as 'Starter' | 'Pro' | 'Enterprise';
        const expiresAt = sub?.currentPeriodEnd ? sub.currentPeriodEnd.split('T')[0] : '2026-12-31';

        const planModules: ModulePermissions = {
          orders: true,
          billing: true,
          menu: true,
          qrOrdering: planName !== 'Starter',
          reservations: planName !== 'Starter',
          kitchenPanel: planName !== 'Starter',
          waiterPanel: planName !== 'Starter',
          inventory: planName === 'Enterprise',
          purchaseManagement: planName === 'Enterprise',
          websiteBuilder: planName === 'Enterprise',
          loyaltyProgram: planName === 'Enterprise',
          multiBranch: planName === 'Enterprise',
        };

        const modules = savedModules[item.id] || planModules;

        return {
          id: item.id,
          name: item.name,
          owner: item.location || 'Rohan Das',
          email: `${item.name.toLowerCase().replace(/\s+/g, '')}@resto.com`,
          phone: '+91 98765 00112',
          gstNumber: '29AAAAA1111A1Z1',
          plan: planName,
          status: item.isActive ? 'Approved' : 'Suspended',
          mrr: planName === 'Starter' ? '₹999' : planName === 'Pro' ? '₹2,999' : 'Custom',
          expiresAt,
          modules,
        };
      });
      setTenants(mapped);

      // Load users
      const storedUsers = localStorage.getItem('tenant_users_directory');
      if (storedUsers) {
        setTenantUsers(JSON.parse(storedUsers));
      } else {
        const demoUsers: TenantUser[] = mapped.flatMap((tenant) => [
          {
            id: `${tenant.id}-owner`,
            restaurantId: tenant.id,
            restaurantName: tenant.name,
            name: tenant.owner,
            email: tenant.email || 'owner@resto.com',
            role: 'OWNER',
            password: 'password123',
            status: tenant.status === 'Suspended' ? 'Locked' : 'Active',
            lastActive: 'Just now',
          },
          {
            id: `${tenant.id}-manager`,
            restaurantId: tenant.id,
            restaurantName: tenant.name,
            name: 'Store Manager',
            email: `manager.${tenant.name.toLowerCase().replace(/\s+/g, '')}@resto.com`,
            role: 'MANAGER',
            password: 'password123',
            status: 'Active',
            lastActive: '2 hours ago',
            shiftDetails: 'Morning Shift (6 AM - 2 PM)'
          },
          {
            id: `${tenant.id}-cashier`,
            restaurantId: tenant.id,
            restaurantName: tenant.name,
            name: 'Cashier Amit',
            email: `cashier.${tenant.name.toLowerCase().replace(/\s+/g, '')}@resto.com`,
            role: 'CASHIER',
            password: 'password123',
            status: 'Active',
            lastActive: 'Just now',
            shiftDetails: 'Full Shift (11 AM - 11 PM)'
          },
          {
            id: `${tenant.id}-chef`,
            restaurantId: tenant.id,
            restaurantName: tenant.name,
            name: 'Chef Ramesh',
            email: `chef.${tenant.name.toLowerCase().replace(/\s+/g, '')}@resto.com`,
            role: 'CHEF',
            password: 'password123',
            status: 'Active',
            lastActive: 'Active cooking',
            shiftDetails: 'Kitchen Head'
          },
          {
            id: `${tenant.id}-waiter`,
            restaurantId: tenant.id,
            restaurantName: tenant.name,
            name: 'Ravi Verma',
            email: `waiter.${tenant.name.toLowerCase().replace(/\s+/g, '')}@resto.com`,
            role: 'WAITER',
            password: 'password123',
            status: 'Active',
            lastActive: 'Serving Table 4',
            shiftDetails: 'Floor Staff'
          }
        ]);
        setTenantUsers(demoUsers);
        localStorage.setItem('tenant_users_directory', JSON.stringify(demoUsers));
      }

    } catch (error) {
      console.error('Failed to load restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadRestaurants();
  }, []);

  const handlePlanSelectionChange = (plan: 'Starter' | 'Pro' | 'Enterprise') => {
    setNewPlan(plan);
    if (plan === 'Starter') {
      setNewModules({
        orders: true,
        billing: true,
        menu: true,
        qrOrdering: false,
        reservations: false,
        kitchenPanel: false,
        waiterPanel: false,
        inventory: false,
        purchaseManagement: false,
        websiteBuilder: false,
        loyaltyProgram: false,
        multiBranch: false,
      });
    } else if (plan === 'Pro') {
      setNewModules({
        orders: true,
        billing: true,
        menu: true,
        qrOrdering: true,
        reservations: true,
        kitchenPanel: true,
        waiterPanel: true,
        inventory: false,
        purchaseManagement: false,
        websiteBuilder: false,
        loyaltyProgram: false,
        multiBranch: false,
      });
    } else {
      setNewModules({
        orders: true,
        billing: true,
        menu: true,
        qrOrdering: true,
        reservations: true,
        kitchenPanel: true,
        waiterPanel: true,
        inventory: true,
        purchaseManagement: true,
        websiteBuilder: true,
        loyaltyProgram: true,
        multiBranch: true,
      });
    }
  };

  const registerNewTenant = async () => {
    if (!newRestName || !newOwner) {
      triggerToast('Restaurant name and owner details are required.');
      return;
    }

    try {
      const created = await createRestaurant({
        name: newRestName,
        location: newOwner,
        planName: newPlan,
        address: newAddress || 'Main Branch',
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      });

      // Save custom modules
      try {
        const stored = localStorage.getItem('tenant_modules_permissions');
        const savedModules = stored ? JSON.parse(stored) : {};
        savedModules[created.id] = newModules;
        localStorage.setItem('tenant_modules_permissions', JSON.stringify(savedModules));
      } catch (e) {
        console.error(e);
      }

      // Create owner account user
      const finalEmail = newEmail || `${newRestName.toLowerCase().replace(/\s+/g, '')}@resto.com`;
      await registerUser(newOwner, finalEmail, newPassword, created.id);

      // Audit Log
      setAdminLogs(prev => [
        { id: `l-${Date.now()}`, action: `Registered tenant restaurant "${newRestName}" on ${newPlan} plan`, category: 'Tenant', ip: '192.168.1.45', date: new Date().toLocaleString() },
        ...prev
      ]);

      triggerToast(`Successfully registered ${newRestName} on ${newPlan} subscription!`);
      
      setNewRestName('');
      setNewOwner('');
      setNewEmail('');
      setNewPhone('');
      setNewAddress('');
      setNewGstNumber('');
      setNewPassword('654321');
      setNewModules({ ...defaultModules });
      setShowAddModal(false);
      await loadRestaurants();
    } catch (err: any) {
      console.error(err);
      triggerToast(`Failed to register restaurant: ${err.message}`);
    }
  };

  const handleUpdateTenantStatus = async (tenantId: string, status: 'Approved' | 'Suspended') => {
    try {
      await updateRestaurant(tenantId, { isActive: status === 'Approved' });
      
      // Find restaurant name
      const tenant = tenants.find(t => t.id === tenantId);
      const name = tenant ? tenant.name : tenantId;

      // Audit Log
      setAdminLogs(prev => [
        { id: `l-${Date.now()}`, action: `Changed operational status of "${name}" to ${status === 'Approved' ? 'Active' : 'Suspended'}`, category: 'Tenant', ip: '192.168.1.45', date: new Date().toLocaleString() },
        ...prev
      ]);

      triggerToast(`Restaurant status changed to ${status}`);
      await loadRestaurants();
    } catch (err) {
      console.error(err);
      triggerToast('Failed to change status.');
    }
  };

  const saveEditedPlan = async () => {
    if (!selectedTenant) return;
    try {
      await updateRestaurant(selectedTenant.id, {
        planName: selectedTenant.plan,
      });

      // Save custom modules checklist permissions
      try {
        const stored = localStorage.getItem('tenant_modules_permissions');
        const savedModules = stored ? JSON.parse(stored) : {};
        savedModules[selectedTenant.id] = selectedTenant.modules;
        localStorage.setItem('tenant_modules_permissions', JSON.stringify(savedModules));
      } catch (e) {
        console.error(e);
      }

      // Audit Log
      setAdminLogs(prev => [
        { id: `l-${Date.now()}`, action: `Modified modular permissions for tenant "${selectedTenant.name}"`, category: 'Permissions', ip: '192.168.1.45', date: new Date().toLocaleString() },
        ...prev
      ]);

      triggerToast(`Plan configurations updated for ${selectedTenant.name}`);
      setShowUpgradeModal(false);
      setSelectedTenant(null);
      await loadRestaurants();
    } catch (err) {
      console.error(err);
      triggerToast('Failed to update plan configurations.');
    }
  };

  const handleReplyTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !ticketReplyText) return;

    const updatedMessages = [
      ...selectedTicket.messages,
      { sender: 'Support' as const, text: ticketReplyText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ];

    setTickets(prev =>
      prev.map(t => (t.id === selectedTicket.id ? { ...t, messages: updatedMessages, status: 'Resolved' } : t))
    );

    // Audit Log
    setAdminLogs(prev => [
      { id: `l-${Date.now()}`, action: `Dispatched support reply on ticket ${selectedTicket.id} to ${selectedTicket.restaurantName}`, category: 'Support', ip: '192.168.1.45', date: new Date().toLocaleString() },
      ...prev
    ]);

    setSelectedTicket(prev => prev ? { ...prev, messages: updatedMessages, status: 'Resolved' } : null);
    setTicketReplyText('');
    triggerToast('Reply dispatched to restaurant support thread!');
  };

  const triggerManualBackup = () => {
    const filename = `manual_backup_resto_saas_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.sql.gz`;
    const newB = {
      id: 'b_' + Date.now(),
      name: filename,
      size: '188 MB',
      type: 'MANUAL',
      date: new Date().toLocaleString()
    };
    setBackups([newB, ...backups]);

    // Audit Log
    setAdminLogs(prev => [
      { id: `l-${Date.now()}`, action: `Triggered database hot backup snapshot to AWS S3: ${filename}`, category: 'System', ip: '192.168.1.45', date: new Date().toLocaleString() },
      ...prev
    ]);

    triggerToast('Encrypted system database backup completed and synced with S3 buckets.');
  };

  const triggerCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertSubject || !alertBody) return;
    triggerToast(`Broadcast Campaign [${alertSubject}] successfully sent to ${alertTarget} tier owners via Email/SMS!`);
    setAlertSubject('');
    setAlertBody('');
  };

  const filteredTenants = useMemo(() => {
    if (restFilter === 'All') return tenants;
    if (restFilter === 'Active') return tenants.filter(t => t.status === 'Approved');
    if (restFilter === 'Suspended') return tenants.filter(t => t.status === 'Suspended');
    if (restFilter === 'Trial') return tenants.filter(t => t.plan === 'Starter');
    if (restFilter === 'Expired') return tenants.filter(t => t.status === 'Expired');
    return tenants.filter(t => t.status === 'Pending');
  }, [tenants, restFilter]);

  const metrics = useMemo(() => {
    const activeCount = tenants.filter(t => t.status === 'Approved').length;
    const suspendedCount = tenants.filter(t => t.status === 'Suspended').length;
    const trialCount = tenants.filter(t => t.plan === 'Starter').length;
    const expiredCount = tenants.filter(t => t.status === 'Expired').length;
    const totalCount = tenants.length;

    return {
      total: totalCount,
      active: activeCount,
      suspended: suspendedCount,
      trial: trialCount,
      expired: expiredCount,
      revenueMonthly: '₹2.72L',
      revenueYearly: '₹32.6L',
      uptime: '99.99%',
      activeUsers: 142
    };
  }, [tenants]);

  if (!mounted) {
    return <div className="p-8 text-center text-slate-500">Loading Admin Portal...</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-800 dark:bg-[#090b11] dark:text-[#f8fafc] font-sans select-none overflow-hidden h-screen transition-colors duration-200">
      
      {/* Toast notifications */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-slate-800 px-4 py-3 text-white shadow-2xl animate-in fade-in slide-in-from-bottom-5">
          <Sparkles className="h-5 w-5 text-indigo-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* LEFT SIDEBAR PANEL */}
      <aside className="w-64 bg-slate-900 dark:bg-[#0c0e17] text-white/80 p-5 flex flex-col justify-between flex-shrink-0 overflow-y-auto border-r border-slate-200 dark:border-slate-800/40 select-none">
        <div className="space-y-6">
          {/* Brand Logo header */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-650 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-indigo-500/20">
              R
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tight leading-none text-white">RestoBill SaaS</h1>
              <span className="inline-flex px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[8px] font-black tracking-wider uppercase mt-1">
                SUPER ADMIN
              </span>
            </div>
          </div>

          {/* Links navigation list */}
          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
              { id: 'restaurants', label: 'Restaurant Management', icon: Store },
              { id: 'subscriptions', label: 'Subscription & Plans', icon: Crown },
              { id: 'users', label: 'User Management', icon: Users },
              { id: 'branches', label: 'Branch Management', icon: Layers },
              { id: 'revenue', label: 'Revenue & Payments', icon: CreditCard },
              { id: 'analytics', label: 'Restaurant Analytics', icon: BarChart3 },
              { id: 'communication', label: 'Communication Center', icon: Mail },
              { id: 'support', label: 'Support Center', icon: HelpCircle },
              { id: 'website-app', label: 'Website & App Builder', icon: Globe },
              { id: 'system', label: 'System & Security', icon: Settings },
              { id: 'ai-future', label: 'AI Analytics (Future)', icon: Sparkles },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = item.id === currentView;

              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as any)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={14} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Card info footer */}
        <div className="border-t border-white/10 pt-4 flex flex-col gap-3 mt-4">
          <div className="flex items-center justify-between gap-3 px-1">
            <div className="flex items-center gap-2.5 min-w-0 text-left">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black bg-indigo-500 select-none">
                SA
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">Super Admin</p>
                <span className="text-[9px] text-white/40 font-semibold block">Resto Platform</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-indigo-300 hover:text-white transition"
                title="Toggle Light/Dark Mode"
              >
                {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
              </button>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-rose-400 hover:text-rose-300 transition"
                title="Sign Out"
              >
                <LogOut size={13} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* RIGHT CONTENT WORKSPACE */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto p-6 space-y-6">
        
        {/* TAB 1: EXECUTIVE OVERVIEW DASHBOARD */}
        {currentView === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">SaaS Platform Status Monitor</h1>
              <p className="text-xs text-slate-500">Global active tenants, platform health scores, and recurring payments summaries.</p>
            </div>

            {/* Metrics cards grid (12 checklist items mapped) */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <span className="text-[10px] text-slate-500 font-bold uppercase block tracking-wider">Total Restaurants</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">{metrics.total}</span>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <span className="text-[10px] text-slate-500 font-bold uppercase block tracking-wider text-emerald-600">Active Restaurants</span>
                <span className="text-2xl font-black text-emerald-600 mt-1 block">{metrics.active}</span>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <span className="text-[10px] text-slate-500 font-bold uppercase block tracking-wider text-indigo-500">Trial Tiers</span>
                <span className="text-2xl font-black text-indigo-500 mt-1 block">{metrics.trial}</span>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <span className="text-[10px] text-slate-500 font-bold uppercase block tracking-wider text-rose-500">Expired Tiers</span>
                <span className="text-2xl font-black text-rose-500 mt-1 block">{metrics.expired}</span>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <span className="text-[10px] text-slate-500 font-bold uppercase block tracking-wider">Monthly MRR</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">{metrics.revenueMonthly}</span>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <span className="text-[10px] text-slate-500 font-bold uppercase block tracking-wider">Yearly ARR</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">{metrics.revenueYearly}</span>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <span className="text-[10px] text-slate-500 font-bold uppercase block tracking-wider text-indigo-500">Active Users</span>
                <span className="text-2xl font-black text-indigo-500 mt-1 block">{metrics.activeUsers}</span>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <span className="text-[10px] text-slate-500 font-bold uppercase block tracking-wider text-emerald-600">AWS Server Uptime</span>
                <span className="text-2xl font-black text-emerald-600 mt-1 block">{metrics.uptime}</span>
              </div>
            </div>

            {/* Graphs Row */}
            <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
              <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm space-y-3">
                <h3 className="font-bold text-xs text-slate-500 uppercase tracking-wider">Monthly SaaS Subscriptions Growth</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueOverviewData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="month" stroke="#94A3B8" fontSize={10} />
                      <YAxis stroke="#94A3B8" fontSize={10} tickFormatter={(v) => `₹${v/1000}k`} />
                      <Tooltip />
                      <Area type="monotone" dataKey="revenue" stroke="#6366F1" fill="#6366F1" fillOpacity={0.15} strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex flex-col justify-between">
                <h3 className="font-bold text-xs text-slate-500 uppercase tracking-wider mb-2">Subscription Tier Share</h3>
                <div className="relative h-44 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={subPlanShareData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={60}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {subPlanShareData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute text-center">
                    <span className="text-lg font-bold text-slate-800">100%</span>
                  </div>
                </div>
                <div className="space-y-1 text-xs">
                  {subPlanShareData.map(plan => (
                    <div key={plan.name} className="flex justify-between items-center text-slate-650 font-semibold">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: plan.color }}></span>
                        <span>{plan.name}</span>
                      </div>
                      <span className="text-slate-900 font-bold">{plan.value}% share</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recent Platform Activities</h3>
              <div className="space-y-3 text-xs">
                {[
                  { desc: 'New registration request: Royal Treats Cafe', time: '10 mins ago', type: 'Registration' },
                  { desc: 'Manual database backup snapshot saved to AWS S3 bucket', time: '40 mins ago', type: 'System' },
                  { desc: 'Stripe transaction processed successfully: INV-2026-001', time: '1 hr ago', type: 'Billing' },
                  { desc: 'Support Ticket resolved for Spice Corner (TCK-201)', time: '2 hrs ago', type: 'Support' }
                ].map((act, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100 font-semibold">
                    <span className="text-slate-800">{act.desc}</span>
                    <div className="flex items-center gap-3 text-slate-400 font-bold">
                      <span className="text-[10px] bg-slate-200/50 text-slate-600 px-2 py-0.5 rounded uppercase">{act.type}</span>
                      <span>{act.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: RESTAURANT MANAGEMENT */}
        {currentView === 'restaurants' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-3">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">Tenant Restaurant Database</h1>
                <p className="text-xs text-slate-500">Enable/disable modules, adjust custom permissions, reset passwords, and force logout.</p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl px-4 py-2.5 text-xs font-bold transition flex items-center gap-1 shadow-sm w-fit"
              >
                <Plus size={14} /> Register Restaurant
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 pb-2">
              {['All', 'Active', 'Suspended', 'Trial', 'Expired', 'Pending'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setRestFilter(tab as any)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border ${
                    restFilter === tab
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-650 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Table Directory */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] text-slate-400 uppercase font-bold bg-slate-50">
                    <th className="px-6 py-3">Restaurant Details</th>
                    <th className="px-6 py-3">Owner Contact</th>
                    <th className="px-6 py-3">Subscription Tier</th>
                    <th className="px-6 py-3">Expiry Date</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Access Controls & Feature Permissions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {filteredTenants.map(tenant => (
                    <tr key={tenant.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-900 text-sm block">{tenant.name}</span>
                        <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">GST: {tenant.gstNumber || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-800">{tenant.owner}</span>
                        <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">{tenant.email}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-indigo-50 text-indigo-700 font-bold px-2.5 py-0.5 rounded-lg">
                          {tenant.plan} ({tenant.mrr})
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-500">{tenant.expiresAt}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          tenant.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {tenant.status === 'Approved' ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2.5">
                        <button
                          onClick={() => {
                            setSelectedTenant(tenant);
                            setShowUpgradeModal(true);
                          }}
                          className="text-xs text-indigo-600 hover:text-indigo-800 font-black underline"
                        >
                          Modify Permissions
                        </button>
                        <button
                          onClick={() => triggerToast(`Simulating Force Logout on owner/managers of ${tenant.name}`)}
                          className="text-xs text-amber-600 hover:text-amber-800 font-bold"
                        >
                          Force Logout
                        </button>
                        {tenant.status === 'Approved' ? (
                          <button
                            onClick={() => handleUpdateTenantStatus(tenant.id, 'Suspended')}
                            className="text-xs text-rose-600 hover:text-rose-800 font-bold"
                          >
                            Suspend
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateTenantStatus(tenant.id, 'Approved')}
                            className="text-xs text-emerald-600 hover:text-emerald-800 font-bold"
                          >
                            Reactivate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: SUBSCRIPTIONS & ADD-ON MARKETPLACE */}
        {currentView === 'subscriptions' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">Subscription Plans & Marketplace Modules</h1>
              <p className="text-xs text-slate-500">Configure standard platform tier specifications or manage optional premium add-on modules.</p>
            </div>

            {/* Standard Packages */}
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { name: 'Starter Plan', cost: '₹999/mo', branches: 1, staff: 5, tables: 10, features: ['Orders & Billing', 'Menu Management', 'Standard Reports'] },
                { name: 'Professional Pro', cost: '₹2,999/mo', branches: 3, staff: 15, tables: 30, features: ['Everything in Starter', 'QR Ordering Support', 'Table Bookings', 'KDS / Waiter Apps integration'] },
                { name: 'Enterprise Scale', cost: 'Custom Quote', branches: 'Unlimited', staff: 'Unlimited', tables: 'Unlimited', features: ['Everything in Pro', 'Inventory requisitions', 'Expiring stock alerts', 'Branded apps publication', 'AI analytics dashboard'] }
              ].map(plan => (
                <div key={plan.name} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
                  <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900">{plan.name}</h3>
                      <span className="text-[10px] text-slate-400 font-bold block mt-1">Tier specs</span>
                    </div>
                    <span className="text-lg font-black text-indigo-600">{plan.cost}</span>
                  </div>
                  <div className="space-y-2 text-xs font-semibold text-slate-700">
                    <p>Branches: <span className="text-slate-900 font-bold">{plan.branches}</span></p>
                    <p>Staff limit: <span className="text-slate-900 font-bold">{plan.staff}</span></p>
                    <p>Tables limit: <span className="text-slate-900 font-bold">{plan.tables}</span></p>
                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-[9px] text-[#F97316] font-black uppercase tracking-wider">Features included</span>
                      <ul className="list-disc list-inside mt-1.5 space-y-1 text-slate-500 text-[11px]">
                        {plan.features.map((f, i) => <li key={i}>{f}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pending Subscription & Module Upgrade Requests (New Feature) */}
            <div className="bg-white dark:bg-[#11131c] border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
              <h3 className="font-bold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
                <Crown size={14} className="text-indigo-500" />
                Pending Module Upgrade Requests (Tenant Self-Service)
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-150 dark:border-slate-800 text-[10px] text-slate-400 uppercase font-bold bg-slate-50 dark:bg-slate-900/50">
                      <th className="px-4 py-2.5">Restaurant</th>
                      <th className="px-4 py-2.5">Current Tier</th>
                      <th className="px-4 py-2.5">Requested Add-On Module</th>
                      <th className="px-4 py-2.5">Surcharge Rate</th>
                      <th className="px-4 py-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                    {upgradeRequests.filter(r => r.status === 'Pending').length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-6 text-center text-slate-400 italic">
                          No pending upgrade requests.
                        </td>
                      </tr>
                    ) : (
                      upgradeRequests.filter(r => r.status === 'Pending').map(req => (
                        <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{req.restaurantName}</td>
                          <td className="px-4 py-3">{req.currentPlan}</td>
                          <td className="px-4 py-3 text-indigo-600 dark:text-indigo-400">{req.requestedModule}</td>
                          <td className="px-4 py-3 font-mono">{req.fee}</td>
                          <td className="px-4 py-3 text-right space-x-2.5">
                            <button
                              onClick={() => handleApproveUpgrade(req.id, req.restaurantName, req.requestedModule)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-2.5 py-1 text-[10px] font-black transition"
                            >
                              Approve Add-On
                            </button>
                            <button
                              onClick={() => handleRejectUpgrade(req.id, req.restaurantName, req.requestedModule)}
                              className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg px-2.5 py-1 text-[10px] font-black hover:bg-slate-200 transition"
                            >
                              Deny
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Optional Premium Add-ons Marketplace */}
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-2 flex items-center gap-2">
                <Cpu className="h-5 w-5 text-[#F97316]" />
                Add-On Marketplace (Extra Module Surcharges)
              </h3>
              
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { name: 'SaaS Website Builder', cost: '₹500/mo', desc: 'Custom domain and SEO builder.' },
                  { name: 'Branded Android App', cost: '₹1,500/mo', desc: 'Branded storefront apk publication.' },
                  { name: 'WhatsApp Bill Send', cost: '₹300/mo', desc: 'Dispatches bills directly to guest numbers.' },
                  { name: 'AI Demand Forecast', cost: '₹800/mo', desc: 'Predict ingredient stock logs.' }
                ].map(addon => (
                  <div key={addon.name} className="bg-slate-50 border border-slate-150 p-4 rounded-xl flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{addon.name}</h4>
                      <p className="text-[10px] text-slate-500 mt-1">{addon.desc}</p>
                    </div>
                    <div className="mt-3 flex justify-between items-center pt-2 border-t border-slate-200/60 text-xs">
                      <span className="font-extrabold text-indigo-700">{addon.cost}</span>
                      <span className="text-[9px] bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.5 rounded">Active</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: USER MANAGEMENT */}
        {currentView === 'users' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">Platform User Directory</h1>
              <p className="text-xs text-slate-500">Monitor active accounts, credentials, and last login details across all restaurant branches.</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-150 text-[10px] text-slate-400 uppercase font-bold bg-slate-50">
                    <th className="px-6 py-3">Full Name</th>
                    <th className="px-6 py-3">Source Restaurant</th>
                    <th className="px-6 py-3">System Login ID</th>
                    <th className="px-6 py-3">Password Credentials</th>
                    <th className="px-6 py-3">Role Type</th>
                    <th className="px-6 py-3">Activity Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {tenantUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-950 text-sm block">{user.name}</span>
                        {user.shiftDetails && <span className="text-[10px] text-slate-450 block font-normal">{user.shiftDetails}</span>}
                      </td>
                      <td className="px-6 py-4 text-slate-650">{user.restaurantName}</td>
                      <td className="px-6 py-4 font-mono text-slate-500">{user.email}</td>
                      <td className="px-6 py-4 font-mono font-bold text-slate-800">{user.password}</td>
                      <td className="px-6 py-4 font-bold uppercase text-slate-550 text-[10px]">{user.role}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold ${
                          user.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: BRANCH MANAGEMENT */}
        {currentView === 'branches' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-3">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">Multi-Branch Management</h1>
                <p className="text-xs text-slate-500">Audit sub-branches, table configurations, and live staff levels per restaurant tenant.</p>
              </div>
              <button
                onClick={() => {
                  const name = prompt('Enter Restaurant Name:');
                  const branch = prompt('Enter Branch Location Name:');
                  if (name && branch) {
                    const newB: BranchItem = {
                      id: `b-${Date.now()}`,
                      restaurantName: name,
                      branchName: branch,
                      location: 'India',
                      status: 'Active',
                      tablesCount: 8,
                      staffCount: 5,
                      ordersToday: 0
                    };
                    setBranches([...branches, newB]);
                    triggerToast(`Branch [${branch}] added under ${name}!`);
                  }
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2.5 text-xs font-bold transition flex items-center gap-1 shadow-sm w-fit"
              >
                <Plus size={14} /> Add Branch
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {branches.map(b => (
                <div key={b.id} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm hover:border-slate-350 transition flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
                      <div>
                        <h4 className="font-extrabold text-slate-950 text-sm">{b.branchName}</h4>
                        <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{b.restaurantName}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                        b.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {b.status}
                      </span>
                    </div>

                    <div className="space-y-1.5 mt-4 text-xs text-slate-650 font-semibold">
                      <p>Location: <span className="text-slate-900 font-bold">{b.location}</span></p>
                      <p>Tables: <span className="text-slate-900 font-bold">{b.tablesCount} Tables</span></p>
                      <p>Staff On Duty: <span className="text-slate-900 font-bold">{b.staffCount} Members</span></p>
                      <p>Orders Placed Today: <span className="text-[#F97316] font-bold">{b.ordersToday}</span></p>
                    </div>
                  </div>

                  <button
                    onClick={() => setBranches(current => current.map(item => item.id === b.id ? { ...item, status: item.status === 'Active' ? 'Inactive' : 'Active' } : item))}
                    className="w-full mt-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-[10px] py-2 rounded-xl transition"
                  >
                    Toggle Operational Status
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: REVENUE & PAYMENTS */}
        {currentView === 'revenue' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">Revenue Management Ledger</h1>
              <p className="text-xs text-slate-500">Stripe/Razorpay subscription payments, manual transfers, and refund checks.</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Payment Logs */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 lg:col-span-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gateway Transaction Audits</h3>
                <div className="space-y-2.5">
                  {payments.map(p => (
                    <div key={p.id} className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex items-center justify-between text-xs font-semibold">
                      <div>
                        <span className="font-black text-slate-900 block">{p.invoice} • {p.restaurantName}</span>
                        <span className="text-[10px] text-slate-450 font-bold">Method: {p.gateway} • {p.date}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-indigo-700 font-black">₹{p.amount}</span>
                        <span className={`block text-[10px] font-bold mt-0.5 ${
                          p.status === 'Paid' ? 'text-emerald-600' : p.status === 'Refunded' ? 'text-amber-500' : 'text-red-500'
                        }`}>{p.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gateway settings */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2">Active Gateways</h3>
                  <div className="space-y-3 mt-4 text-xs font-semibold">
                    <div className="flex justify-between">
                      <span>Stripe Checkout</span>
                      <span className="text-emerald-600 font-bold">● Connected</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Razorpay SmartHook</span>
                      <span className="text-emerald-600 font-bold">● Connected</span>
                    </div>
                    <div className="flex justify-between">
                      <span>UPI QR Platform</span>
                      <span className="text-emerald-600 font-bold">● Connected</span>
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-50/50 p-4 border border-indigo-100 rounded-xl text-xs font-bold">
                  <p className="text-slate-550 uppercase text-[9px] tracking-wider block mb-1">Add-on Surcharges</p>
                  <span className="text-slate-800 leading-normal block">
                    Restaurant owners can purchase add-on modules from their portal. Surcharges are auto-appended to the monthly billing cycle.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: RESTAURANT ANALYTICS */}
        {currentView === 'analytics' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">Tenant Usage & Performance Analytics</h1>
              <p className="text-xs text-slate-500">Monitor highest performing outlets, customer visit frequency, and active storage counts.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Leaderboard highest revenue */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Top Restaurants (Monthly Revenue)</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Spice Corner (MG Road)', rev: '₹48,250', orders: 248 },
                    { name: 'Food Plaza', rev: '₹39,110', orders: 195 },
                    { name: 'Tasty Bites', rev: '₹12,400', orders: 74 }
                  ].map((r, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center text-xs font-bold">
                      <div>
                        <span className="text-slate-900 block">{r.name}</span>
                        <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">{r.orders} orders</span>
                      </div>
                      <span className="text-[#F97316] font-black">{r.rev}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Usage stats */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Usage & Logs Uptime</h3>
                <div className="space-y-3 text-xs font-semibold text-slate-700">
                  <div className="flex justify-between p-3.5 bg-slate-50 rounded-xl">
                    <span>Average Login Frequency:</span>
                    <span className="text-slate-950 font-black">12.5 times/day</span>
                  </div>
                  <div className="flex justify-between p-3.5 bg-slate-50 rounded-xl">
                    <span>S3 Storage Space Used:</span>
                    <span className="text-slate-950 font-black">42.8 GB / 100 GB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: COMMUNICATION CENTER */}
        {currentView === 'communication' && (
          <div className="space-y-6 animate-in fade-in duration-200 max-w-2xl">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">Broadcast Communication Campaigns</h1>
              <p className="text-xs text-slate-500">Dispatch global maintenance notifications or SMS/Email campaigns to restaurant owners.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <form onSubmit={triggerCampaign} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-650 block mb-1">Target Tenant Tier</label>
                  <select
                    value={alertTarget}
                    onChange={(e) => setAlertTarget(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl outline-none font-bold"
                  >
                    <option value="All">All Restaurant Owners</option>
                    <option value="Pro">Pro Plan Owners Only</option>
                    <option value="Enterprise">Enterprise Corporate Owners Only</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-650 block mb-1">Broadcast Subject</label>
                  <input
                    value={alertSubject}
                    onChange={(e) => setAlertSubject(e.target.value)}
                    placeholder="e.g. Server Maintenance Notice - June 15"
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-650 block mb-1">Message Content (Applies to WhatsApp/SMS/Email)</label>
                  <textarea
                    value={alertBody}
                    onChange={(e) => setAlertBody(e.target.value)}
                    rows={4}
                    placeholder="Type details of notification..."
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl outline-none font-semibold font-sans"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-5 py-2.5 font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <Send size={13} /> Dispatch Campaign Broadcast
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 9: SUPPORT TICKETS */}
        {currentView === 'support' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">Support Desk Ticketing Center</h1>
              <p className="text-xs text-slate-500">Address restaurant owner bug reports, billing disputes, and feature requests.</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden self-start">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-150 text-[10px] text-slate-400 uppercase font-bold bg-slate-50">
                      <th className="px-4 py-2.5">Restaurant</th>
                      <th className="px-4 py-2.5">Topic / Issue</th>
                      <th className="px-4 py-2.5">Category</th>
                      <th className="px-4 py-2.5">Priority</th>
                      <th className="px-4 py-2.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {tickets.map((ticket) => (
                      <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3 font-bold text-slate-900">{ticket.restaurantName}</td>
                        <td className="px-4 py-3">{ticket.subject}</td>
                        <td className="px-4 py-3 text-slate-500">{ticket.category}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded font-bold ${
                            ticket.priority === 'High' ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setSelectedTicket(ticket)}
                            className="text-xs text-indigo-600 hover:text-indigo-800 font-bold underline"
                          >
                            Reply
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {selectedTicket ? (
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                  <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-xs text-slate-400 uppercase">Thread: {selectedTicket.id}</h3>
                      <p className="font-bold text-slate-800 text-sm mt-1">{selectedTicket.subject}</p>
                    </div>
                    <button onClick={() => setSelectedTicket(null)}>
                      <X size={15} />
                    </button>
                  </div>

                  <div className="space-y-3 h-48 overflow-y-auto pr-1">
                    {selectedTicket.messages.map((m, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl text-xs leading-relaxed max-w-[85%] ${
                          m.sender === 'Tenant' ? 'bg-slate-50 border border-slate-150 mr-auto text-slate-700' : 'bg-indigo-50 border border-indigo-150 ml-auto text-indigo-900'
                        }`}
                      >
                        <p>{m.text}</p>
                        <span className="block text-[8px] text-slate-400 text-right mt-1">{m.time}</span>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleReplyTicket} className="flex gap-2 text-xs">
                    <input
                      value={ticketReplyText}
                      onChange={(e) => setTicketReplyText(e.target.value)}
                      placeholder="Write response..."
                      className="flex-1 bg-slate-55 border border-slate-200 px-3.5 py-2 rounded-xl outline-none font-bold"
                    />
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2 font-bold transition"
                    >
                      Send
                    </button>
                  </form>
                </div>
              ) : (
                <div className="bg-slate-100/50 border border-dashed border-slate-200 p-8 rounded-xl text-center text-slate-450 text-xs font-semibold self-start">
                  Pick a support ticket to reply or audit chat logs.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 10: WEBSITE & APP MANAGEMENT */}
        {currentView === 'website-app' && (
          <div className="space-y-6 animate-in fade-in duration-200 max-w-3xl">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">Website & Branded Mobile App Setup</h1>
              <p className="text-xs text-slate-500">Configure theme templates, custom domain map checks, and push notification controls.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                <h3 className="font-bold text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2">Website builder configurations</h3>
                <div className="space-y-2.5 text-xs font-semibold text-slate-750">
                  <div className="flex justify-between">
                    <span>Default Domain Host:</span>
                    <span className="text-slate-900 font-bold">akresto.shop</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SSL Certificate Service:</span>
                    <span className="text-emerald-600 font-bold">Auto-Renewing Let's Encrypt</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-100 pt-2.5">
                    <span>Templates Enabled:</span>
                    <span className="text-slate-900 font-bold">5 Designs (Classic, Modern, Dark Mode, Minimalist)</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                <h3 className="font-bold text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2">Mobile App releases (White-labeled)</h3>
                <div className="space-y-2.5 text-xs font-semibold text-slate-750">
                  <div className="flex justify-between">
                    <span>Android App version:</span>
                    <span className="text-slate-900 font-bold">v3.4.1 apk</span>
                  </div>
                  <div className="flex justify-between">
                    <span>iOS App version:</span>
                    <span className="text-slate-900 font-bold">v3.4.1 (Testflight)</span>
                  </div>
                  <button
                    onClick={() => triggerToast('Push notification triggered to all white-label devices!')}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-[10px] py-2 rounded-xl border border-slate-600 transition"
                  >
                    Send Global Push Notification
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 11: SYSTEM & SECURITY (BACKUPS) */}
        {currentView === 'system' && (
          <div className="space-y-6 max-w-3xl animate-in fade-in duration-200">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-3">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">System Management & S3 Backups</h1>
                <p className="text-xs text-slate-500">Auto S3 dumps log, manual snapshot recovery, and currencies setups.</p>
              </div>
              <button
                onClick={triggerManualBackup}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2.5 text-xs font-bold transition flex items-center gap-1 shadow-sm w-fit"
              >
                <Database size={14} /> Backup Database Now
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Backups log */}
              <div className="bg-white dark:bg-[#11131c] border border-slate-200 dark:border-slate-850 rounded-xl p-5 space-y-4 shadow-sm">
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Archived SQL snapshots</h3>
                <div className="space-y-2.5">
                  {backups.map(b => (
                    <div key={b.id} className="p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-150 dark:border-slate-800 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <span className="font-black text-slate-900 dark:text-white block">{b.name} ({b.size})</span>
                        <span className="text-[10px] text-slate-450 dark:text-slate-500 font-bold">{b.date} • {b.type}</span>
                      </div>
                      <button
                        onClick={() => triggerToast(`Restored successfully from snapshot: ${b.name}`)}
                        className="text-xs text-indigo-650 hover:text-indigo-850 dark:text-indigo-400 dark:hover:text-indigo-300 font-black underline"
                      >
                        Restore
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Currency settings */}
              <div className="bg-white dark:bg-[#11131c] border border-slate-200 dark:border-slate-850 rounded-xl p-5 space-y-4 shadow-sm">
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">General settings</h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">Global Platform currency</label>
                    <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl outline-none font-bold">
                      <option value="INR">Indian Rupee (₹)</option>
                      <option value="USD">US Dollar ($)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">Tax configuration (Default GST %)</label>
                    <input type="number" defaultValue={18} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl outline-none font-bold" />
                  </div>
                  <button
                    onClick={() => triggerToast('System general settings updated.')}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl transition"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>

            {/* Platform Audit Trail Logs Ledger (New Feature) */}
            <div className="bg-white dark:bg-[#11131c] border border-slate-200 dark:border-slate-850 rounded-xl p-5 space-y-4 shadow-sm">
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
                <Terminal size={14} className="text-rose-500" />
                Live System Audit Trail Logs (Realtime Security Activity)
              </h3>
              
              <div className="overflow-x-auto max-h-60 overflow-y-auto scrollbar-thin">
                <table className="w-full text-left border-collapse text-[11px] font-mono">
                  <thead>
                    <tr className="border-b border-slate-150 dark:border-slate-800 text-[10px] text-slate-400 uppercase font-bold bg-slate-50 dark:bg-slate-900/50">
                      <th className="px-4 py-2">Timestamp</th>
                      <th className="px-4 py-2">Audit Action Message</th>
                      <th className="px-4 py-2">Category</th>
                      <th className="px-4 py-2">Origin IP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-655 dark:text-slate-400">
                    {adminLogs.map(log => (
                      <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-2.5 text-slate-400">{log.date}</td>
                        <td className="px-4 py-2.5 font-bold text-slate-800 dark:text-slate-300">{log.action}</td>
                        <td className="px-4 py-2.5">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                            log.category === 'Tenant' ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600' :
                            log.category === 'Permissions' ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-650'
                          }`}>
                            {log.category}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-slate-500">{log.ip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 12: AI FEATURES (FUTURE) */}
        {currentView === 'ai-future' && (
          <div className="space-y-6 max-w-3xl animate-in fade-in duration-200">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">AI Sales & Demand Prediction Dashboard</h1>
              <p className="text-xs text-slate-500">Evaluate future restaurant orders forecasting models, stocking recommendations, and AI Menu Optimizations.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
                <h3 className="font-bold text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2">AI Sales Forecast</h3>
                <p className="text-xs text-slate-650 leading-relaxed font-semibold">
                  Machine learning model projects +14.8% growth in dine-in revenue for next month based on summer seasonal sales trends.
                </p>
                <div className="p-3 bg-indigo-50/50 rounded-xl text-xs font-bold text-indigo-700 border border-indigo-100">
                  💡 Menu suggestion: Recommend adding more cold beverages or mocktails to take advantage of seasonal demand.
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
                <h3 className="font-bold text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2">AI Inventory Optimization</h3>
                <p className="text-xs text-slate-650 leading-relaxed font-semibold">
                  Historical weekend usage patterns suggest that average tomato and potato waste levels can be reduced by 8% if purchasing thresholds are lowered dynamically.
                </p>
                <div className="p-3 bg-[#F97316]/10 rounded-xl text-xs font-bold text-[#F97316] border border-orange-100">
                  💡 Reorder suggestion: Decrease Friday tomato orders from Delhi Grain Traders by 5kg.
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ADD RESTAURANT ACCOUNT DIALOG MODAL (Granular Permissions Checklist) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 border border-slate-250 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto scrollbar-thin">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <h2 className="text-base font-black text-slate-900 uppercase tracking-wider">Register New Restaurant Account</h2>
              <button onClick={() => setShowAddModal(false)}>
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase block">Restaurant Name *</label>
                  <input
                    value={newRestName}
                    onChange={(e) => setNewRestName(e.target.value)}
                    placeholder="e.g. Spice Corner"
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl outline-none font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase block">Owner Name *</label>
                  <input
                    value={newOwner}
                    onChange={(e) => setNewOwner(e.target.value)}
                    placeholder="e.g. Ravi Verma"
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl outline-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase block">Owner Email *</label>
                  <input
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="owner@resto.com"
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl outline-none font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase block">Owner Phone</label>
                  <input
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl outline-none font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase block">Address Details</label>
                <input
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="Main Branch location..."
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl outline-none font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase block">GST Registration Number</label>
                  <input
                    value={newGstNumber}
                    onChange={(e) => setNewGstNumber(e.target.value)}
                    placeholder="29AAAAA1111A1Z1"
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl outline-none font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase block">Password Credentials</label>
                  <input
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="654321"
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl outline-none font-bold text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase block">Select Subscription Plan</label>
                <select
                  value={newPlan}
                  onChange={(e) => handlePlanSelectionChange(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl outline-none bg-white font-bold"
                >
                  <option value="Starter">Starter Plan (₹999/mo)</option>
                  <option value="Pro">Pro Plan (₹2,999/mo)</option>
                  <option value="Enterprise">Enterprise Plan (Custom Quote)</option>
                </select>
              </div>

              {/* Modules Permissions Checklist - Very Important */}
              <div className="border border-slate-150 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 p-4 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-black text-xs text-slate-700 dark:text-slate-300 block uppercase tracking-wider font-semibold">Configure Enabled Modules Checklist</span>
                  <span className="text-[9px] text-[#F97316] font-bold">Auto-dependency linked</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
                  {Object.keys(newModules).map(key => {
                    const moduleKey = key as keyof ModulePermissions;
                    const cleanName = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                    return (
                      <label key={key} className="flex items-center gap-2 cursor-pointer py-1.5 hover:text-slate-900 dark:hover:text-white transition">
                        <input
                          type="checkbox"
                          checked={newModules[moduleKey]}
                          onChange={(e) => handleNewModuleChange(moduleKey, e.target.checked)}
                          className="rounded border-slate-300 dark:border-slate-750 text-indigo-600 h-4 w-4"
                        />
                        <span>{cleanName}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-3 border-t border-slate-100 text-xs font-black">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 py-3 rounded-xl text-slate-650 transition"
              >
                Cancel
              </button>
              <button
                onClick={registerNewTenant}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl transition active:scale-95 shadow-lg shadow-indigo-500/20"
              >
                Create Restaurant
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT/MODIFY RESTAURANT ACCOUNT MODAL */}
      {showUpgradeModal && selectedTenant && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 border border-slate-250 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto scrollbar-thin">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-black text-slate-900 uppercase tracking-wider">Configure Restaurant Access Control</h2>
                <span className="text-[10px] text-slate-450 font-bold block mt-1">{selectedTenant.name} ({selectedTenant.owner})</span>
              </div>
              <button onClick={() => {
                setShowUpgradeModal(false);
                setSelectedTenant(null);
              }}>
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase block">Change Subscription Plan</label>
                <select
                  value={selectedTenant.plan}
                  onChange={(e) => {
                    const nextPlan = e.target.value as any;
                    const planModules: ModulePermissions = {
                      orders: true,
                      billing: true,
                      menu: true,
                      qrOrdering: nextPlan !== 'Starter',
                      reservations: nextPlan !== 'Starter',
                      kitchenPanel: nextPlan !== 'Starter',
                      waiterPanel: nextPlan !== 'Starter',
                      inventory: nextPlan === 'Enterprise',
                      purchaseManagement: nextPlan === 'Enterprise',
                      websiteBuilder: nextPlan === 'Enterprise',
                      loyaltyProgram: nextPlan === 'Enterprise',
                      multiBranch: nextPlan === 'Enterprise',
                    };
                    setSelectedTenant({ ...selectedTenant, plan: nextPlan, modules: planModules });
                  }}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl outline-none bg-white font-bold"
                >
                  <option value="Starter">Starter Plan</option>
                  <option value="Pro">Pro Plan</option>
                  <option value="Enterprise">Enterprise Plan</option>
                </select>
              </div>

              {/* Modules Permissions Checklist */}
              <div className="border border-slate-150 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 p-4 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-black text-xs text-slate-700 dark:text-slate-300 block uppercase tracking-wider font-semibold">Active Modules Checklist</span>
                  <span className="text-[9px] text-[#F97316] font-bold">Auto-dependency linked</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-655 dark:text-slate-400">
                  {Object.keys(selectedTenant.modules).map(key => {
                    const moduleKey = key as keyof ModulePermissions;
                    const cleanName = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                    return (
                      <label key={key} className="flex items-center gap-2 cursor-pointer py-1.5 hover:text-slate-900 dark:hover:text-white transition">
                        <input
                          type="checkbox"
                          checked={selectedTenant.modules[moduleKey]}
                          onChange={(e) => handleEditModuleChange(moduleKey, e.target.checked)}
                          className="rounded border-slate-350 dark:border-slate-700 text-indigo-600 h-4 w-4"
                        />
                        <span>{cleanName}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-3 border-t border-slate-100 text-xs font-black">
              <button
                onClick={() => {
                  setShowUpgradeModal(false);
                  setSelectedTenant(null);
                }}
                className="flex-1 bg-slate-100 hover:bg-slate-200 py-3 rounded-xl text-slate-655 transition"
              >
                Cancel
              </button>
              <button
                onClick={saveEditedPlan}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl transition active:scale-95 shadow-lg shadow-indigo-500/20"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
