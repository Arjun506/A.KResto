import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomerLookupService {
  getIdentityTypes() {
    return [
      { code: 'GUEST', label: 'Guest Customer' },
      { code: 'REGISTERED', label: 'Registered Customer' },
      { code: 'LINKED_USER', label: 'Linked User Account' },
      { code: 'ANONYMOUS', label: 'Anonymous Customer' },
      { code: 'BUSINESS', label: 'Business Customer' },
      { code: 'ORGANIZATION', label: 'Organization Customer' },
    ];
  }

  getLifecycleStages() {
    return [
      { code: 'PROSPECT', label: 'Prospect' },
      { code: 'LEAD', label: 'Lead' },
      { code: 'REGISTERED', label: 'Registered' },
      { code: 'VERIFIED', label: 'Verified' },
      { code: 'ACTIVE', label: 'Active' },
      { code: 'INACTIVE', label: 'Inactive' },
      { code: 'SUSPENDED', label: 'Suspended' },
      { code: 'ARCHIVED', label: 'Archived' },
      { code: 'DELETED', label: 'Deleted' },
    ];
  }

  getConsentTypes() {
    return [
      { code: 'MARKETING', label: 'Marketing Communications' },
      { code: 'PRIVACY', label: 'Privacy Policy Agreement' },
      { code: 'DATA_SHARING', label: 'Data Sharing Consent' },
      { code: 'COOKIE', label: 'Cookie Preferences' },
      { code: 'TERMS', label: 'Terms of Service Acceptance' },
    ];
  }

  getContactTypes() {
    return [
      { code: 'PRIMARY_EMAIL', label: 'Primary Email Address' },
      { code: 'SECONDARY_EMAIL', label: 'Secondary Email Address' },
      { code: 'MOBILE_PHONE', label: 'Mobile Phone Number' },
      { code: 'WORK_PHONE', label: 'Work Phone Number' },
      { code: 'ALTERNATE', label: 'Alternate Contact' },
    ];
  }

  getAddressTypes() {
    return [
      { code: 'HOME', label: 'Home Address' },
      { code: 'WORK', label: 'Work Address' },
      { code: 'BILLING', label: 'Billing Address' },
      { code: 'SHIPPING', label: 'Shipping Address' },
      { code: 'LOCATION', label: 'Physical Location' },
    ];
  }
}
