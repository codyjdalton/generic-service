import { Model, Document } from "mongoose";

export abstract class ResourceService {

    model: Model<Document>;

    public findByParams(params: any): Promise<Document[]> {
        return new Promise((resolve, reject) => {
            this.model.find(params)
                .then((items: any[]) => resolve(items))
                .catch(err => reject(err))
        });
    }

    public findAll(): Promise<Document[]> {
        return this.findByParams({});
    }

    public updateById(id: string, updateBody: object): Promise<Document> {
        return new Promise((resolve, reject) => {
            this.model.findOne({ id: id })
                .then((item: Document) => {
                    Object.keys(updateBody).forEach(
                        key => {
                            item[key] = updateBody[key];
                        }
                    );
                    item.save()
                        .then((item: Document) => resolve(item))
                        .catch(err => reject(err))
                })
                .catch(err => reject(err))
        });
    }

    public findById(id: string): Promise<Document> {
        return new Promise((resolve, reject) => {
            this.model.findOne({ id: id })
                .then((item: Document) => {
                    if(item) resolve(item);
                    reject(null);
                })
                .catch(err => reject(err))
        });
    }

    public deleteById(id: string): Promise<null> {
        return new Promise((resolve, reject) => {
            this.model.findOne({ id: id })
                .then((item: Document) => {
                    item.remove()
                        .then(() => resolve(null));
                })
                .catch(err => reject(err))
        });
    }
}