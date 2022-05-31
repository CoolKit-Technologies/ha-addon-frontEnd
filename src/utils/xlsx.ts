import * as xlsx from 'xlsx';
import { WorkBook, JSON2SheetOpts, WritingOptions } from 'xlsx';

export interface JsonToSheet<T = any> {
    data: T[];
    header?: T;
    filename?: string;
    json2sheetOpts?: JSON2SheetOpts;
    write2excelOpts?: WritingOptions;
}

const { utils, writeFile } = xlsx;

const DEF_FILE_NAME = '导出.xlsx';

export default function jsonToSheetXlsx<T = any>({ data, header, filename = DEF_FILE_NAME, json2sheetOpts = {}, write2excelOpts = { bookType: 'xlsx' } }: JsonToSheet<T>) {
    const arrData = [...data];
    if (header) {
        arrData.unshift(header);
        json2sheetOpts.skipHeader = true;
    }

    const worksheet = utils.json_to_sheet(arrData, json2sheetOpts);
    filename = `${filename}.xlsx`;
    const workbook: WorkBook = {
        SheetNames: [filename],
        Sheets: {
            [filename]: worksheet,
        },
    };
    writeFile(workbook, filename, write2excelOpts);
}
