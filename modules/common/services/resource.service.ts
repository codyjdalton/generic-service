import { Model, Document } from "mongoose";
import { Observable, from, of } from "rxjs";
import { map, concatMap } from 'rxjs/operators';

export abstract class ResourceService {

    model: Model<Document>;

    public findByParams(params: any): Observable<Document[]> {
        return from(this.model.find(params));
    }

    public findAll(): Observable<Document[]> {
        return this.findByParams({});
    }

    public updateByIdObservable(id: string, updateBody: object): Observable<Document> {
        return from(this.model.findOne({ id: id })).pipe(
            concatMap((item: Document) => {
                Object.keys(updateBody).forEach(
                    key => {
                        if(updateBody[key] !== undefined && key !== 'id' && key !== '_id') {
                            item[key] = updateBody[key];
                        }
                    }
                );
                return from(item.save());
            })
        );
    }

    public findById(id: string): Observable<Document> {
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