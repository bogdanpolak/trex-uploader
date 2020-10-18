// -------------------------------------------------------
// exported:
// unction detectMappings(data)
// -------------------------------------------------------
// data = {
//    0: [,ABC #,Product Description', 'NDC,Average Invoice Price', 'Shipped Qty', 'Report Qty', 'Total Ext Cost', 'Account Type'],
//    1: [10148276, 'KEYTRUDA 100MG/4ML SDV SOL ASD', null, 3373.63, 38, 0.77, 128197.94, '340B']
// }

function detectMappings(data) {
    if (!data || data.length==0)
        return null;
    let mappings = new Map();
    mappings['Product Description'] =   {no: 1, name:'Description'};
    mappings['NDC'] =                   {no: 2, name:'NDC'};
    mappings['Average Invoice Price'] = {no: 3, name:'Purchase Cost'};
    mappings['Shipped Qty'] =           {no: 4, name:'Volume'};
    mappings['Total Ext Cost'] =        {no: 5, name:'Total Cost'};
    mappings['Account Type'] =          {no: 6, name:'Account Type'};
    return mappings;
}

module.exports = {detectMappings};