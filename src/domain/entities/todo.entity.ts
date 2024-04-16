

export class TodoEntity {
    constructor(
        public id: number,
        public text: string,
        public completedAt?: Date | null,
    ){}

    get isCompleted(){
        return !!this.completedAt;
    }

    public static fromObject(object: {[key: string]: any}): TodoEntity{
        const {id, text, completedAt} = object;

        if(!id) throw 'id es requerido';
        if(!text) throw 'text es requerido';

        let newCompletedAt;
        if(newCompletedAt){
            newCompletedAt = new Date(completedAt);
            if(isNaN(newCompletedAt.getTime())){
                throw 'completedAt no es valido';
            }
        }

        return new TodoEntity(id, text, completedAt);
    }
}