import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LookupService {
  constructor(private readonly prisma: PrismaService) {}

  getBusinessCategories() {
    return [
      { code: 'RESTAURANT', name: 'Restaurant & Dining' },
      { code: 'RETAIL', name: 'Retail Store' },
      { code: 'HOSPITAL', name: 'Hospital & Healthcare' },
      { code: 'WAREHOUSE', name: 'Warehouse & Logistics' },
      { code: 'SALON', name: 'Beauty & Salon' },
      { code: 'EDUCATION', name: 'Education & Training' },
      { code: 'MANUFACTURING', name: 'Manufacturing & Industrial' },
      { code: 'PHARMACY', name: 'Pharmacy & Medical Supplies' },
      { code: 'HOTEL', name: 'Hotel & Hospitality' },
    ];
  }

  getCurrencies() {
    return [
      { code: 'USD', name: 'US Dollar', symbol: '$' },
      { code: 'EUR', name: 'Euro', symbol: '€' },
      { code: 'GBP', name: 'British Pound', symbol: '£' },
      { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$' },
      { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
      { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
      { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    ];
  }

  getTimezones() {
    return [
      { name: 'UTC', label: 'Coordinated Universal Time (UTC)' },
      { name: 'America/New_York', label: 'Eastern Time (US & Canada)' },
      { name: 'America/Chicago', label: 'Central Time (US & Canada)' },
      { name: 'America/Denver', label: 'Mountain Time (US & Canada)' },
      { name: 'America/Los_Angeles', label: 'Pacific Time (US & Canada)' },
      { name: 'Europe/London', label: 'London, Edinburgh (GMT/BST)' },
      { name: 'Europe/Paris', label: 'Paris, Berlin, Rome (CET/CEST)' },
      { name: 'Asia/Tokyo', label: 'Tokyo, Osaka (JST)' },
    ];
  }

  getLanguages() {
    return [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Spanish' },
      { code: 'fr', name: 'French' },
      { code: 'de', name: 'German' },
      { code: 'ja', name: 'Japanese' },
      { code: 'zh', name: 'Chinese' },
    ];
  }

  getCountries() {
    return [
      { code: 'US', name: 'United States' },
      { code: 'CA', name: 'Canada' },
      { code: 'GB', name: 'United Kingdom' },
      { code: 'DE', name: 'Germany' },
      { code: 'FR', name: 'France' },
      { code: 'JP', name: 'Japan' },
      { code: 'AU', name: 'Australia' },
      { code: 'IN', name: 'India' },
    ];
  }
}
