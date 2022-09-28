import { Profile } from '../models/profile.model';
import { http } from '@/shared/network/http';
import { HttpMethod } from '@/shared/enums/common.enum';
import { ResponseParser } from '@/shared/network/response-parser';
import type { UserDto } from '@/shared/dto/user.dto';

export class UserRepository {
  static async read() {
    const response = await http.request({
      method: HttpMethod.GET,
      url: 'auth/profile',
    });

    return ResponseParser.parse(response, Profile.fromJson);
  }

  static async update(data: UserDto) {
    const response = await http.request({
      method: HttpMethod.PUT,
      url: 'auth/profile',
      data,
    });

    return ResponseParser.parse(response, Profile.fromJson);
  }
}
