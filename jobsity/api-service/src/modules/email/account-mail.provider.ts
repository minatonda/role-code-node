import { Inject, Injectable } from "@nestjs/common";
import { NodeMailerProvider } from "./base/nodemailer.provider";

@Injectable()
export class AccountMailProvider extends NodeMailerProvider {

    constructor(
        @Inject('HOST') host: string,
        @Inject('PORT') port: number,
        @Inject('USER') user: string,
        @Inject('PASS') pass: string
    ) {
        super(host, port, 'Account Jobsity Tester', user, pass);
    }

    public sendPasswordChangeMail(email: string, password: string) {
        const body = [
            `Dear, you password has been changed`,
            'Follow your new password :',
            password
        ].join('\n');
        return this.send([email], 'Jobsity Test - Password Changed', body)
    }

}