const validaton = {
    OK: 'ok',
    WARNING: 'warning',
    ERROR: 'error'
}

const ok = () =>  ({result: validaton.OK});
const error = (msg) => ({result: validaton.ERROR, message: msg});
const warning = (msg) => ({result: validaton.WARNING, message: msg});

const onlyDigitsWithSign = (value) => /^-*\d+$/.test(value);

function ndcValidator (ndc) {
    if (ndc===null || ndc==='')
        return error('NDC is empty')
    const ndcValue = parseInt(ndc);
    if (onlyDigitsWithSign(ndc) && !isNaN(ndcValue)){
        if (ndcValue===0) 
            return error('NDC is equal to 0');
        if (ndcValue<0) 
            return error('NDC has negative value');
        if (ndcValue.toString().length>11) 
            return error('NDC has more then 11 digits');
        return ok();
    }
    if (ndc.includes('-')) {
        const regex_prefixed_ndc542 = /[a-z]+\d{5}-\d{4}-\d{2}\b/;
        if (ndc.match(regex_prefixed_ndc542)) {
            return warning('NDC with a prefix');
        }
        const regex_sufixed_ndc542 = /\b\d{5}-\d{4}-\d{2}[a-z]+/;
        if (ndc.match(regex_sufixed_ndc542)) {
            return warning('NDC with a sufix');
        }
        const regex_prefixword_ndc542 = /\w+ \d{5}-\d{4}-\d{2}\b/;
        if (ndc.match(regex_prefixword_ndc542)) {
            return error('NDC prefix is a separate word');
        }
        const regex_ndc542_sufixword = /\b\d{5}-\d{4}-\d{2} \w+/;
        if (ndc.match(regex_ndc542_sufixword )!==null) {
            return error('NDC sufix is a separate word');
        }
        const regex_ndc542 = /\b\d{5}-\d{4}-\d{2}\b/;
        if (ndc.match(regex_ndc542)) {
            return ok();
        } else {
            return error('Invalid NDC format, expected: 5-4-2');
        }
    }
    const regex_ndcNumber_withPrefix = /[a-z]+\d{1,11}\b/;
    if (ndc.match(regex_ndcNumber_withPrefix)) {
        return warning('NDC with a prefix');
    }
    const regex_ndcNumber_withSufix = /\b\d{1,11}[a-z]+/;
    if (ndc.match(regex_ndcNumber_withSufix)) {
        return warning('NDC with a sufix');
    }
    return error('No valid NDC value');
}

module.exports = {validaton, ndcValidator};