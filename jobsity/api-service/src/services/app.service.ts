import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { HistoryProvider } from "../modules/database/history/history.provider";
import { UserProvider } from "../modules/database/user/user.provider";
import { AuthService } from "../modules/auth/auth.service";
import { AccountMailProvider } from "../modules/email/account-mail.provider";
import { UserModel } from "../modules/database/user/user.model";


@Injectable()
export class AppService {

    constructor(
        private readonly accountMailProvider: AccountMailProvider,
        private readonly userProvider: UserProvider,
        private readonly historyProvider: HistoryProvider,
        private readonly authService: AuthService
    ) {

    }

    public register(user: UserModel): Promise<UserModel> {
        return this.userProvider.register(user);
    }

    public login(user: UserModel): Promise<{ access_token: string }> {
        return this.authService.login(user);
    }

    public history(userId: string) {
        return this.historyProvider.find({ _idUser: userId })
            .then((response) => response.map((r) => r.data));
    }

    public changePassword(email: string) {
        return this.userProvider.changePassword(email)
            .then((response) => this.accountMailProvider.sendPasswordChangeMail(email, response));
    }

    public stats(userId: string) {
        return this.history(userId)
            .then((response) => {
                const val = {};
                response.forEach((r) => {
                    val[r.symbol] = val[r.symbol] || 0;
                    val[r.symbol] += 1;
                });
                return Object.keys(val).map((key) => {
                    return { stock: key.toLowerCase(), times_requested: val[key] };
                });
            });
    }
    
}