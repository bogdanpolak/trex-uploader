const validaton = {
    OK: 'ok',
    WARNING: 'warning',
    ERROR: 'error'
}

const ok = () =>  ({result: validaton.OK});
const error = (msg) => ({result: validaton.ERROR, message: msg});

function ndcValidator (ndc) {
    if (ndc==='')
        return error('NDC is empty')
    if (Number.isInteger(ndc)) {
        const ndcValue = parseInt(ndc);
        if (ndcValue===0) 
            return error('NDC is equal to 0');
        if (ndcValue<0) 
            return error('NDC has negative value');
        if (ndcValue.toString().length>11) 
            return error('NDC has more then 11 digits');
        return ok();
    }
    return ok();
}

module.exports = {validaton, ndcValidator};