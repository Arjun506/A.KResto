'use client';

import { useEffect, useState } from 'react';
import {
  ShoppingBag,
  Search,
  CheckCircle,
  AlertCircle,
  Settings2,
  Trash2,
  Play,
  Pause,
  ArrowUpCircle,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Info,
  Loader2,
  X,
  Sparkles
} from 'lucide-react';
import {
  getModulesCatalog,
  getInstalledModules,
  installModule,
  uninstallModule,
  enableModule,
  disableModule,
  updateModule,
  ModuleDefinition,
  InstalledModuleState
} from '@/services/app-store.service';
import { getBusinessSettings } from '@/services/business.service';

export default function AppStorePage() {
  const [catalog, setCatalog] = useState<ModuleDefinition[]>([]);
  const [installedStates, setInstalledStates] = useState<InstalledModuleState[]>([]);
  const [planTier, setPlanTier] = useState<string>('TRIAL');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Config modal state
  const [configuringModule, setConfiguringModule] = useState<ModuleDefinition | null>(null);
  const [configJson, setConfigJson] = useState<string>('');
  const [configError, setConfigError] = useState<string | null>(null);
  const [configSaving, setConfigSaving] = useState(false);

  // Load catalog and installation states
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const settings = await getBusinessSettings();
      const currentPlan = settings?.planTier || 'TRIAL';
      setPlanTier(currentPlan);

      const tenantId = settings?.id || 't1';
      const [allModules, activeStates] = await Promise.all([
        getModulesCatalog(),
        getInstalledModules(tenantId)
      ]);

      setCatalog(allModules);
      setInstalledStates(activeStates);
    } catch (err: any) {
      setError(err?.message || 'Failed to load App Store catalog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const getModuleState = (moduleId: string) => {
    return installedStates.find((state) => state.moduleId === moduleId);
  };

  const handleInstall = async (moduleId: string) => {
    setError(null);
    try {
      const settings = await getBusinessSettings();
      const tenantId = settings?.id || 't1';
      await installModule(moduleId, tenantId);
      await loadData();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to install module.');
    }
  };

  const handleUninstall = async (moduleId: string) => {
    setError(null);
    try {
      const settings = await getBusinessSettings();
      const tenantId = settings?.id || 't1';
      await uninstallModule(moduleId, tenantId);
      await loadData();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to uninstall module.');
    }
  };

  const handleToggleEnable = async (moduleId: string, isEnabled: boolean) => {
    setError(null);
    try {
      const settings = await getBusinessSettings();
      const tenantId = settings?.id || 't1';
      if (isEnabled) {
        await disableModule(moduleId, tenantId);
      } else {
        await enableModule(moduleId, tenantId);
      }
      await loadData();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to toggle module state.');
    }
  };

  const handleUpdate = async (moduleId: string, targetVersion: string) => {
    setError(null);
    try {
      const settings = await getBusinessSettings();
      const tenantId = settings?.id || 't1';
      await updateModule(moduleId, tenantId, targetVersion);
      await loadData();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to update module.');
    }
  };

  const openConfigModal = (moduleDef: ModuleDefinition, currentState: InstalledModuleState) => {
    setConfiguringModule(moduleDef);
    setConfigError(null);
    // Format configuration JSON for editing
    const currentConfig = currentState.config?.moduleConfig || moduleDef.settings || {};
    setConfigJson(JSON.stringify(currentConfig, null, 2));
  };

  const saveConfig = async () => {
    if (!configuringModule) return;
    setConfigError(null);
    setConfigSaving(true);
    try {
      let parsedConfig = {};
      try {
        parsedConfig = JSON.parse(configJson);
      } catch {
        throw new Error('Invalid JSON format. Please check syntax.');
      }

      const settings = await getBusinessSettings();
      const tenantId = settings?.id || 't1';
      const state = getModuleState(configuringModule.moduleId);
      const version = state?.version || configuringModule.version;

      await updateModule(configuringModule.moduleId, tenantId, version, parsedConfig);
      await loadData();
      setConfiguringModule(null);
    } catch (err: any) {
      setConfigError(err?.message || 'Failed to save configuration.');
    } finally {
      setConfigSaving(false);
    }
  };

  // Plan weights to check compatibility locally for UI indicators
  const tierWeights: Record<string, number> = {
    TRIAL: 0,
    STARTER: 1,
    PROFESSIONAL: 2,
    ENTERPRISE: 3
  };

  const isCompatible = (moduleDef: ModuleDefinition) => {
    const currentWeight = tierWeights[planTier] ?? 0;
    const requirements = moduleDef.subscriptionRequirements ?? [];
    for (const req of requirements) {
      if (req.required) {
        const requiredWeight = tierWeights[req.planTier] ?? 0;
        if (currentWeight < requiredWeight) return false;
      }
    }
    return true;
  };

  const getRequiredPlan = (moduleDef: ModuleDefinition) => {
    const requirements = moduleDef.subscriptionRequirements ?? [];
    const activeReq = requirements.find((r) => r.required);
    return activeReq ? activeReq.planTier : 'TRIAL';
  };

  const categories = ['All', 'Core', 'POS', 'Operations', 'CRM', 'Themes', 'Industry Packs', 'AI Agents'];

  const filteredCatalog = catalog.filter((moduleDef) => {
    const matchesSearch =
      moduleDef.moduleName.toLowerCase().includes(search.toLowerCase()) ||
      moduleDef.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' ||
      moduleDef.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 text-left max-w-6xl mx-auto select-none">
      
      {/* App Store Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 border border-indigo-100/20">
              <ShoppingBag className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-full">
              AK Ecosystem
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-850 dark:text-slate-100 tracking-tight">
            AK Business App Store
          </h1>
          <p className="text-xs text-slate-450 leading-relaxed max-w-xl">
            Configure system modules, install third-party plugins, switch custom styles, and toggle workspace workflows to customize your business environment.
          </p>
        </div>

        {/* Current Plan Card */}
        <div className="p-3.5 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/10 border border-indigo-150/25 rounded-2xl flex items-center gap-4">
          <div>
            <p className="text-[9px] font-black text-indigo-600 uppercase tracking-wider">Active Workspace tier</p>
            <h4 className="text-sm font-black text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1.5">
              👑 {planTier} Plan
            </h4>
          </div>
          <a
            href="/dashboard/billing"
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black rounded-lg transition active:scale-95 shadow-sm"
          >
            Upgrade Tier
          </a>
        </div>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex gap-3 text-rose-700 text-xs font-semibold animate-cc-panel-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
          <p className="flex-1">{error}</p>
          <button onClick={() => setError(null)} className="text-rose-400 hover:text-rose-600">
            <X size={15} />
          </button>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-850/40 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-[#11131c] border border-slate-200 dark:border-slate-800 rounded-xl w-full md:max-w-xs shadow-sm">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search catalog modules..."
            className="flex-1 bg-transparent border-0 outline-none text-xs text-slate-750 dark:text-slate-200 placeholder-slate-400 focus:ring-0 p-0"
          />
        </div>
      </div>

      {/* Main Grid Catalog */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center text-slate-450 gap-2 text-xs">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="font-bold">Syncing module catalog database...</p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredCatalog.length === 0 ? (
            <div className="col-span-full py-16 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-[#11131c]/50">
              <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-450">No modules match your filters.</p>
            </div>
          ) : (
            filteredCatalog.map((moduleDef) => {
              const state = getModuleState(moduleDef.moduleId);
              const isInstalled = !!state;
              const isEnabled = state?.isEnabled ?? false;
              const compatible = isCompatible(moduleDef);
              const requiredPlan = getRequiredPlan(moduleDef);
              
              // Check if update is available (registry version is newer than installed version)
              const hasUpdate = isInstalled && state.version !== 'unknown' && state.version !== moduleDef.version;

              return (
                <div
                  key={moduleDef.moduleId}
                  className={`bg-white dark:bg-[#11131c] border rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 relative ${
                    isInstalled ? 'border-indigo-150/40 dark:border-indigo-950/20 shadow-indigo-50/10' : 'border-slate-200/60 dark:border-slate-800/40'
                  }`}
                >
                  
                  {/* Category and Badges */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[8px] font-black uppercase tracking-wider text-slate-450 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {moduleDef.category}
                    </span>

                    <div className="flex items-center gap-1">
                      {hasUpdate && (
                        <span className="text-[8px] font-black uppercase text-amber-600 bg-amber-50 dark:bg-amber-950/40 border border-amber-100/30 px-1.5 py-0.5 rounded flex items-center gap-0.5 animate-pulse">
                          Update Available
                        </span>
                      )}
                      {!compatible && (
                        <span className="text-[8px] font-black uppercase text-rose-500 bg-rose-50 dark:bg-rose-950/40 border border-rose-100/30 px-1.5 py-0.5 rounded">
                          Requires {requiredPlan}
                        </span>
                      )}
                      {isInstalled && (
                        <span className="text-[8px] font-black uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100/30 px-1.5 py-0.5 rounded">
                          Installed
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title and Description */}
                  <div className="space-y-1.5 text-left flex-1">
                    <h3 className="text-sm font-black text-slate-850 dark:text-slate-100 flex items-center gap-1.5">
                      {moduleDef.moduleName}
                    </h3>
                    <p className="text-[11px] text-slate-450 leading-relaxed line-clamp-3">
                      {moduleDef.description}
                    </p>
                  </div>

                  {/* Info Metadata */}
                  <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-850/30 flex items-center justify-between text-[10px] text-slate-400 font-bold">
                    <span>License: {moduleDef.licenseStatus}</span>
                    <span>v{moduleDef.version}</span>
                  </div>

                  {/* Controls / Buttons */}
                  <div className="mt-4 flex items-center gap-2">
                    
                    {!isInstalled ? (
                      <button
                        onClick={() => handleInstall(moduleDef.moduleId)}
                        disabled={!compatible}
                        className={`flex-1 py-1.5 text-center text-[10px] font-black rounded-lg transition active:scale-97 cursor-pointer ${
                          compatible
                            ? 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-50'
                            : 'bg-slate-100 dark:bg-slate-800/40 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        Install Module
                      </button>
                    ) : (
                      <>
                        {/* Enable/Disable Toggle */}
                        <button
                          onClick={() => handleToggleEnable(moduleDef.moduleId, isEnabled)}
                          className={`px-3 py-1.5 border rounded-lg text-[10px] font-black flex items-center gap-1 transition active:scale-95 cursor-pointer ${
                            isEnabled
                              ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-150'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-500 border-slate-200'
                          }`}
                          title={isEnabled ? 'Disable Module' : 'Enable Module'}
                        >
                          {isEnabled ? <Play size={11} className="fill-current" /> : <Pause size={11} />}
                          <span>{isEnabled ? 'Active' : 'Inactive'}</span>
                        </button>

                        {/* Configure (if enabled) */}
                        <button
                          onClick={() => openConfigModal(moduleDef, state)}
                          disabled={!isEnabled}
                          className={`flex-1 py-1.5 border rounded-lg text-[10px] font-black flex items-center justify-center gap-1 transition active:scale-95 ${
                            isEnabled
                              ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 cursor-pointer'
                              : 'bg-slate-105/30 text-slate-350 border-slate-100 cursor-not-allowed'
                          }`}
                        >
                          <Settings2 size={11} />
                          Configure
                        </button>

                        {/* Update available trigger */}
                        {hasUpdate && (
                          <button
                            onClick={() => handleUpdate(moduleDef.moduleId, moduleDef.version)}
                            className="p-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition active:scale-95 cursor-pointer"
                            title="Upgrade module version"
                          >
                            <ArrowUpCircle size={13} />
                          </button>
                        )}

                        {/* Uninstall */}
                        <button
                          onClick={() => handleUninstall(moduleDef.moduleId)}
                          className="p-1.5 border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 rounded-lg text-slate-400 transition active:scale-95 cursor-pointer"
                          title="Uninstall Module"
                        >
                          <Trash2 size={12} />
                        </button>
                      </>
                    )}

                  </div>

                </div>
              );
            })
          )}
        </div>
      )}

      {/* Module Configuration Modal Drawer */}
      {configuringModule && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/25 backdrop-blur-xs select-none">
          <div className="w-full max-w-md bg-white dark:bg-[#11131c] border border-slate-200/50 dark:border-slate-800/40 rounded-3xl shadow-2xl p-6 glass relative animate-cc-panel-in">
            
            {/* Close */}
            <button
              onClick={() => setConfiguringModule(null)}
              className="absolute top-4 right-4 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-650 transition"
            >
              <X size={16} />
            </button>

            {/* Header */}
            <div className="space-y-1 text-left mb-4">
              <span className="text-[9px] font-black text-indigo-650 uppercase bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                Configuration
              </span>
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-100">
                {configuringModule.moduleName} Settings
              </h3>
              <p className="text-[10px] text-slate-400">Modify active module parameter overrides in JSON format.</p>
            </div>

            {/* Config Input JSON block */}
            <div className="space-y-3">
              <textarea
                value={configJson}
                onChange={(e) => setConfigJson(e.target.value)}
                rows={8}
                className="w-full p-3 font-mono text-[10px] bg-slate-950 text-emerald-400 rounded-2xl border-0 focus:ring-1 focus:ring-emerald-500/25 leading-normal"
                spellCheck={false}
              />

              {configError && (
                <div className="p-2 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-[10px] font-bold text-left flex gap-1 items-center">
                  <AlertCircle size={12} />
                  <span>{configError}</span>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-850/30">
                <button
                  onClick={() => setConfiguringModule(null)}
                  className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-500 text-[10px] font-black rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={saveConfig}
                  disabled={configSaving}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black rounded-lg transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  {configSaving && <Loader2 size={11} className="animate-spin" />}
                  <span>Save Config</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
