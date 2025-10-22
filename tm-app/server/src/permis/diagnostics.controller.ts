import { Controller, Get } from '@nestjs/common';
import { AccessService } from './access.service';

@Controller('diagnostics')
export class DiagnosticsController {
  constructor(private readonly access: AccessService) {}

  @Get('access')
  async accessDiagnostics() {
    return this.access.diagnostics();
  }
}

