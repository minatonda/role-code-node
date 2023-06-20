import { ApiProperty } from "@nestjs/swagger";

export class HistoryModel {

    @ApiProperty()
    _id: string;

    @ApiProperty()
    _idUser: string;

    @ApiProperty()
    type: string;

    @ApiProperty()
    data: any;
    
}