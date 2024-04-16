import { prisma } from "../../data/postgres";
import { CreateTodoDto, TodoDatasource, TodoEntity, UpdateTodoDto } from "../../domain";


export class TodoDatasourceImpl implements TodoDatasource {
    async create(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
        const newTodo = await prisma.todo.create({
            data: createTodoDto!
        });

        return TodoEntity.fromObject(newTodo);
    }
    async getAll(): Promise<TodoEntity[]> {
        const todos = await prisma.todo.findMany();

        return todos.map(todo => TodoEntity.fromObject(todo));
    }
    async findById(id: number): Promise<TodoEntity> {
        const todo = await prisma.todo.findFirst({
            where: {id}
        });

        if(!todo) throw `Todo con el id ${id} no se encontro`;

        return TodoEntity.fromObject(todo);
    }
    async updateById(updateTodoDto: UpdateTodoDto): Promise<TodoEntity> {
        await this.findById(updateTodoDto.id);

        const updateTodo = await prisma.todo.update({
            where: {id: updateTodoDto.id},
            data: updateTodoDto!.values
        });

        return TodoEntity.fromObject(updateTodo);
    }
    async deleteById(id: number): Promise<TodoEntity> {
        await this.findById(id);

        const deleted = await prisma.todo.delete({
            where: {id}
        });

        return TodoEntity.fromObject(deleted);
    }

}