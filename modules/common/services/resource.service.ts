import { Model, Document } from "mongoose";
import { Observable, from, of } from "rxjs";
import { map, concatMap } from 'rxjs/operators';

export abstract class ResourceService {

    model: Model<Document>;

    /**
     * @method findByParams
     * @param {object} params 
     * @return {Observable<Document[]>}
     */
    public findByParams(params: object): Observable<Document[]> {
        return from(this.model.find(params));
    }

    /**
     * @method findAll
     * @return {Observable<Document[]>}
     */
    public findAll(): Observable<Document[]> {
        return this.findByParams({});
    }

    /**
     * @method updateByIdObservable
     * @param {string} id 
     * @param {object} updateBody 
     */
    public updateByIdObservable(id: string, updateBody: object): Observable<Document> {
        return from(this.model.findOne({ id: id })).pipe(
            concatMap((item: Document) => {
                Object.keys(updateBody).forEach(
                    (key: string) => {
                        if(updateBody[key] !== undefined && key !== 'id' && key !== '_id') {
                            item[key] = updateBody[key];
                        }
                    }
                );
                return from(item.save());
            })
        );
    }

    /**
     * @method findById
     * @param {string} id
     * @return {Observable<Document>}
     */
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

    /**
     * @method deleteById
     * @param {string} id
     * @return {Observable<any>}
     */
    public deleteById(id: string): Observable<any> {
        return from(this.model.findOne({ id: id })).pipe(
            concatMap((item: Document) => from(item.remove())),
        );
    }
}