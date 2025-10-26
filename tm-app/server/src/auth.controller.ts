import { Body, Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('login')
  async login(@Body() body: any) {
    const username = String(body?.username || body?.user || '').trim();
    const password = String(body?.password || '').trim();
    // Simple placeholder auth: accept any non-empty username
    if (!username) {
      return { ok: false, error: 'Missing username' };
    }
    // Optionally validate against env
    const envUser = process.env.AUTH_USER;
    const envPass = process.env.AUTH_PASS;
    if (envUser || envPass) {
      if (username !== (envUser || username) || password !== (envPass || password)) {
        return { ok: false, error: 'Invalid credentials' };
      }
    }
    const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
    return { ok: true, token, user: { name: username } };
  }
}

