import { Inject, Injectable } from "@nestjs/common";
import { NeDbProvider } from "../base/ne-db.provider";
import { HistoryModel } from "./history.model";

@Injectable()
export class HistoryProvider extends NeDbProvider<HistoryModel> {

    constructor(
        @Inject('PATH') path: string
    ) {
        path ? super([path, 'histories.nedb'].join('/')) : super(undefined);
    }

}