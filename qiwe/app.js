const impressora = require('./src/impressora');
const qiweDbApi = require('./src/qiwe-db-api');
const localDbApi = require('./src/local-db-api');
const mysql = require('mysql');
const moment = require('moment');

var con = mysql.createConnection({
  host: 'mysql.qiwe.com.br',
  port: '3306',
  user: 'qiwe_add1',
  password: 'qiwe_add3',
  database: 'qiwe'
});

con.connect((err) => {

  function doPreparePrint() {
    try {
      // const buffer = impressora.buildPreparedPrintBuffer("");
      // impressora.doPrintBuffer(buffer);
    } catch (exception) {
      console.log([
        "Falha na Conexão com a Impressora",
        "Por favor, verifique se a mesma está ligada e conectada corretamente a máquina."
      ].join("\n"));
      throw exception;
    }
  }

  function doPrintCozinha(row) {
    try {
      const template = impressora.buildPrintTemplateCozinha(row[0], row[1], row[2], row[3]);
      console.log(template);
      console.log("\n");
      // const buffer = impressora.buildPreparedPrintBuffer(template);
      // impressora.doPrintBuffer(buffer);
    } catch (exception) {
      console.log([
        "Falha na Conexão com a Impressora",
        "Por favor, verifique se a mesma está ligada e conectada corretamente a máquina."
      ].join("\n"));
      throw exception;
    }
  }

  function doRunImpressao() {
    return qiweDbApi.doBuscaPedidos(localDbApi.getIdsPedidosImpressos(), moment().toDate(), con)
      .then((rows_pedido) => {
        const promises = rows_pedido.map((row_pedido) => Promise.all([
          Promise.resolve(row_pedido),
          qiweDbApi.doBuscaItemsPedidos(row_pedido.order_id, con),
          qiweDbApi.doBuscaUsuario(row_pedido.user_id, con),
          qiweDbApi.doBuscaLogista(row_pedido.logista_id, con),
        ]));
        return Promise.all(promises)
      })
      .then((rows_pedido_items) => {
        if (rows_pedido_items.length) {
          doPreparePrint();
        }
        return rows_pedido_items;
      })
      .then((rows_pedido_items) => {
        rows_pedido_items.forEach(row => {
          doPrintCozinha(row);
          localDbApi.doSaveIdsPedidosImpressos([row[0].order_id]);
        });
      })
      .catch((erro) => {
        console.log(erro);
      });
  }

  function doRunImpressaoBot() {
    return doRunImpressao().finally(() => {
      setTimeout(() => doRunImpressaoBot(), 5000);
    });
  }

  if (!err) {
    doRunImpressaoBot();
    console.log("Servidor de Impressão - Iniciado");
    console.log("\n");
  }
  else {
    console.log("Servidor de Impressão - Não Iniciado");
    console.log("Por favor, resolva a falha abaixo e reinicie o servidor");
    console.error(err);
  }

});
