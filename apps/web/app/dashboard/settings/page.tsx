'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/auth-context';
import { useNotifications } from '@/context/notification-context';
import {
  getBusinessSettings,
  updateBusinessSettings,
  getBranches,
  createBranch,
  updateBranch,
  deleteBranch,
  getBranchAnalytics,
  Branch,
  BranchAnalytics
} from '@/services/business.service';
import { uploadImageToCloudinary } from '@/services/upload.service';
import {
  Building,
  Upload,
  Image as ImageIcon,
  MapPin,
  Clock,
  Calendar,
  FileText,
  Check,
  Loader2,
  Plus,
  Trash2,
  X,
  Palette,
  FileCheck,
  Smartphone,
  Lock,
  Layers,
  Trash,
  Edit2,
  CheckCircle2,
  Building2,
  BarChart2,
  Phone,
  Mail,
  CheckCircle
} from 'lucide-react';

const Facebook = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Instagram = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const Twitter = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const Youtube = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

// Types for settings state
interface OperatingHour {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

interface Holiday {
  date: string;
  name: string;
}

interface SocialMedia {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
}

interface QRBranding {
  logo?: string;
  eyeColor: string;
  dotColor: string;
  template: 'classic' | 'minimal' | 'luxury' | 'creative';
}

const defaultHours: OperatingHour[] = [
  { day: 'Monday', open: '09:00', close: '22:00', closed: false },
  { day: 'Tuesday', open: '09:00', close: '22:00', closed: false },
  { day: 'Wednesday', open: '09:00', close: '22:00', closed: false },
  { day: 'Thursday', open: '09:00', close: '22:00', closed: false },
  { day: 'Friday', open: '09:00', close: '23:00', closed: false },
  { day: 'Saturday', open: '09:00', close: '23:00', closed: false },
  { day: 'Sunday', open: '09:00', close: '22:00', closed: false },
];

export default function SettingsPage() {
  const { user } = useAuth();
  const { notify } = useNotifications();

  // Settings states
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [activeTab, setActiveTab] = useState<'identity' | 'branding' | 'contact' | 'hours' | 'compliance' | 'invoice' | 'qr' | 'branches'>('identity');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error' | 'pending'>('saved');

  // Branch states
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [branchAnalytics, setBranchAnalytics] = useState<BranchAnalytics | null>(null);
  const [viewingAnalyticsBranchId, setViewingAnalyticsBranchId] = useState<string | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  // Branch form states
  const [branchName, setBranchName] = useState('');
  const [branchCode, setBranchCode] = useState('');
  const [branchLocation, setBranchLocation] = useState('');
  const [branchAddress, setBranchAddress] = useState('');
  const [branchPhone, setBranchPhone] = useState('');
  const [branchEmail, setBranchEmail] = useState('');
  const [branchManagerName, setBranchManagerName] = useState('');
  const [branchManagerEmail, setBranchManagerEmail] = useState('');
  const [branchManagerPhone, setBranchManagerPhone] = useState('');
  const [branchStatus, setBranchStatus] = useState('ACTIVE');
  const [branchIsMain, setBranchIsMain] = useState(false);
  const [branchIsDefault, setBranchIsDefault] = useState(false);
  const [branchHours, setBranchHours] = useState<any>({
    monday: { open: '09:00', close: '22:00', closed: false },
    tuesday: { open: '09:00', close: '22:00', closed: false },
    wednesday: { open: '09:00', close: '22:00', closed: false },
    thursday: { open: '09:00', close: '22:00', closed: false },
    friday: { open: '09:00', close: '23:00', closed: false },
    saturday: { open: '09:00', close: '23:00', closed: false },
    sunday: { open: '09:00', close: '22:00', closed: false }
  });

  // Form states mapped directly to base Tenant columns + settings JSON fields
  const [name, setName] = useState('');
  const [legalBusinessName, setLegalBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [cuisine, setCuisine] = useState<string[]>([]);
  const [newCuisineTag, setNewCuisineTag] = useState('');
  const [diningTypes, setDiningTypes] = useState<string[]>(['Dine-in']);

  // Branding states
  const [logo, setLogo] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [gallery, setGallery] = useState<string[]>([]);
  const [themePreset, setThemePreset] = useState('glass-violet');
  const [primaryColor, setPrimaryColor] = useState('#6366F1');
  const [secondaryColor, setSecondaryColor] = useState('#EC4899');

  // Contact / Location states
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState('');
  const [googleMaps, setGoogleMaps] = useState('');
  const [socialMedia, setSocialMedia] = useState<SocialMedia>({});

  // Hours & Holidays
  const [operatingHours, setOperatingHours] = useState<OperatingHour[]>(defaultHours);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [newHolidayDate, setNewHolidayDate] = useState('');
  const [newHolidayName, setNewHolidayName] = useState('');

  // Compliance states
  const [gst, setGst] = useState('');
  const [fssai, setFssai] = useState('');
  const [pan, setPan] = useState('');
  const [businessRegistration, setBusinessRegistration] = useState('');

  // Invoicing states
  const [invoiceHeader, setInvoiceHeader] = useState('');
  const [invoiceTerms, setInvoiceTerms] = useState('');
  const [receiptFooter, setReceiptFooter] = useState('');

  // QR Branding states
  const [qrBranding, setQrBranding] = useState<QRBranding>({
    eyeColor: '#1E1B4B',
    dotColor: '#4F46E5',
    template: 'classic',
  });

  // Base raw settings from server (to preserve other configurations like localization, ai_profile, etc.)
  const [rawSettings, setRawSettings] = useState<any>({});

  // Input validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // File Upload states
  const [uploadingField, setUploadingField] = useState<'logo' | 'cover' | 'gallery' | null>(null);

  // Check if current user is owner or super admin
  useEffect(() => {
    if (user) {
      setIsOwner(user.role === 'OWNER' || user.role === 'SUPER_ADMIN' || (user.role as string) === 'RESTAURANT_OWNER');
    }
  }, [user]);

  // Load settings on init
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const data = await getBusinessSettings();
        if (data) {
          setName(data.name || '');
          setPhone(data.phone || '');
          setEmail(data.email || '');
          setAddress(data.address || '');
          setLogo(data.logo || '');
          setLocation(data.location || '');

          const settingsObj = data.settings || {};
          setRawSettings(settingsObj);

          // Map profile fields
          const profile = settingsObj.profile || {};
          setLegalBusinessName(profile.legalBusinessName || '');
          setDescription(profile.description || '');
          setCuisine(profile.cuisine || []);
          setDiningTypes(profile.diningTypes || ['Dine-in']);
          setWebsite(profile.website || '');
          setGoogleMaps(profile.googleMaps || '');
          setSocialMedia(profile.socialMedia || {});
          setGst(profile.gst || '');
          setFssai(profile.fssai || '');
          setPan(profile.pan || '');
          setBusinessRegistration(profile.businessRegistration || '');

          // Map theme fields
          const theme = settingsObj.theme || {};
          setThemePreset(theme.preset || 'glass-violet');
          setPrimaryColor(theme.primaryColor || '#6366F1');
          setSecondaryColor(theme.secondaryColor || '#EC4899');
          setCoverImage(theme.coverImage || '');
          setGallery(theme.gallery || []);

          // Map operational fields
          const operational = settingsObj.operational || {};
          if (operational.operatingHours) {
            setOperatingHours(operational.operatingHours);
          }
          setHolidays(operational.holidays || []);

          // Map invoice settings
          const invoice = settingsObj.invoice || {};
          setInvoiceHeader(invoice.invoiceHeader || '');
          setInvoiceTerms(invoice.invoiceTerms || '');
          setReceiptFooter(invoice.receiptFooter || '');

          // Map QR branding
          if (settingsObj.qrBranding) {
            setQrBranding(settingsObj.qrBranding);
          }
        }
      } catch (err) {
        console.error('Failed to load restaurant profile settings:', err);
        notify({
          title: 'Error Loading Settings',
          body: 'Failed to retrieve profile configurations from backend.',
        });
      } finally {
        setLoading(false);
      }
    };
    void fetchSettings();
  }, [notify]);

  // Fetch branches callback
  const loadBranches = useCallback(async () => {
    try {
      setLoadingBranches(true);
      const data = await getBranches();
      setBranches(data);
    } catch (err: any) {
      console.error('Failed to load branches:', err);
      notify({
        title: 'Error Loading Branches',
        body: err.message || 'Failed to retrieve restaurant branches.',
      });
    } finally {
      setLoadingBranches(false);
    }
  }, [notify]);

  // Trigger load when tab selected
  useEffect(() => {
    if (activeTab === 'branches') {
      void loadBranches();
    }
  }, [activeTab, loadBranches]);

  const handleOpenBranchModal = (branch?: Branch) => {
    if (branch) {
      setSelectedBranch(branch);
      setBranchName(branch.name);
      setBranchCode(branch.code || '');
      setBranchLocation(branch.location || '');
      setBranchAddress(branch.address || '');
      setBranchPhone(branch.phone || '');
      setBranchEmail(branch.email || '');
      setBranchManagerName(branch.managerName || '');
      setBranchManagerEmail(branch.managerEmail || '');
      setBranchManagerPhone(branch.managerPhone || '');
      setBranchStatus(branch.status || 'ACTIVE');
      setBranchIsMain(branch.isMain || false);
      setBranchIsDefault(branch.isDefault || false);
      setBranchHours(branch.workingHours || {
        monday: { open: '09:00', close: '22:00', closed: false },
        tuesday: { open: '09:00', close: '22:00', closed: false },
        wednesday: { open: '09:00', close: '22:00', closed: false },
        thursday: { open: '09:00', close: '22:00', closed: false },
        friday: { open: '09:00', close: '23:00', closed: false },
        saturday: { open: '09:00', close: '23:00', closed: false },
        sunday: { open: '09:00', close: '22:00', closed: false }
      });
    } else {
      setSelectedBranch(null);
      setBranchName('');
      setBranchCode('');
      setBranchLocation('');
      setBranchAddress('');
      setBranchPhone('');
      setBranchEmail('');
      setBranchManagerName('');
      setBranchManagerEmail('');
      setBranchManagerPhone('');
      setBranchStatus('ACTIVE');
      setBranchIsMain(false);
      setBranchIsDefault(false);
      setBranchHours({
        monday: { open: '09:00', close: '22:00', closed: false },
        tuesday: { open: '09:00', close: '22:00', closed: false },
        wednesday: { open: '09:00', close: '22:00', closed: false },
        thursday: { open: '09:00', close: '22:00', closed: false },
        friday: { open: '09:00', close: '23:00', closed: false },
        saturday: { open: '09:00', close: '23:00', closed: false },
        sunday: { open: '09:00', close: '22:00', closed: false }
      });
    }
    setIsBranchModalOpen(true);
  };

  const handleSaveBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchName.trim()) {
      notify({ title: 'Validation Error', body: 'Branch name is required' });
      return;
    }

    const branchData = {
      name: branchName,
      code: branchCode || null,
      location: branchLocation || null,
      address: branchAddress || null,
      phone: branchPhone || null,
      email: branchEmail || null,
      managerName: branchManagerName || null,
      managerEmail: branchManagerEmail || null,
      managerPhone: branchManagerPhone || null,
      status: branchStatus,
      isMain: branchIsMain,
      isDefault: branchIsDefault,
      workingHours: branchHours,
    };

    try {
      if (selectedBranch) {
        await updateBranch(selectedBranch.id, branchData);
        notify({ title: 'Success', body: 'Branch updated successfully!' });
      } else {
        await createBranch(branchData);
        notify({ title: 'Success', body: 'Branch created successfully!' });
      }
      setIsBranchModalOpen(false);
      void loadBranches();
    } catch (err: any) {
      console.error('Failed to save branch:', err);
      notify({ title: 'Error Saving Branch', body: err.message || 'Failed to save branch configurations.' });
    }
  };

  const handleDeleteBranch = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this branch? All tables and orders associated with it will be deleted.')) {
      return;
    }

    try {
      await deleteBranch(id);
      notify({ title: 'Success', body: 'Branch deleted successfully.' });
      if (viewingAnalyticsBranchId === id) {
        setViewingAnalyticsBranchId(null);
        setBranchAnalytics(null);
      }
      void loadBranches();
    } catch (err: any) {
      console.error('Failed to delete branch:', err);
      notify({ title: 'Error Deleting Branch', body: err.message || 'Failed to delete branch.' });
    }
  };

  const handleToggleDefault = async (branch: Branch) => {
    try {
      await updateBranch(branch.id, { isDefault: true });
      notify({ title: 'Success', body: `${branch.name} is now the default branch.` });
      void loadBranches();
    } catch (err: any) {
      console.error('Failed to update default branch:', err);
      notify({ title: 'Error Updating Default', body: err.message || 'Failed to set default branch.' });
    }
  };

  const handleViewAnalytics = async (id: string) => {
    if (viewingAnalyticsBranchId === id) {
      setViewingAnalyticsBranchId(null);
      setBranchAnalytics(null);
      return;
    }

    try {
      setLoadingAnalytics(true);
      setViewingAnalyticsBranchId(id);
      const data = await getBranchAnalytics(id);
      setBranchAnalytics(data);
    } catch (err: any) {
      console.error('Failed to load branch analytics:', err);
      notify({ title: 'Error Loading Analytics', body: err.message || 'Failed to load branch analytics.' });
      setViewingAnalyticsBranchId(null);
      setBranchAnalytics(null);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  // Validation function
  const validateField = useCallback((fieldName: string, val: any): string => {
    let error = '';
    if (fieldName === 'email' && val) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) error = 'Invalid email address';
    }
    if (fieldName === 'gst' && val) {
      const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (!gstRegex.test(val)) error = 'Invalid GSTIN (e.g. 22AAAAA0000A1Z5)';
    }
    if (fieldName === 'pan' && val) {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(val)) error = 'Invalid PAN format (e.g. ABCDE1234F)';
    }
    if (fieldName === 'fssai' && val) {
      const fssaiRegex = /^[0-9]{14}$/;
      if (!fssaiRegex.test(val)) error = 'FSSAI License must be 14 numeric digits';
    }
    if (fieldName === 'website' && val) {
      try {
        const formatted = val.startsWith('http') ? val : `https://${val}`;
        new URL(formatted);
      } catch {
        error = 'Invalid website URL';
      }
    }
    return error;
  }, []);

  const handleInputChange = (fieldName: string, value: any, setter: (v: any) => void) => {
    setter(value);
    
    // Perform instant validation
    const err = validateField(fieldName, value);
    setErrors(prev => ({
      ...prev,
      [fieldName]: err
    }));

    if (!err) {
      setSaveStatus('pending');
    }
  };

  // Autosave triggered upon state changes (debounced by 1s)
  useEffect(() => {
    if (loading) return; // Avoid autosaving during initial fetch

    // Don't save if there are validation errors
    const hasErrors = Object.values(errors).some(err => err !== '');
    if (hasErrors) {
      setSaveStatus('error');
      return;
    }

    setSaveStatus('pending');

    const delayDebounceFn = setTimeout(async () => {
      if (!isOwner) return; // Read-only mode

      try {
        setSaveStatus('saving');
        
        // Assemble payload matching updateBusinessSettings
        const payload = {
          name,
          phone,
          email,
          address,
          logo,
          location,
          settings: {
            ...rawSettings,
            profile: {
              ...rawSettings.profile,
              name,
              email,
              address,
              location,
              legalBusinessName,
              description,
              cuisine,
              diningTypes,
              gst,
              fssai,
              pan,
              businessRegistration,
              website,
              googleMaps,
              socialMedia,
            },
            operational: {
              ...rawSettings.operational,
              operatingHours,
              holidays,
            },
            theme: {
              ...rawSettings.theme,
              preset: themePreset,
              primaryColor,
              secondaryColor,
              coverImage,
              gallery,
            },
            invoice: {
              ...rawSettings.invoice,
              invoiceHeader,
              invoiceTerms,
              receiptFooter,
            },
            qrBranding,
          }
        };

        await updateBusinessSettings(payload);
        
        // Keep localized names updated in sync
        localStorage.setItem('restaurantName', name);
        // Dispatch storage event to notify navbar/sidebar
        window.dispatchEvent(new Event('storage'));

        setSaveStatus('saved');
      } catch (err) {
        console.error('Autosave settings failed:', err);
        setSaveStatus('error');
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [
    name, legalBusinessName, description, website, cuisine, diningTypes,
    logo, coverImage, gallery, themePreset, primaryColor, secondaryColor,
    phone, email, address, location, googleMaps, socialMedia,
    operatingHours, holidays, gst, fssai, pan, businessRegistration,
    invoiceHeader, invoiceTerms, receiptFooter, qrBranding,
    rawSettings, errors, loading, isOwner
  ]);

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'logo' | 'cover' | 'gallery') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isOwner) {
      notify({ title: 'Access Denied', body: 'You do not have permission to modify files.' });
      return;
    }

    try {
      setUploadingField(target);
      setSaveStatus('saving');

      // Upload to Cloudinary via upload.service
      const url = await uploadImageToCloudinary(file, 'restaurant_profile');
      
      if (target === 'logo') {
        setLogo(url);
        notify({ title: 'Logo Uploaded', body: 'Brand logo updated successfully.' });
      } else if (target === 'cover') {
        setCoverImage(url);
        notify({ title: 'Cover Uploaded', body: 'Cover banner image updated successfully.' });
      } else if (target === 'gallery') {
        setGallery(prev => [...prev, url]);
        notify({ title: 'Gallery Updated', body: 'New image added to the gallery.' });
      }
      setSaveStatus('saved');
    } catch (err) {
      console.warn('Cloudinary upload failed, falling back to local object preview:', err);
      // Fallback for development without Cloudinary credentials
      const localUrl = URL.createObjectURL(file);
      if (target === 'logo') {
        setLogo(localUrl);
      } else if (target === 'cover') {
        setCoverImage(localUrl);
      } else if (target === 'gallery') {
        setGallery(prev => [...prev, localUrl]);
      }
      setSaveStatus('saved');
      notify({
        title: 'Preview Loaded',
        body: 'Cloudinary credentials missing. Loaded local image preview.',
      });
    } finally {
      setUploadingField(null);
    }
  };

  // Add cuisine tags
  const addCuisineTag = () => {
    if (!newCuisineTag.trim()) return;
    if (cuisine.includes(newCuisineTag.trim())) {
      setNewCuisineTag('');
      return;
    }
    setCuisine(prev => [...prev, newCuisineTag.trim()]);
    setNewCuisineTag('');
    setSaveStatus('pending');
  };

  // Remove cuisine tags
  const removeCuisineTag = (tag: string) => {
    setCuisine(prev => prev.filter(t => t !== tag));
    setSaveStatus('pending');
  };

  // Add Holiday
  const addHoliday = () => {
    if (!newHolidayDate || !newHolidayName.trim()) {
      notify({ title: 'Validation Warning', body: 'Please enter both holiday date and name.' });
      return;
    }
    if (holidays.some(h => h.date === newHolidayDate)) {
      notify({ title: 'Duplicate Date', body: 'A holiday is already scheduled on this date.' });
      return;
    }
    setHolidays(prev => [...prev, { date: newHolidayDate, name: newHolidayName.trim() }].sort((a, b) => a.date.localeCompare(b.date)));
    setNewHolidayDate('');
    setNewHolidayName('');
    setSaveStatus('pending');
  };

  // Remove Holiday
  const removeHoliday = (date: string) => {
    setHolidays(prev => prev.filter(h => h.date !== date));
    setSaveStatus('pending');
  };

  // Dining Type toggle
  const toggleDiningType = (type: string) => {
    setDiningTypes(prev => {
      const next = prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type];
      // Keep at least one dining type active
      return next.length > 0 ? next : prev;
    });
    setSaveStatus('pending');
  };

  // Operating Hours shift change
  const handleHoursChange = (index: number, field: 'open' | 'close' | 'closed', value: any) => {
    setOperatingHours(prev => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        [field]: value
      };
      return next;
    });
    setSaveStatus('pending');
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        <span className="font-semibold text-sm">Initializing Profile Configurator...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 text-slate-100 select-none">
      
      {/* HEADER BANNER WITH AUTOSAVE STATS */}
      <div className="backdrop-blur-xl bg-slate-900/60 dark:bg-slate-950/40 border border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Cover backdrop simulation */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 to-indigo-650" />

        <div className="flex items-center gap-5 z-10 w-full md:w-auto">
          <div className="relative w-20 h-20 rounded-2xl bg-slate-800/80 border border-white/20 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-lg group">
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <Building className="w-10 h-10 text-slate-500" />
            )}
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-black tracking-tight text-white">{name || 'Your Restaurant'}</h1>
            <p className="text-xs text-slate-400 font-medium mt-1.5 max-w-lg line-clamp-2">{description || 'No description added yet. Build your identity by introducing your store to the world.'}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[9px] font-bold uppercase tracking-wider">
                {diningTypes.join(' • ') || 'Dine-In'}
              </span>
              {cuisine.slice(0, 3).map((c, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/10 text-[9px] font-bold">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Save Status Indicators */}
        <div className="flex flex-col items-end gap-2 z-10 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-white/5">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-md bg-slate-950/40 border border-white/10 shadow-inner">
            {saveStatus === 'saved' && (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]" />
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">All changes saved</span>
              </>
            )}
            {saveStatus === 'saving' && (
              <>
                <Loader2 className="w-3 h-3 animate-spin text-yellow-500" />
                <span className="text-[10px] font-black uppercase tracking-wider text-yellow-400">Saving details...</span>
              </>
            )}
            {saveStatus === 'pending' && (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3B82F6]" />
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-400">Autosave pending</span>
              </>
            )}
            {saveStatus === 'error' && (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_#EF4444]" />
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-400">Errors detected</span>
              </>
            )}
          </div>
          <span className="text-[10px] text-slate-500 font-semibold mt-0.5">Workspace edits are synchronized automatically.</span>
        </div>

      </div>

      {/* READONLY MODE WARNING BANNER */}
      {!isOwner && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3.5 text-amber-300 shadow-md">
          <Lock className="w-5 h-5 flex-shrink-0 text-amber-400 animate-pulse" />
          <div className="text-xs text-left">
            <span className="font-extrabold uppercase tracking-wide mr-1.5">Read-Only Mode:</span>
            Your account role permissions do not permit business configurations. Please contact your restaurant workspace owner or system administrator to request modifications.
          </div>
        </div>
      )}

      {/* WORKSPACE CONFIGURATION LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* TAB NAVIGATION PANEL */}
        <div className="backdrop-blur-xl bg-slate-900/40 border border-white/10 rounded-2xl p-3.5 space-y-1.5 shadow-xl lg:sticky lg:top-6">
          <p className="px-2.5 pb-2 text-[8px] font-black uppercase tracking-widest text-slate-500 border-b border-white/5 mb-2.5 text-left font-mono">Settings console</p>
          
          <button
            onClick={() => setActiveTab('identity')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'identity'
                ? 'bg-blue-600/20 text-blue-450 border border-blue-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Building size={14} className={activeTab === 'identity' ? 'text-blue-400' : 'text-slate-500'} />
            <span>Business Identity</span>
          </button>

          <button
            onClick={() => setActiveTab('branding')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'branding'
                ? 'bg-blue-600/20 text-blue-450 border border-blue-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Palette size={14} className={activeTab === 'branding' ? 'text-blue-400' : 'text-slate-500'} />
            <span>Branding & Gallery</span>
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'contact'
                ? 'bg-blue-600/20 text-blue-455 border border-blue-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <MapPin size={14} className={activeTab === 'contact' ? 'text-blue-400' : 'text-slate-500'} />
            <span>Contact & Maps</span>
          </button>

          <button
            onClick={() => setActiveTab('hours')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'hours'
                ? 'bg-blue-600/20 text-blue-455 border border-blue-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Clock size={14} className={activeTab === 'hours' ? 'text-blue-400' : 'text-slate-500'} />
            <span>Hours & Holidays</span>
          </button>

          <button
            onClick={() => setActiveTab('compliance')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'compliance'
                ? 'bg-blue-600/20 text-blue-455 border border-blue-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <FileText size={14} className={activeTab === 'compliance' ? 'text-blue-400' : 'text-slate-500'} />
            <span>Compliance & Taxes</span>
          </button>

          <button
            onClick={() => setActiveTab('invoice')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'invoice'
                ? 'bg-blue-600/20 text-blue-455 border border-blue-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <FileCheck size={14} className={activeTab === 'invoice' ? 'text-blue-400' : 'text-slate-500'} />
            <span>Invoice & Receipts</span>
          </button>

          <button
            onClick={() => setActiveTab('qr')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'qr'
                ? 'bg-blue-600/20 text-blue-455 border border-blue-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Smartphone size={14} className={activeTab === 'qr' ? 'text-blue-400' : 'text-slate-500'} />
            <span>QR branding</span>
          </button>

          <button
            onClick={() => setActiveTab('branches')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'branches'
                ? 'bg-blue-600/20 text-blue-455 border border-blue-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Layers size={14} className={activeTab === 'branches' ? 'text-blue-400' : 'text-slate-500'} />
            <span>Branch Management</span>
          </button>

        </div>

        {/* TAB WORKSPACE CONTENT */}
        <div className="lg:col-span-3 backdrop-blur-xl bg-slate-900/30 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl min-h-[50vh] text-left">
          
          {/* TAB 1: BUSINESS IDENTITY */}
          {activeTab === 'identity' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-black tracking-tight text-white">Business Identity</h2>
                <p className="text-xs text-slate-400 mt-1">Configure your main brand details displayed on the digital menus and customer invoices.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Restaurant Display Name</label>
                  <input
                    type="text"
                    disabled={!isOwner}
                    value={name}
                    onChange={(e) => handleInputChange('name', e.target.value, setName)}
                    placeholder="e.g. Spice Corner"
                    className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500 transition disabled:opacity-50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Legal Business Name</label>
                  <input
                    type="text"
                    disabled={!isOwner}
                    value={legalBusinessName}
                    onChange={(e) => handleInputChange('legalBusinessName', e.target.value, setLegalBusinessName)}
                    placeholder="e.g. Spice Corner Foods Pvt Ltd"
                    className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500 transition disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Public Description</label>
                <textarea
                  disabled={!isOwner}
                  rows={4}
                  value={description}
                  onChange={(e) => handleInputChange('description', e.target.value, setDescription)}
                  placeholder="Introduce your culinary delights to customers..."
                  className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500 transition resize-none disabled:opacity-50"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Dining Services Offered</label>
                  <div className="space-y-2.5">
                    {['Dine-in', 'Takeaway', 'Delivery'].map((type) => (
                      <label key={type} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border border-white/5 bg-slate-950/20 cursor-pointer transition ${!isOwner ? 'opacity-50 pointer-events-none' : 'hover:bg-white/5'}`}>
                        <input
                          type="checkbox"
                          disabled={!isOwner}
                          checked={diningTypes.includes(type)}
                          onChange={() => toggleDiningType(type)}
                          className="w-4 h-4 rounded border-white/10 bg-slate-900 text-blue-600 focus:ring-0 focus:ring-offset-0"
                        />
                        <span className="text-xs font-bold text-slate-200">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Cuisine Specialities</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      disabled={!isOwner}
                      value={newCuisineTag}
                      onChange={(e) => setNewCuisineTag(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addCuisineTag()}
                      placeholder="e.g. Italian, North Indian"
                      className="flex-1 bg-slate-950/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 transition disabled:opacity-50"
                    />
                    <button
                      type="button"
                      disabled={!isOwner || !newCuisineTag.trim()}
                      onClick={addCuisineTag}
                      className="px-3.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1.5">
                    {cuisine.map((tag) => (
                      <span key={tag} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold">
                        <span>{tag}</span>
                        {isOwner && (
                          <button
                            type="button"
                            onClick={() => removeCuisineTag(tag)}
                            className="text-blue-400 hover:text-rose-400 transition"
                          >
                            <X size={12} />
                          </button>
                        )}
                      </span>
                    ))}
                    {cuisine.length === 0 && (
                      <span className="text-xs text-slate-500 italic">No cuisine specialities configured yet.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BRANDING & GALLERY */}
          {activeTab === 'branding' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-black tracking-tight text-white">Branding & Gallery</h2>
                <p className="text-xs text-slate-400 mt-1">Configure your brand style presets and upload cover or gallery photos representing your storefront.</p>
              </div>

              {/* Theme Presets */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Visual Theme Preset</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'glass-violet', label: 'Glass Violet', color: '#8B5CF6' },
                    { id: 'glass-blue', label: 'Indigo Ocean', color: '#3B82F6' },
                    { id: 'glass-emerald', label: 'Emerald Mint', color: '#10B981' },
                    { id: 'glass-amber', label: 'Crimson Amber', color: '#F59E0B' },
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      disabled={!isOwner}
                      onClick={() => {
                        setThemePreset(preset.id);
                        setPrimaryColor(preset.color);
                        setSaveStatus('pending');
                      }}
                      className={`flex flex-col items-center p-3 rounded-xl border text-left transition ${
                        themePreset === preset.id
                          ? 'border-blue-500 bg-blue-600/10 text-white'
                          : 'border-white/10 bg-slate-950/20 text-slate-400 hover:bg-white/5'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full border border-white/20 mb-2 flex items-center justify-center" style={{ backgroundColor: preset.color }}>
                        {themePreset === preset.id && <Check size={14} className="text-white drop-shadow" />}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* Brand Logo Upload */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Brand Logo Image</label>
                  <div className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-slate-950/20">
                    <div className="w-16 h-16 rounded-xl bg-slate-900 border border-white/15 overflow-hidden flex items-center justify-center flex-shrink-0">
                      {logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={logo} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <Building className="w-8 h-8 text-slate-600" />
                      )}
                    </div>
                    {isOwner && (
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          id="logo-upload"
                          className="hidden"
                          onChange={(e) => void handleImageUpload(e, 'logo')}
                        />
                        <label
                          htmlFor="logo-upload"
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-[10px] font-black uppercase tracking-wider text-white cursor-pointer transition disabled:opacity-50"
                        >
                          {uploadingField === 'logo' ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                          <span>Upload Logo</span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Cover Banner Upload */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Cover Banner Image</label>
                  <div className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-slate-950/20">
                    <div className="w-24 h-16 rounded-xl bg-slate-900 border border-white/15 overflow-hidden flex items-center justify-center flex-shrink-0">
                      {coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-slate-600" />
                      )}
                    </div>
                    {isOwner && (
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          id="cover-upload"
                          className="hidden"
                          onChange={(e) => void handleImageUpload(e, 'cover')}
                        />
                        <label
                          htmlFor="cover-upload"
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-[10px] font-black uppercase tracking-wider text-white cursor-pointer transition disabled:opacity-50"
                        >
                          {uploadingField === 'cover' ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                          <span>Upload Cover</span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Photo Gallery Grid */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Restaurant Gallery Photos</label>
                  {isOwner && (
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        id="gallery-upload"
                        className="hidden"
                        onChange={(e) => void handleImageUpload(e, 'gallery')}
                      />
                      <label
                        htmlFor="gallery-upload"
                        className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-[9px] font-black uppercase tracking-wider text-white cursor-pointer transition"
                      >
                        {uploadingField === 'gallery' ? <Loader2 size={10} className="animate-spin" /> : <Plus size={10} />}
                        <span>Add Photo</span>
                      </label>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {gallery.map((url, index) => (
                    <div key={index} className="relative aspect-video rounded-xl bg-slate-900 border border-white/10 overflow-hidden group shadow">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover transition duration-300 group-hover:scale-105" />
                      {isOwner && (
                        <button
                          type="button"
                          onClick={() => {
                            setGallery(prev => prev.filter((_, i) => i !== index));
                            setSaveStatus('pending');
                          }}
                          className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-rose-400 hover:text-rose-500 transition duration-200"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  {gallery.length === 0 && (
                    <div className="col-span-full border border-dashed border-white/10 rounded-2xl py-8 flex flex-col items-center justify-center text-slate-500 gap-1.5 bg-slate-950/10">
                      <ImageIcon size={22} className="text-slate-600" />
                      <span className="text-xs font-bold">No gallery photos added yet.</span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: CONTACT & LOCATION */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-black tracking-tight text-white">Contact & Maps Location</h2>
                <p className="text-xs text-slate-400 mt-1">Provide contact points for customers to connect with you and map location coordinates.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Contact Email Address</label>
                  <input
                    type="email"
                    disabled={!isOwner}
                    value={email}
                    onChange={(e) => handleInputChange('email', e.target.value, setEmail)}
                    placeholder="e.g. hello@spicecorner.com"
                    className={`w-full bg-slate-950/40 border rounded-xl px-4 py-3 text-xs text-white focus:outline-none transition disabled:opacity-50 ${
                      errors.email ? 'border-rose-500/50 focus:border-rose-500' : 'border-white/10 focus:border-blue-500'
                    }`}
                  />
                  {errors.email && <p className="text-[10px] text-rose-400 font-bold">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Contact Phone Number</label>
                  <input
                    type="text"
                    disabled={!isOwner}
                    value={phone}
                    onChange={(e) => handleInputChange('phone', e.target.value, setPhone)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500 transition disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Google Maps Link / Iframe Code</label>
                  <input
                    type="text"
                    disabled={!isOwner}
                    value={googleMaps}
                    onChange={(e) => handleInputChange('googleMaps', e.target.value, setGoogleMaps)}
                    placeholder="https://google.com/maps/embed/v1/place?q=..."
                    className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500 transition disabled:opacity-50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Website URL</label>
                  <input
                    type="text"
                    disabled={!isOwner}
                    value={website}
                    onChange={(e) => handleInputChange('website', e.target.value, setWebsite)}
                    placeholder="e.g. www.spicecorner.com"
                    className={`w-full bg-slate-950/40 border rounded-xl px-4 py-3 text-xs text-white focus:outline-none transition disabled:opacity-50 ${
                      errors.website ? 'border-rose-500/50 focus:border-rose-500' : 'border-white/10 focus:border-blue-500'
                    }`}
                  />
                  {errors.website && <p className="text-[10px] text-rose-400 font-bold">{errors.website}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Street Address</label>
                  <textarea
                    disabled={!isOwner}
                    rows={3}
                    value={address}
                    onChange={(e) => handleInputChange('address', e.target.value, setAddress)}
                    placeholder="12th Main Road, Indiranagar, Bengaluru..."
                    className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500 transition resize-none disabled:opacity-50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">City / Region (Short location)</label>
                  <input
                    type="text"
                    disabled={!isOwner}
                    value={location}
                    onChange={(e) => handleInputChange('location', e.target.value, setLocation)}
                    placeholder="e.g. Indiranagar, Bengaluru"
                    className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500 transition disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Social Media Links */}
              <div className="space-y-3 pt-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Social Media Handles</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center bg-slate-950/40 border border-white/10 rounded-xl overflow-hidden focus-within:border-blue-500 transition">
                    <span className="w-12 h-12 flex items-center justify-center text-slate-500 border-r border-white/10 bg-white/5">
                      <Facebook size={16} />
                    </span>
                    <input
                      type="text"
                      disabled={!isOwner}
                      value={socialMedia.facebook || ''}
                      onChange={(e) => handleInputChange('socialMedia', { ...socialMedia, facebook: e.target.value }, setSocialMedia)}
                      placeholder="Facebook profile URL"
                      className="flex-1 bg-transparent px-4 py-3 text-xs text-white focus:outline-none disabled:opacity-50"
                    />
                  </div>

                  <div className="flex items-center bg-slate-950/40 border border-white/10 rounded-xl overflow-hidden focus-within:border-blue-500 transition">
                    <span className="w-12 h-12 flex items-center justify-center text-slate-500 border-r border-white/10 bg-white/5">
                      <Instagram size={16} />
                    </span>
                    <input
                      type="text"
                      disabled={!isOwner}
                      value={socialMedia.instagram || ''}
                      onChange={(e) => handleInputChange('socialMedia', { ...socialMedia, instagram: e.target.value }, setSocialMedia)}
                      placeholder="Instagram username / URL"
                      className="flex-1 bg-transparent px-4 py-3 text-xs text-white focus:outline-none disabled:opacity-50"
                    />
                  </div>

                  <div className="flex items-center bg-slate-950/40 border border-white/10 rounded-xl overflow-hidden focus-within:border-blue-500 transition">
                    <span className="w-12 h-12 flex items-center justify-center text-slate-500 border-r border-white/10 bg-white/5">
                      <Twitter size={16} />
                    </span>
                    <input
                      type="text"
                      disabled={!isOwner}
                      value={socialMedia.twitter || ''}
                      onChange={(e) => handleInputChange('socialMedia', { ...socialMedia, twitter: e.target.value }, setSocialMedia)}
                      placeholder="Twitter / X profile URL"
                      className="flex-1 bg-transparent px-4 py-3 text-xs text-white focus:outline-none disabled:opacity-50"
                    />
                  </div>

                  <div className="flex items-center bg-slate-950/40 border border-white/10 rounded-xl overflow-hidden focus-within:border-blue-500 transition">
                    <span className="w-12 h-12 flex items-center justify-center text-slate-500 border-r border-white/10 bg-white/5">
                      <Youtube size={16} />
                    </span>
                    <input
                      type="text"
                      disabled={!isOwner}
                      value={socialMedia.youtube || ''}
                      onChange={(e) => handleInputChange('socialMedia', { ...socialMedia, youtube: e.target.value }, setSocialMedia)}
                      placeholder="YouTube channel URL"
                      className="flex-1 bg-transparent px-4 py-3 text-xs text-white focus:outline-none disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: HOURS & HOLIDAYS */}
          {activeTab === 'hours' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-black tracking-tight text-white">Hours & Holidays</h2>
                <p className="text-xs text-slate-400 mt-1">Configure your weekly operating hours shifts and register calendar holidays.</p>
              </div>

              {/* Operating Hours Table */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block font-mono">Weekly Operating Hours</label>
                <div className="border border-white/10 rounded-2xl overflow-hidden bg-slate-950/20 divide-y divide-white/5">
                  {operatingHours.map((shift, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 text-xs font-semibold">
                      <span className="w-24 text-slate-200 text-left font-bold">{shift.day}</span>
                      
                      <div className="flex items-center gap-3">
                        <label className={`flex items-center gap-2 cursor-pointer ${!isOwner && 'pointer-events-none opacity-50'}`}>
                          <input
                            type="checkbox"
                            disabled={!isOwner}
                            checked={!shift.closed}
                            onChange={() => handleHoursChange(idx, 'closed', !shift.closed)}
                            className="w-4 h-4 rounded border-white/10 bg-slate-900 text-blue-600 focus:ring-0 focus:ring-offset-0"
                          />
                          <span className={`text-[10px] font-black uppercase tracking-wider ${shift.closed ? 'text-rose-500' : 'text-emerald-500'}`}>
                            {shift.closed ? 'Closed' : 'Open'}
                          </span>
                        </label>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="flex items-center gap-1.5 bg-slate-950/40 border border-white/10 rounded-lg px-2.5 py-1.5">
                          <span className="text-[10px] text-slate-500 font-bold uppercase mr-1">From</span>
                          <input
                            type="time"
                            disabled={!isOwner || shift.closed}
                            value={shift.open}
                            onChange={(e) => handleHoursChange(idx, 'open', e.target.value)}
                            className="bg-transparent text-white focus:outline-none text-xs disabled:opacity-30"
                          />
                        </div>
                        <span className="text-slate-500">—</span>
                        <div className="flex items-center gap-1.5 bg-slate-950/40 border border-white/10 rounded-lg px-2.5 py-1.5">
                          <span className="text-[10px] text-slate-500 font-bold uppercase mr-1">To</span>
                          <input
                            type="time"
                            disabled={!isOwner || shift.closed}
                            value={shift.close}
                            onChange={(e) => handleHoursChange(idx, 'close', e.target.value)}
                            className="bg-transparent text-white focus:outline-none text-xs disabled:opacity-30"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Holiday Management List */}
              <div className="space-y-3 pt-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block font-mono">Upcoming Holidays & Closures</label>
                
                {isOwner && (
                  <div className="flex flex-col sm:flex-row gap-3 bg-slate-950/35 border border-white/10 rounded-xl p-3">
                    <input
                      type="date"
                      value={newHolidayDate}
                      onChange={(e) => setNewHolidayDate(e.target.value)}
                      className="bg-slate-950/40 border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 transition"
                    />
                    <input
                      type="text"
                      value={newHolidayName}
                      onChange={(e) => setNewHolidayName(e.target.value)}
                      placeholder="e.g. Independence Day"
                      className="flex-1 bg-slate-950/40 border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 transition"
                    />
                    <button
                      type="button"
                      onClick={addHoliday}
                      className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
                    >
                      <Plus size={14} />
                      <span>Add Holiday</span>
                    </button>
                  </div>
                )}

                <div className="border border-white/10 rounded-2xl overflow-hidden bg-slate-950/15 divide-y divide-white/5 max-h-[25vh] overflow-y-auto">
                  {holidays.map((h, index) => (
                    <div key={index} className="flex items-center justify-between p-3.5 text-xs font-semibold">
                      <div className="flex items-center gap-3 text-left">
                        <Calendar size={14} className="text-slate-500" />
                        <span className="text-slate-400 font-mono">{new Date(h.date).toLocaleDateString('en-US', { dateStyle: 'medium' })}</span>
                        <span className="text-white font-bold">— {h.name}</span>
                      </div>
                      {isOwner && (
                        <button
                          type="button"
                          onClick={() => removeHoliday(h.date)}
                          className="p-1 rounded-lg text-slate-500 hover:text-rose-500 transition"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  ))}
                  {holidays.length === 0 && (
                    <div className="p-6 text-center text-slate-500 italic">No scheduled holidays added yet.</div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: COMPLIANCE & TAXES */}
          {activeTab === 'compliance' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-black tracking-tight text-white">Compliance & Taxes</h2>
                <p className="text-xs text-slate-400 mt-1">Configure your regulatory tax credentials and license registration details.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">GSTIN (GST Number)</label>
                  <input
                    type="text"
                    disabled={!isOwner}
                    value={gst}
                    onChange={(e) => handleInputChange('gst', e.target.value.toUpperCase(), setGst)}
                    placeholder="e.g. 22AAAAA0000A1Z5"
                    maxLength={15}
                    className={`w-full bg-slate-950/40 border rounded-xl px-4 py-3 text-xs text-white focus:outline-none transition disabled:opacity-50 ${
                      errors.gst ? 'border-rose-500/50 focus:border-rose-500' : 'border-white/10 focus:border-blue-500'
                    }`}
                  />
                  {errors.gst && <p className="text-[10px] text-rose-400 font-bold">{errors.gst}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">FSSAI License Number</label>
                  <input
                    type="text"
                    disabled={!isOwner}
                    value={fssai}
                    onChange={(e) => handleInputChange('fssai', e.target.value.replace(/\D/g, ''), setFssai)}
                    placeholder="14-digit license number"
                    maxLength={14}
                    className={`w-full bg-slate-950/40 border rounded-xl px-4 py-3 text-xs text-white focus:outline-none transition disabled:opacity-50 ${
                      errors.fssai ? 'border-rose-500/50 focus:border-rose-500' : 'border-white/10 focus:border-blue-500'
                    }`}
                  />
                  {errors.fssai && <p className="text-[10px] text-rose-400 font-bold">{errors.fssai}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">PAN (Permanent Account Number)</label>
                  <input
                    type="text"
                    disabled={!isOwner}
                    value={pan}
                    onChange={(e) => handleInputChange('pan', e.target.value.toUpperCase(), setPan)}
                    placeholder="e.g. ABCDE1234F"
                    maxLength={10}
                    className={`w-full bg-slate-950/40 border rounded-xl px-4 py-3 text-xs text-white focus:outline-none transition disabled:opacity-50 ${
                      errors.pan ? 'border-rose-500/50 focus:border-rose-500' : 'border-white/10 focus:border-blue-500'
                    }`}
                  />
                  {errors.pan && <p className="text-[10px] text-rose-400 font-bold">{errors.pan}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Business Registration Number / Entity Info</label>
                  <input
                    type="text"
                    disabled={!isOwner}
                    value={businessRegistration}
                    onChange={(e) => handleInputChange('businessRegistration', e.target.value, setBusinessRegistration)}
                    placeholder="UIN, CIN, or Corporate registration number"
                    className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500 transition disabled:opacity-50"
                  />
                </div>
              </div>

            </div>
          )}

          {/* TAB 6: INVOICE & RECEIPT */}
          {activeTab === 'invoice' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-black tracking-tight text-white">Invoice & Receipt Customization</h2>
                <p className="text-xs text-slate-400 mt-1">Configure layout text blocks appearing on printed billing invoices and thermal receipts.</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Invoice Header Terms / Welcome Note</label>
                <input
                  type="text"
                  disabled={!isOwner}
                  value={invoiceHeader}
                  onChange={(e) => handleInputChange('invoiceHeader', e.target.value, setInvoiceHeader)}
                  placeholder="e.g. Thank you for dining with us! We appreciate your support."
                  className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500 transition disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Invoice Terms & Conditions (Footer)</label>
                <textarea
                  disabled={!isOwner}
                  rows={4}
                  value={invoiceTerms}
                  onChange={(e) => handleInputChange('invoiceTerms', e.target.value, setInvoiceTerms)}
                  placeholder="e.g. 1. Goods once sold cannot be returned. 2. Standard Service Charge applies..."
                  className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500 transition resize-none disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Thermal Receipt Footer Text</label>
                <input
                  type="text"
                  disabled={!isOwner}
                  value={receiptFooter}
                  onChange={(e) => handleInputChange('receiptFooter', e.target.value, setReceiptFooter)}
                  placeholder="e.g. Please scan QR to provide feedback! Have a wonderful day!"
                  className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500 transition disabled:opacity-50"
                />
              </div>

            </div>
          )}

          {/* TAB 7: QR BRANDING */}
          {activeTab === 'qr' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-black tracking-tight text-white">QR Code Branding Configuration</h2>
                <p className="text-xs text-slate-400 mt-1">Configure layout, colors, and branding elements for generating custom table ordering QR codes.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* QR Design Controllers */}
                <div className="space-y-5">
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Dot Color</label>
                    <div className="flex gap-3 items-center">
                      <input
                        type="color"
                        disabled={!isOwner}
                        value={qrBranding.dotColor}
                        onChange={(e) => {
                          setQrBranding(prev => ({ ...prev, dotColor: e.target.value }));
                          setSaveStatus('pending');
                        }}
                        className="w-10 h-10 rounded border border-white/10 bg-transparent cursor-pointer disabled:opacity-50"
                      />
                      <input
                        type="text"
                        disabled={!isOwner}
                        value={qrBranding.dotColor}
                        onChange={(e) => {
                          setQrBranding(prev => ({ ...prev, dotColor: e.target.value }));
                          setSaveStatus('pending');
                        }}
                        className="w-28 bg-slate-950/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none disabled:opacity-50 font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Corner Eye Color</label>
                    <div className="flex gap-3 items-center">
                      <input
                        type="color"
                        disabled={!isOwner}
                        value={qrBranding.eyeColor}
                        onChange={(e) => {
                          setQrBranding(prev => ({ ...prev, eyeColor: e.target.value }));
                          setSaveStatus('pending');
                        }}
                        className="w-10 h-10 rounded border border-white/10 bg-transparent cursor-pointer disabled:opacity-50"
                      />
                      <input
                        type="text"
                        disabled={!isOwner}
                        value={qrBranding.eyeColor}
                        onChange={(e) => {
                          setQrBranding(prev => ({ ...prev, eyeColor: e.target.value }));
                          setSaveStatus('pending');
                        }}
                        className="w-28 bg-slate-950/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none disabled:opacity-50 font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">QR Style Layout Template</label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {['classic', 'minimal', 'luxury', 'creative'].map((t) => (
                        <button
                          key={t}
                          type="button"
                          disabled={!isOwner}
                          onClick={() => {
                            setQrBranding(prev => ({ ...prev, template: t as any }));
                            setSaveStatus('pending');
                          }}
                          className={`px-3.5 py-2.5 rounded-xl border text-center transition text-xs font-bold uppercase tracking-wider ${
                            qrBranding.template === t
                              ? 'border-blue-500 bg-blue-600/10 text-blue-400 shadow-sm'
                              : 'border-white/10 bg-slate-950/20 text-slate-400 hover:bg-white/5'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* QR Live Mockup Preview */}
                <div className="flex flex-col items-center justify-center p-6 border border-white/10 bg-slate-950/30 rounded-2xl relative overflow-hidden group shadow-inner">
                  
                  {/* Backdrop glass design */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-pink-500/5 backdrop-blur-[2px]" />

                  <div className="p-4 bg-white rounded-3xl z-10 border border-white/20 shadow-2xl relative flex items-center justify-center">
                    
                    {/* Simulated vector QR layout */}
                    <div className="w-40 h-40 flex flex-col justify-between p-1.5 relative select-none">
                      
                      {/* Corner eyes */}
                      <div className="absolute top-1.5 left-1.5 w-11 h-11 border-4 rounded-lg flex items-center justify-center" style={{ borderColor: qrBranding.eyeColor }}>
                        <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: qrBranding.eyeColor }} />
                      </div>
                      <div className="absolute top-1.5 right-1.5 w-11 h-11 border-4 rounded-lg flex items-center justify-center" style={{ borderColor: qrBranding.eyeColor }}>
                        <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: qrBranding.eyeColor }} />
                      </div>
                      <div className="absolute bottom-1.5 left-1.5 w-11 h-11 border-4 rounded-lg flex items-center justify-center" style={{ borderColor: qrBranding.eyeColor }}>
                        <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: qrBranding.eyeColor }} />
                      </div>

                      {/* Random dot matrices */}
                      <div className="absolute inset-0 pt-16 pl-16 pr-1.5 pb-1.5 grid grid-cols-6 gap-2">
                        {Array.from({ length: 24 }).map((_, i) => (
                          <div
                            key={i}
                            className={`rounded-full ${i % 3 === 0 ? 'opacity-100' : 'opacity-20'}`}
                            style={{
                              backgroundColor: qrBranding.dotColor,
                              width: (i % 2 === 0 ? 5 : 7) + 'px',
                              height: (i % 2 === 0 ? 5 : 7) + 'px',
                            }}
                          />
                        ))}
                      </div>

                      {/* Inner logo embed if configured */}
                      {logo && (
                        <div className="absolute inset-0 m-auto w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center overflow-hidden shadow-md">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={logo} alt="QR Brand" className="w-full h-full object-cover" />
                        </div>
                      )}

                    </div>
                  </div>

                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-4 z-10 font-mono">Digital QR Code Preview</span>

                </div>

              </div>
            </div>
          )}

          {/* TAB 8: BRANCH MANAGEMENT */}
          {activeTab === 'branches' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                    <Layers className="text-blue-450" size={20} />
                    <span>Restaurant Branch Operations</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Manage multiple outlet branches, managers, working hours, and operational status.</p>
                </div>
                {isOwner && (
                  <button
                    onClick={() => handleOpenBranchModal()}
                    className="px-4 py-2 bg-blue-650 hover:bg-blue-600 active:scale-95 transition text-white text-xs font-black rounded-xl flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                  >
                    <Plus size={13} className="stroke-[3]" />
                    <span>Add New Branch</span>
                  </button>
                )}
              </div>

              {loadingBranches ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                  <span className="text-xs font-bold">Loading branch directory...</span>
                </div>
              ) : branches.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400 border border-dashed border-white/10 rounded-2xl gap-2">
                  <Layers className="w-8 h-8 opacity-40 text-slate-500" />
                  <span className="text-xs font-black">No branches configured</span>
                  <span className="text-[10px]">Create an outlet branch to start routing tables and kitchen orders.</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {branches.map((b) => {
                    const isAnalyticOpen = viewingAnalyticsBranchId === b.id;
                    return (
                      <div
                        key={b.id}
                        className="border border-white/10 bg-slate-950/20 rounded-2xl overflow-hidden shadow-sm flex flex-col"
                      >
                        <div className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-sm font-black text-white">{b.name}</h3>
                              {b.code && (
                                <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase bg-slate-800 text-slate-300 border border-white/5 font-mono">
                                  {b.code}
                                </span>
                              )}
                              {b.isMain && (
                                <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase bg-indigo-500/20 text-indigo-400 border border-indigo-500/25">
                                  Main
                                </span>
                              )}
                              {b.isDefault && (
                                <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/25">
                                  Default
                                </span>
                              )}
                              <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase border ${
                                b.status === 'ACTIVE'
                                  ? 'bg-blue-500/20 text-blue-400 border-blue-500/25'
                                  : b.status === 'TEMPORARILY_CLOSED'
                                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/25'
                                  : 'bg-rose-500/20 text-rose-400 border-rose-500/25'
                              }`}>
                                {b.status === 'TEMPORARILY_CLOSED' ? 'Temp Closed' : b.status}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-1 gap-x-4 text-[11px] text-slate-400">
                              {b.managerName && (
                                <span className="flex items-center gap-1.5">
                                  <span className="text-slate-500">Mgr:</span>
                                  <span className="font-bold text-slate-300">{b.managerName}</span>
                                </span>
                              )}
                              {b.phone && (
                                <span className="flex items-center gap-1.5">
                                  <Phone size={10} className="text-slate-500" />
                                  <span>{b.phone}</span>
                                </span>
                              )}
                              {b.email && (
                                <span className="flex items-center gap-1.5">
                                  <Mail size={10} className="text-slate-500" />
                                  <span>{b.email}</span>
                                </span>
                              )}
                            </div>
                            {b.address && (
                              <p className="text-[10px] text-slate-450 flex items-center gap-1">
                                <MapPin size={10} className="text-slate-500" />
                                <span>{b.address}</span>
                              </p>
                            )}
                          </div>

                          <div className="flex gap-2 flex-wrap items-center w-full md:w-auto">
                            <button
                              onClick={() => handleViewAnalytics(b.id)}
                              className={`flex-1 md:flex-none px-3 py-1.5 border rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition ${
                                isAnalyticOpen
                                  ? 'border-blue-500 bg-blue-600/10 text-blue-400'
                                  : 'border-white/10 hover:bg-white/5 text-slate-400'
                              }`}
                            >
                              <BarChart2 size={11} />
                              <span>Analytics</span>
                            </button>

                            {isOwner && (
                              <>
                                {!b.isDefault && (
                                  <button
                                    onClick={() => handleToggleDefault(b)}
                                    className="flex-1 md:flex-none px-3 py-1.5 border border-white/10 hover:bg-white/5 text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer"
                                  >
                                    Set Default
                                  </button>
                                )}
                                <button
                                  onClick={() => handleOpenBranchModal(b)}
                                  className="p-1.5 border border-white/10 hover:bg-white/5 text-slate-400 rounded-lg cursor-pointer transition active:scale-90"
                                  title="Edit branch details"
                                >
                                  <Edit2 size={12} />
                                </button>
                                {!b.isMain && !b.isDefault && (
                                  <button
                                    onClick={() => handleDeleteBranch(b.id)}
                                    className="p-1.5 border border-rose-500/20 hover:bg-rose-500/10 text-rose-400 rounded-lg cursor-pointer transition active:scale-90"
                                    title="Delete branch"
                                  >
                                    <Trash size={12} />
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </div>

                        {/* Branch Analytics Expansion */}
                        {isAnalyticOpen && (
                          <div className="border-t border-white/5 bg-slate-950/40 p-5 space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">Real-time Performance Metrics</h4>
                            
                            {loadingAnalytics ? (
                              <div className="flex justify-center items-center py-4 gap-2 text-slate-450">
                                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                                <span className="text-[10px] font-bold">Querying ledger records...</span>
                              </div>
                            ) : branchAnalytics ? (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                  <div className="bg-slate-900/50 border border-white/5 rounded-xl p-3 text-left">
                                    <span className="text-[9px] font-bold text-slate-500 uppercase block tracking-wider">Gross Sales Revenue</span>
                                    <span className="text-sm font-black text-white mt-1 block">₹{branchAnalytics.totalRevenue.toLocaleString()}</span>
                                  </div>
                                  <div className="bg-slate-900/50 border border-white/5 rounded-xl p-3 text-left">
                                    <span className="text-[9px] font-bold text-slate-500 uppercase block tracking-wider">Order Volume</span>
                                    <span className="text-sm font-black text-white mt-1 block">{branchAnalytics.orderCount} tickets</span>
                                  </div>
                                  <div className="bg-slate-900/50 border border-white/5 rounded-xl p-3 text-left">
                                    <span className="text-[9px] font-bold text-slate-500 uppercase block tracking-wider">Table Occupancy</span>
                                    <span className="text-sm font-black text-blue-400 mt-1 block">{branchAnalytics.tableOccupancyRate}%</span>
                                  </div>
                                  <div className="bg-slate-900/50 border border-white/5 rounded-xl p-3 text-left">
                                    <span className="text-[9px] font-bold text-slate-500 uppercase block tracking-wider">Active Reservations</span>
                                    <span className="text-sm font-black text-emerald-450 mt-1 block">{branchAnalytics.activeReservations} guests</span>
                                  </div>
                                </div>

                                <div className="bg-slate-900/50 border border-white/5 rounded-xl p-3 text-left space-y-2">
                                  <span className="text-[9px] font-bold text-slate-500 uppercase block tracking-wider">Top Performing Catalog Items</span>
                                  <div className="flex gap-2 flex-wrap">
                                    {branchAnalytics.popularItems.map((item, idx) => (
                                      <div
                                        key={idx}
                                        className="px-2.5 py-1.5 rounded-lg border border-white/5 bg-slate-950/30 text-[10px] text-slate-300 flex items-center gap-1.5 font-sans"
                                      >
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                        <span>{item.name}</span>
                                        <span className="text-slate-500">({item.count})</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* ADD/EDIT BRANCH MODAL SLIDE-OVER */}
      {isBranchModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity" onClick={() => setIsBranchModalOpen(false)} />
          
          <div className="relative z-10 w-full max-w-lg bg-slate-900 border-l border-white/10 p-6 flex flex-col h-full shadow-2xl overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2 font-mono">
                <Building2 size={16} className="text-blue-500" />
                <span>{selectedBranch ? 'Modify Branch Outlet' : 'Add New Branch Outlet'}</span>
              </h3>
              <button onClick={() => setIsBranchModalOpen(false)} className="p-1.5 hover:bg-white/5 text-slate-400 hover:text-white rounded-lg transition cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveBranch} className="space-y-4 pt-4 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Branch Basics */}
                <div className="grid grid-cols-2 gap-3 text-left">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Branch Name *</label>
                    <input
                      type="text"
                      required
                      value={branchName}
                      onChange={(e) => setBranchName(e.target.value)}
                      placeholder="e.g. Indiranagar Outlet"
                      className="w-full px-3.5 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Branch Code</label>
                    <input
                      type="text"
                      value={branchCode}
                      onChange={(e) => setBranchCode(e.target.value)}
                      placeholder="e.g. BLR01"
                      className="w-full px-3.5 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Contact details */}
                <div className="grid grid-cols-2 gap-3 text-left">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Branch Phone</label>
                    <input
                      type="tel"
                      value={branchPhone}
                      onChange={(e) => setBranchPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full px-3.5 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Branch Email</label>
                    <input
                      type="email"
                      value={branchEmail}
                      onChange={(e) => setBranchEmail(e.target.value)}
                      placeholder="e.g. blr01@akresto.com"
                      className="w-full px-3.5 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Physical Location */}
                <div className="space-y-1 text-left">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Street Address</label>
                  <input
                    type="text"
                    value={branchAddress}
                    onChange={(e) => setBranchAddress(e.target.value)}
                    placeholder="e.g. 100 Feet Road, Indiranagar, Bengaluru"
                    className="w-full px-3.5 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Manager Assignment */}
                <div className="bg-slate-950/20 border border-white/5 rounded-xl p-3.5 space-y-3 text-left">
                  <h4 className="text-[9px] font-black uppercase tracking-wider text-blue-450 font-mono">Branch Manager Assignment</h4>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold text-slate-500 uppercase block">Manager Name</label>
                      <input
                        type="text"
                        value={branchManagerName}
                        onChange={(e) => setBranchManagerName(e.target.value)}
                        placeholder="e.g. Rohan Sharma"
                        className="w-full px-3 py-1.5 bg-slate-950/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold text-slate-500 uppercase block">Manager Email</label>
                        <input
                          type="email"
                          value={branchManagerEmail}
                          onChange={(e) => setBranchManagerEmail(e.target.value)}
                          placeholder="e.g. rohan@akresto.com"
                          className="w-full px-3 py-1.5 bg-slate-950/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold text-slate-500 uppercase block">Manager Phone</label>
                        <input
                          type="tel"
                          value={branchManagerPhone}
                          onChange={(e) => setBranchManagerPhone(e.target.value)}
                          placeholder="e.g. +91 99887 76655"
                          className="w-full px-3 py-1.5 bg-slate-950/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Branch Configuration */}
                <div className="grid grid-cols-2 gap-3 text-left">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Operational Status</label>
                    <select
                      value={branchStatus}
                      onChange={(e) => setBranchStatus(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950/60 border border-white/10 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-blue-500"
                    >
                      <option value="ACTIVE" className="bg-slate-900 text-white">ACTIVE</option>
                      <option value="INACTIVE" className="bg-slate-900 text-white">INACTIVE</option>
                      <option value="TEMPORARILY_CLOSED" className="bg-slate-900 text-white">TEMPORARILY CLOSED</option>
                    </select>
                  </div>
                  <div className="flex gap-4 items-center h-full pt-4">
                    <label className="flex items-center gap-2 text-xs text-slate-350 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={branchIsDefault}
                        disabled={selectedBranch?.isDefault}
                        onChange={(e) => setBranchIsDefault(e.target.checked)}
                        className="rounded bg-slate-950 border-white/10 text-blue-500 cursor-pointer"
                      />
                      <span>Set as Default Outlet</span>
                    </label>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Outlet Working Hours</label>
                  <div className="max-h-36 overflow-y-auto border border-white/10 rounded-xl p-2 bg-slate-950/20 space-y-1.5">
                    {Object.keys(branchHours).map((day) => {
                      const dayHours = branchHours[day];
                      return (
                        <div key={day} className="flex items-center justify-between text-[11px] border-b border-white/5 pb-1 gap-2 last:border-none last:pb-0">
                          <span className="capitalize font-bold text-slate-300 w-16">{day}</span>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="time"
                              disabled={dayHours.closed}
                              value={dayHours.open}
                              onChange={(e) => {
                                setBranchHours((prev: any) => ({
                                  ...prev,
                                  [day]: { ...prev[day], open: e.target.value }
                                }));
                              }}
                              className="px-1.5 py-0.5 rounded bg-slate-900 border border-white/10 text-white focus:outline-none disabled:opacity-30"
                            />
                            <span className="text-slate-500">to</span>
                            <input
                              type="time"
                              disabled={dayHours.closed}
                              value={dayHours.close}
                              onChange={(e) => {
                                setBranchHours((prev: any) => ({
                                  ...prev,
                                  [day]: { ...prev[day], close: e.target.value }
                                }));
                              }}
                              className="px-1.5 py-0.5 rounded bg-slate-900 border border-white/10 text-white focus:outline-none disabled:opacity-30"
                            />
                          </div>
                          <label className="flex items-center gap-1 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={dayHours.closed}
                              onChange={(e) => {
                                setBranchHours((prev: any) => ({
                                  ...prev,
                                  [day]: { ...prev[day], closed: e.target.checked }
                                }));
                              }}
                              className="rounded bg-slate-950 border-white/10 text-rose-500 cursor-pointer"
                            />
                            <span className="text-slate-450 font-bold text-[9px] uppercase">Closed</span>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-white/5 mt-6">
                <button
                  type="button"
                  onClick={() => setIsBranchModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-750 text-white text-xs font-black rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-650 hover:bg-blue-600 text-white text-xs font-black rounded-xl transition cursor-pointer"
                >
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
