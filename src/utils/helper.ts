import ExcelJS from 'exceljs';
import { IGenerateExcel } from '../interfaces/IConfig';

const workbook = new ExcelJS.Workbook();

export const generateExcel = async ({ nameExcel, headersExcel, data, res, setData }:IGenerateExcel) => {

    // Creando excel
    const workssheet = workbook.addWorksheet(nameExcel);

    workssheet.columns = headersExcel;

    data.forEach(data => {
        
        workssheet.addRow( setData(data) );
    });

    workssheet.getRow(1).eachCell(cell => {

        cell.font = { bold: true };
    });

    // Exportando el archivo excel-users.xlsx
    const fileName = nameExcel+'.xlsx';

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader("Content-Disposition", "attachment; filename=" + fileName);

    await workbook.xlsx.write(res);

    res.end();
}