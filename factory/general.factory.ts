class GeneralFactory {
    static create (Repo: any, Service: any, Controller: any) {
        const repo = new Repo();
        const service = new Service(repo);
        const controller = new Controller(service);

        return controller;
    }
}

export { GeneralFactory };
