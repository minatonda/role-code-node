import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from '../database/user/user.model';
import { UserProvider } from '../database/user/user.provider';


@Injectable()
export class AuthService {
    constructor(
        private usersService: UserProvider,
        private jwtService: JwtService
    ) { }

    async validateUser(username: string, password: string): Promise<Partial<UserModel>> {
        const user = await this.usersService.find({ email: username }).then((response) => response[0]);
        if (user && user.password === password) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: Partial<UserModel>) {
        // this.usersService.all().then((response)=>console.log(response));
        const data = await this.usersService.find({ email: user.email }).then((response) => {
            // console.log(user);
            // console.log(response);
            return response[0];
        });
        const payload = { username: data.email, sub: data._id, role: data.role };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}