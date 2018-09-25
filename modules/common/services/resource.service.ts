import { Model, Document } from "mongoose";
import { Observable, from, of } from "rxjs";
import { map, concatMap } from 'rxjs/operators';

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
                            if(updateBody[key] !== undefined && key !== 'id' && key !== '_id') {
                                item[key] = updateBody[key];
                            }
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

    public findByIdObservable(id: string): Observable<Document> {
        return from(this.model.findOne({ id: id })).pipe(
            map((result: Document) => {
                if (!result) {
                    throw Error();
                }
                return result;
            })
        )
    }

    public deleteById(id: string): Observable<any> {
        return from(this.model.findOne({ id: id })).pipe(
            concatMap((item: Document) => from(item.remove())),
        );
    }
}