import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// Controllers
import { CustomerRegistryController } from './registry/customer-registry.controller';
import { CustomerProfileController } from './profile/customer-profile.controller';
import { CustomerConsentController } from './consent/customer-consent.controller';
import { CustomerLoyaltyController } from './loyalty/customer-loyalty.controller';
import { CustomerContactsController } from './contacts/customer-contacts.controller';
import { CustomerAddressesController } from './addresses/customer-addresses.controller';
import { CustomerRelationshipsController } from './relationships/customer-relationships.controller';
import { CustomerGroupsController } from './groups/customer-groups.controller';
import { CustomerTagsController } from './tags/customer-tags.controller';
import { CustomerAttachmentsController } from './attachments/customer-attachments.controller';
import { CustomerNotesController } from './notes/customer-notes.controller';
import { CustomerPreferencesController } from './preferences/customer-preferences.controller';
import { CustomerVerificationController } from './verification/customer-verification.controller';
import { CustomerLookupController } from './lookups/customer-lookup.controller';

// Services & Repositories
import { CustomerRegistryService } from './registry/customer-registry.service';
import { CustomerRegistryRepository } from './registry/customer-registry.repository';
import { CustomerProfileService } from './profile/customer-profile.service';
import { CustomerConsentService } from './consent/customer-consent.service';
import { CustomerLoyaltyService } from './loyalty/customer-loyalty.service';
import { CustomerContactsService } from './contacts/customer-contacts.service';
import { CustomerAddressesService } from './addresses/customer-addresses.service';
import { CustomerRelationshipsService } from './relationships/customer-relationships.service';
import { CustomerGroupsService } from './groups/customer-groups.service';
import { CustomerTagsService } from './tags/customer-tags.service';
import { CustomerAttachmentsService } from './attachments/customer-attachments.service';
import { CustomerNotesService } from './notes/customer-notes.service';
import { CustomerPreferencesService } from './preferences/customer-preferences.service';
import { CustomerVerificationService } from './verification/customer-verification.service';
import { CustomerLookupService } from './lookups/customer-lookup.service';

@Module({
  controllers: [
    CustomerRegistryController,
    CustomerProfileController,
    CustomerConsentController,
    CustomerLoyaltyController,
    CustomerContactsController,
    CustomerAddressesController,
    CustomerRelationshipsController,
    CustomerGroupsController,
    CustomerTagsController,
    CustomerAttachmentsController,
    CustomerNotesController,
    CustomerPreferencesController,
    CustomerVerificationController,
    CustomerLookupController,
  ],
  providers: [
    CustomerRegistryService,
    CustomerRegistryRepository,
    CustomerProfileService,
    CustomerConsentService,
    CustomerLoyaltyService,
    CustomerContactsService,
    CustomerAddressesService,
    CustomerRelationshipsService,
    CustomerGroupsService,
    CustomerTagsService,
    CustomerAttachmentsService,
    CustomerNotesService,
    CustomerPreferencesService,
    CustomerVerificationService,
    CustomerLookupService,
  ],
  exports: [
    CustomerRegistryService,
    CustomerProfileService,
    CustomerConsentService,
    CustomerLoyaltyService,
    CustomerContactsService,
    CustomerAddressesService,
    CustomerRelationshipsService,
    CustomerGroupsService,
    CustomerTagsService,
    CustomerAttachmentsService,
    CustomerNotesService,
    CustomerPreferencesService,
    CustomerVerificationService,
    CustomerLookupService,
  ],
})
export class CustomerFoundationModule {}
