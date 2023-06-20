import { ApiProperty } from "@nestjs/swagger";

export class UserModel {
    _id: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    password: string;

    @ApiProperty()
    role: string;
}