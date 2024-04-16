

export class UpdateTodoDto {
    private constructor(
        public readonly id: number,
        public readonly text?: string,
        public readonly completedAt?: Date,
    ){}

    get values(){
        const returnObj: {[key: string]: any} = {}

        if(this.text) returnObj.text = this.text;
        if(this.completedAt) returnObj.completedAt = this.completedAt;

        return returnObj;
    }

    static create(props: {[key: string]: any}): [string?, UpdateTodoDto?] {

        const {id, text, completedAt} = props;
        let newComplitedAt = completedAt;

        if(!id || isNaN(Number(id))){
            return ['El id tiene que ser un numero valido'];
        }

        if(completedAt){
            newComplitedAt = new Date(completedAt);
            if(newComplitedAt.toString() === 'Invalid Date'){
                return ['CompletedAt no es valido'];
            }
        }

        return [undefined, new UpdateTodoDto(id, text, newComplitedAt)];
    }
}