const fs = require('fs');
const moment = require('moment');

function getNomeArquivo() {
    return `local-db-${moment().format('YYYY-MM-DD')}`;
}

function getDiretorioArquivo(nomeArquivo) {
    return `./data/${nomeArquivo}`;
}

function getConteudoArquivo() {
    const pathArquivo = getDiretorioArquivo(getNomeArquivo());
    if (!fs.existsSync(pathArquivo)) {
        fs.writeFileSync(pathArquivo, '');
    }
    return fs.readFileSync(pathArquivo);
}

function getIdsPedidosImpressos() {
    try {
        return JSON.parse(getConteudoArquivo().toString());
    }
    catch (exception) {
        return [];
    }
}

function doSaveIdsPedidosImpressos(ids) {
    const idsOnFile = getIdsPedidosImpressos();
    const idsToSave = [...idsOnFile, ...ids];

    const pathArquivo = getDiretorioArquivo(getNomeArquivo());
    fs.writeFileSync(pathArquivo, JSON.stringify(idsToSave), { encoding: 'utf8' });
}

module.exports = {
    getIdsPedidosImpressos: getIdsPedidosImpressos,
    doSaveIdsPedidosImpressos: doSaveIdsPedidosImpressos
};