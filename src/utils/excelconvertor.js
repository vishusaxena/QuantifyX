import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportTableToExcel = (tableId, fileName = "table.xlsx") => {
  const table = document.getElementById(tableId);
  const workbook = XLSX.utils.table_to_book(table);
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(data, fileName);
};
