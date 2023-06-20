export abstract class NeDbProvider<T> {

    protected db: Nedb<T>;
    private connected: boolean;

    constructor(dbpath: string) {
        const Datastore = require('nedb');
        if(dbpath){
            this.db = new Datastore({ filename: dbpath });
        }
        else{
            // in memory db for tests
            this.db = new Datastore();
        }
    }

    public insert(model: Partial<T>): Promise<T> {
        return this.open().then((res) => new Promise(
            (resolve, reject) => this.db.insert(model as T, (err, doc) => err ? reject(err) : resolve(doc))
        ));
    }

    public update(id: string, model: Partial<T>): Promise<number> {
        return this.open().then((res) => new Promise(
            (resolve, reject) => this.db.update({ _id: id }, model, {}, (err, doc) => err ? reject(err) : resolve(doc))
        ));
    }

    public find(model: Partial<T>): Promise<T[]> {
        return this.open().then((res) => new Promise(
            (resolve, reject) => this.db.find(model, {}, (err, doc) => err ? reject(err) : resolve(doc))
        ));
    }

    public all(): Promise<T[]> {
        return this.open().then((res) => new Promise(
            (resolve, reject) => this.db.find(undefined, undefined, (err, doc) => err ? reject(err) : resolve(doc))
        ));
    }

    protected open() {
        return new Promise((resolve, reject) => {
            if (this.connected) {
                resolve(this.connected);
            }
            else {
                this.db.loadDatabase((error) => {
                    if (error) {
                        reject(error);
                    }
                    this.connected = true;
                    resolve(true);
                })
            }
        });
    }

}