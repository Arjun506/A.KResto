import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BpmnCompatService } from './bpmn-compat.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Workflow Foundation — BPMN Compatibility')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bpmn')
export class BpmnCompatController {
  constructor(private readonly service: BpmnCompatService) {}

  @Post('import')
  @ApiOperation({
    summary:
      'Import BPMN 2.0 XML definition and parse into internal workflow schema',
  })
  async importBpmn(@Body() body: { xml: string }) {
    return this.service.importBpmnXml(body.xml);
  }

  @Post('export')
  @ApiOperation({
    summary: 'Export internal workflow definition into BPMN 2.0 XML structure',
  })
  async exportBpmn(@Body() body: { definitionJson: any }) {
    const xml = await this.service.exportBpmnXml(body.definitionJson);
    return { xml };
  }
}
