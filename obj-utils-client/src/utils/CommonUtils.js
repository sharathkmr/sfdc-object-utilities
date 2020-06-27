/**
 * Utility method to convert the list of records 
 * to CSV format
 * @param {Array} recs 
 * @param {Map} headersMap 
 */
export let convertToCSV = (recs, headersMap) => {
    var csvRes, counter, keys;
    var colDivider = ',';
    var lineDivider = '\n';

    if (recs == null || !recs.length) {
        return null;
    }
    keys = Array.from(headersMap.keys());
    
    csvRes = '';
    csvRes += keys.join(colDivider);
    csvRes += lineDivider;

    for (var i = 0; i < recs.length; i++) {
        counter = 0;

        for (var tempKey of keys) {
            let skey = headersMap.get(tempKey);
            
            if (counter > 0) {
                csvRes += colDivider;
            }
            
            let fieldValue;

            if(skey.includes('.') > 0) {
                let fields = skey.split('.');
                let obj = recs[i][fields[0]]
                
                if(obj) {
                    fieldValue = obj[fields[1]];
                } else  {
                    fieldValue = null;
                }
            } else {
                fieldValue = recs[i][skey];
            }
            
            // Exclude if the [ROW][COL] is a object
            if (typeof fieldValue == 'object' || fieldValue === undefined || fieldValue === null) {
                csvRes += '""';
            } else {
                csvRes += '"' + fieldValue + '"';
            }
            counter++;
        }
        csvRes += lineDivider;
    }
    return csvRes;
}

/**
 * Utility method to download the csv file
 * @param {String} csvName 
 * @param {String} csv 
 */
export let dowloadDocument = (csvName, csv) => {
    // create a DOM element to download the csv content
    var csvElement = document.createElement('a');
    var universalBOM = "\uFEFF"; // Universal BOM (Byte Order Mark)
    csvElement.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(universalBOM+csv);
    csvElement.target = '_self';
    let todayDate = new Date();
    let csvDate = (todayDate.getMonth()+1)+'-'+todayDate.getDate()+'-'+todayDate.getFullYear();
    csvElement.download = csvName+'_'+csvDate+'.csv';
    document.body.appendChild(csvElement);
    csvElement.click();
}