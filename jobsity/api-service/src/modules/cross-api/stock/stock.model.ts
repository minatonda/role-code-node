import { ApiProperty } from "@nestjs/swagger";

export class StockModel {
    @ApiProperty()
    symbol: string;

    @ApiProperty()
    date:string;

    @ApiProperty()
    open: string;

    @ApiProperty()
    high: string;

    @ApiProperty()
    low: string;

    @ApiProperty()
    close: string;

    @ApiProperty()
    volume: string;

    @ApiProperty()
    name: string;
    
}