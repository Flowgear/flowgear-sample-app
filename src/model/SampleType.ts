export type SampleType =
{
    Id: number;
    Description: string;
    Status: string;
    OrderNumber: string;
    OrderDate: string;
    OrderTotal: number;
    [key: string]: string | number; // Index signature
};