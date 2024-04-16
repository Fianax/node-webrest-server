import { Router } from "express";
import { TodosController } from "./todos/controller";
import { TodosRoutes } from "./todos/routes";



export class AppRoutes {

    static get routes(): Router {
        const router = Router();
        const todoController = new TodosController();

        router.use('/api/todos', TodosRoutes.routes);

        return router;
    }

}