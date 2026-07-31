import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// Controllers
import { BusinessRegistryController } from './registry/business-registry.controller';
import { BusinessOwnershipController } from './ownership/business-ownership.controller';
import { BusinessRelationshipsController } from './relationships/business-relationships.controller';
import { BusinessSettingsController } from './settings/business-settings.controller';
import { BusinessProfileController } from './profile/business-profile.controller';
import { BusinessContactsController } from './contacts/business-contacts.controller';
import { BusinessAddressesController } from './addresses/business-addresses.controller';
import { BusinessAttachmentsController } from './attachments/business-attachments.controller';
import { BusinessNotesController } from './notes/business-notes.controller';
import { LookupController } from './lookups/lookup.controller';

// Services & Repositories
import { BusinessRegistryService } from './registry/business-registry.service';
import { BusinessRegistryRepository } from './registry/business-registry.repository';

import { BusinessOwnershipService } from './ownership/business-ownership.service';
import { BusinessOwnershipRepository } from './ownership/business-ownership.repository';

import { BusinessRelationshipsService } from './relationships/business-relationships.service';
import { BusinessRelationshipsRepository } from './relationships/business-relationships.repository';

import { BusinessSettingsService } from './settings/business-settings.service';
import { BusinessSettingsRepository } from './settings/business-settings.repository';

import { BusinessProfileService } from './profile/business-profile.service';
import { BusinessContactsService } from './contacts/business-contacts.service';
import { BusinessAddressesService } from './addresses/business-addresses.service';
import { BusinessAttachmentsService } from './attachments/business-attachments.service';
import { BusinessNotesService } from './notes/business-notes.service';
import { LookupService } from './lookups/lookup.service';

@Module({
  controllers: [
    BusinessRegistryController,
    BusinessOwnershipController,
    BusinessRelationshipsController,
    BusinessSettingsController,
    BusinessProfileController,
    BusinessContactsController,
    BusinessAddressesController,
    BusinessAttachmentsController,
    BusinessNotesController,
    LookupController,
  ],
  providers: [
    BusinessRegistryService,
    BusinessRegistryRepository,
    BusinessOwnershipService,
    BusinessOwnershipRepository,
    BusinessRelationshipsService,
    BusinessRelationshipsRepository,
    BusinessSettingsService,
    BusinessSettingsRepository,
    BusinessProfileService,
    BusinessContactsService,
    BusinessAddressesService,
    BusinessAttachmentsService,
    BusinessNotesService,
    LookupService,
  ],
  exports: [
    BusinessRegistryService,
    BusinessOwnershipService,
    BusinessRelationshipsService,
    BusinessSettingsService,
    BusinessProfileService,
    BusinessContactsService,
    BusinessAddressesService,
    BusinessAttachmentsService,
    BusinessNotesService,
    LookupService,
  ],
})
export class BusinessFoundationModule {}
