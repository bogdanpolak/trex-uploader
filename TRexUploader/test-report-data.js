const testReportData = [
    {
        type: "error",
        message: "NDC cannot be empty",
        row: 1,
        column: 5
    },{
        type: "error",
        message: "Purchase cost is not a numeric value",
        row: 3,
        collumn: 8
    },{
        type: "error",
        message: "Volume is not a numeric value",
        row: 4,
        column: 9
    },{
        type: "error",
        message: "Total cost is not a  numeric value",
        row: 5,
        column: 11 
    },{
        type: "warning",
        message: "Possibly invalid NDC format, expected format is 5-4-2",
        row: 4,
        column: 5
    },{
        type: "warning",
        message: "NDC with a suffix",
        row: 7,
        column: 5
    },{
        type: "warning",
        message: "NDC with a prefix",
        row: 8,
        column: 5
    },{
        type: "warning",
        message: "NDC with a prefix",
        row: 9,
        column: 5
    /* Extra data to bump counters */
    },{
        type: "error",
        message: "NDC cannot be empty",
        row: 51,
        column: 5
    },{
        type: "error",
        message: "NDC cannot be empty",
        row: 52,
        column: 5
    },{
        type: "error",
        message: "Volume is not a numeric value",
        row: 52,
        column: 9
    },{
        type: "error",
        message: "Volume is not a numeric value",
        row: 53,
        column: 9
    },{
        type: "error",
        message: "Volume is not a numeric value",
        row: 54,
        column: 9
    },{
        type: "error",
        message: "Volume is not a numeric value",
        row: 54,
        column: 9
    },{
        type: "warning",
        message: "Possibly invalid NDC format, expected format is 5-4-2",
        row: 51,
        column: 5
    },{
        type: "warning",
        message: "Possibly invalid NDC format, expected format is 5-4-2",
        row: 52,
        column: 5
    },{
        type: "warning",
        message: "Possibly invalid NDC format, expected format is 5-4-2",
        row: 53,
        column: 5
    },{
        type: "warning",
        message: "Possibly invalid NDC format, expected format is 5-4-2",
        row: 54,
        column: 5
    },{
        type: "warning",
        message: "Possibly invalid NDC format, expected format is 5-4-2",
        row: 55,
        column: 5
    }
];

