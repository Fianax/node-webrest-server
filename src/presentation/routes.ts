import { Router } from "express";
import { TodosController } from "./todos/controller";
import { TodosRoutes } from "./todos/routes";
import { TodoDatasourceImpl } from "../infrastructure/datasources/todo.datasource.impl";
import { TodoRepositoryImpl } from "../infrastructure/repositories/todo.repository.impl";



export class AppRoutes {

    static get routes(): Router {
        const router = Router();
        const datasource = new TodoDatasourceImpl();
        const todoRepository = new TodoRepositoryImpl(datasource);
        const todoController = new TodosController(todoRepository);

        router.use('/api/todos', TodosRoutes.routes);

        return router;
    }

}