import XLSX from 'xlsx';

class Excel {
    save(filename, data) {
        var ws = XLSX.utils.aoa_to_sheet(data);
        var nw = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(nw, ws, 'Sheet 1');
        XLSX.writeFile(nw, filename);
    }
}

export default Excel;
