import { Transporter } from "nodemailer";

export abstract class NodeMailerProvider {

    protected transporter: Transporter;
    private host: string;
    private port: number;
    private from: string;

    constructor(host: string = '', port: number = undefined, from: string = '', user: string = '', pass: string = '') {
        this.host = host;
        this.port = port;
        this.from = from;
        if (host && port && user && pass) {
            this.open(user, pass);
        }
    }

    protected send(to: string[], subject: string, text: string, html: string = undefined, from: string = this.from): Promise<any> {
        return this.open()
            .then((res) =>
                this.transporter.sendMail({
                    from: from,
                    to: to.join(', '),
                    subject: subject,
                    text: text,
                    html: html,
                })
            );
    }

    protected open(user: string = undefined, pass: string = undefined) {
        return new Promise(async (resolve, reject) => {
            const nodemailer = require('nodemailer');
            if (!this.transporter && user && pass) {
                this.transporter = nodemailer.createTransport({
                    host: this.host,
                    port: this.port,
                    secure: false,
                    auth: {
                        user: user,
                        pass: pass,
                    },
                });
            }
            else if (!this.transporter) {
                let testAccount = await nodemailer.createTestAccount();
                this.transporter = nodemailer.createTransport({
                    host: "smtp.ethereal.email",
                    port: 587,
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: testAccount.user, // generated ethereal user
                        pass: testAccount.pass, // generated ethereal password
                    },
                });
            }
            resolve(true);
        });
    }

}