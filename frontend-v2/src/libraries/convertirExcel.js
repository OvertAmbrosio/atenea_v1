import * as XLSX from 'xlsx';

export default async function convertirExcel(excel){
  return new Promise(
    function(resolve, reject) {
      try {
        const reader = new FileReader();
        const rABS = !!reader.readAsBinaryString;

        reader.onload = (event) => {
          let bstr = event.target.result;
          const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA : true });
          /* Get first worksheet */
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          /* Convert array of arrays */
          const data = XLSX.utils.sheet_to_json(ws);

          let a = [];

          data.map((objeto) => {
            return a.push(
              Object.keys(objeto).reduce((c, k) => (
                // eslint-disable-next-line
                c[k.trim().toLowerCase()] = objeto[k], c
              ), {})
            );
          });
          return resolve(a);                   
        }

        if (rABS) {
          reader.readAsBinaryString(excel);
        } else {
          reader.readAsArrayBuffer(excel);
        }

      } catch (error) {
        return reject(error)
      }
    }
  );
}