const moment = require("moment");

function getPrinterTemplateBuilder() {
    const ThermalPrinter = require("node-thermal-printer").printer;
    return new ThermalPrinter({
        type: 'epson'
    });
}

function getFilledWithLeftCharacters(text, character, cases) {
    let data = text.toString();
    while (data.length < cases) {
        data = character + data;
    }
    return data;
}

function getChainedItemByProperty(items, property) {
    return items.map((r) => {
        let count = 0;
        let items = [];
        while (count < r[property]) {
            const item = { ...r };
            item[property] = 1
            items.push(item);
            count++;
        }
        return items;
    })
        .reduce((i, c) => i.concat(c), []);
}

function buildChainedIdentedText(ident_spaces, text) {
    const line_length = 47;
    const text_array = [];

    let text_count = 0;
    let current_ident_space_index = 0;
    while ((text_count < text.length)) {
        const current_ident_spaces = ident_spaces[current_ident_space_index];
        const text_ident = Array(current_ident_spaces).fill(" ").join("");
        if (text.substring(text_count)[0] === " ") {
            text_count += 1;
        }
        let text_chain = text.substring(text_count, (text_count + line_length - current_ident_spaces));
        if (ident_spaces[current_ident_space_index + 1]) {
            current_ident_space_index += 1;
        }
        text_array.push(text_ident + text_chain);
        text_count += text_chain.length;
    }
    return text_array;
}

function buildPrintTemplateCozinha(row_pedido, rows_items_pedido, rows_user, rows_logista) {
    const chained = getChainedItemByProperty(rows_items_pedido, 'quantidade');

    const texto_produto = chained.map((item) => {
        const produto = [item.categoria, item.nome].filter((x) => !!x).join(' - ');
        const texto_produto = "XXX   XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
            .replace("XXX", getFilledWithLeftCharacters(item.quantidade, "0", 3))
            .replace("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", produto);

        if (item.observacao) {
            return [
                ...buildChainedIdentedText([0, 6], texto_produto),
                ...buildChainedIdentedText([8], "* Observação *"),
                ...buildChainedIdentedText([12], item.observacao),
            ]
        }
        else {
            return [
                ...buildChainedIdentedText([0, 6], texto_produto)
            ];
        }
    })
        .reduce((i, c) => i.concat(c), []);

    const texto_user = rows_user.map((item) => {
        return "SOLICT: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
            .replace("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", item.nome.substring(0, "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX".length));
    });

    const texto_lojista = rows_logista.map((item) => {
        return "LOJIST: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
            .replace("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", item.fantasia.substring(0, "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX".length));
    });

    const texto_voucher = "VOUCHER: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
        .replace("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", row_pedido.order_id.toString().substring(0, "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX".length));

    return [
        "===============================================",
        "                    COZINHA                    ",
        "              XX/XX/XXXX XX:XX:XX              ".replace("XX/XX/XXXX XX:XX:XX", moment().format("DD/MM/YYYY HH:mm:ss")),
        "===============================================",
        "DATA DO PEDIDO: XX/XX/XXXX XX:XX:XX            ".replace("XX/XX/XXXX XX:XX:XX", moment(row_pedido.created_at).format("DD/MM/YYYY HH:mm:ss")),
        ...texto_user,
        ...texto_lojista,
        texto_voucher,
        "===============================================",
        "Qtde. Produto                                  ",
        "===============================================",
        ...texto_produto,
        "===============================================",
        "                www.qiwe.com.br                ",

    ].join("\n");
}

function buildPreparedPrintBuffer(text) {
    const thermal_printer = getPrinterTemplateBuilder();
    thermal_printer.print(text);
    thermal_printer.cut();
    return thermal_printer.getBuffer();
}

function doPrintBuffer(stream) {
    const printer = require("printer");
    const epson = printer.getPrinter(printer.getDefaultPrinterName());
    printer.printDirect({
        data: stream,
        printer: epson.name,
        type: "RAW",
        success: function (job_id) {
            console.log('OK :' + job_id);
        },
        error: function (err) {
            console.error(err);
        }
    });
}

module.exports = {
    doPrintBuffer: doPrintBuffer,
    buildPreparedPrintBuffer: buildPreparedPrintBuffer,
    buildPrintTemplateCozinha: buildPrintTemplateCozinha
};