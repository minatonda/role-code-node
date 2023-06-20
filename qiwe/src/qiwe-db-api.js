const moment = require('moment');

function doBuscaPedidos(idsToBreak, date, con) {
    const q1 = `select * from orders inner join order_payments on orders.id = order_payments.order_id where order_payments.status = 'CON'`;
    const q2 = `orders.id not in (${idsToBreak.join(',')})`;
    const q3 = `DATE(orders.created_at) = '${moment(date).format('YYYY-MM-DD')}'`
    const query = [];

    query.push(q1);
    if (idsToBreak && idsToBreak.length) {
        query.push(q2);
    }
    if (date) {
        query.push(q3);
    }

    return new Promise((resolve, reject) => {
        con.query(query.join(' and '), (err, result, fields) => err ? reject(err) : resolve(result));
    });
}

function doBuscaItemsPedidos(idPedido, con) {
    return new Promise((resolve, reject) => {
        con.query(
            `select order_itens.quantidade, order_itens.observacao, cardapio.nome, categorias_produto.categoria from order_itens  
                left join cardapio on order_itens.produto_id = cardapio.id
                right join categorias_produto on cardapio.categoria_id = categorias_produto.id 
                    where order_id = ${idPedido}`,
            (err, result, fields) => err ? reject(err) : resolve(result)
        );
    });
}

function doBuscaUsuario(idUsuario, con) {
    return new Promise((resolve, reject) => {
        con.query(`select * from users where id =  ${idUsuario}`, (err, result, fields) => err ? reject(err) : resolve(result));
    });
}

function doBuscaLogista(idLogista, con) {
    return new Promise((resolve, reject) => {
        con.query(`select * from logistas where id =  ${idLogista}`, (err, result, fields) => err ? reject(err) : resolve(result));
    });
}

module.exports = {
    doBuscaPedidos: doBuscaPedidos,
    doBuscaItemsPedidos: doBuscaItemsPedidos,
    doBuscaUsuario: doBuscaUsuario,
    doBuscaLogista: doBuscaLogista
};