import { Inject, Injectable } from "@nestjs/common";
import { NeDbProvider } from "../base/ne-db.provider";
import { UserModel } from "./user.model";
import * as  crypto from "crypto";

@Injectable()
export class UserProvider extends NeDbProvider<UserModel> {

    constructor(
        @Inject('PATH') path: string
    ) {
        path ? super([path, 'users.nedb'].join('/')) : super(undefined);
    }

    public register(model: Partial<UserModel>) {
        const password = crypto.randomUUID();
        return this.insert({ ...model, password: password } as UserModel);
    }

    public changePassword(email: string) {
        return this.find({ email }).then((response) => {
            const password = crypto.randomUUID();
            return this.update(response[0]._id, { ...response[0], password } as UserModel)
                .then(() => password);
        });
    }

}