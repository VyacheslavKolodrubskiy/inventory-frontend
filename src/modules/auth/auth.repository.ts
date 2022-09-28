import { http } from '@/shared/network/http';
import { HttpMethod } from '@/shared/enums/common.enum';
import { ResponseParser } from '@/shared/network/response-parser';
import type { LoginDto } from '@/modules/auth/auth.dto';

interface TokenDao {
  token: string
}

export class AuthRepository {
  static async login(data: LoginDto) {
    const response = await http.request({
      method: HttpMethod.POST,
      url: 'auth/login',
      data,
    });

    return ResponseParser.parse<TokenDao>(response);
  }
}
