class ControllerMessages {
    private name;
    public CREATE: { req: string, res: string }
    public FETCH: { req: string, res: string }
    public FETCHALL: { req: string, res: string }
    public UPDATE: { req: string, res: string }
    public DELETE: { req: string, res: string }

    constructor(name: string) {
        this.name = name;

        this.CREATE = {
            req: `${this.name} create request received`,
            res: `${this.name} created successfully`
        };

        this.FETCH = {
            req: `${this.name} fetch request received`,
            res: `${this.name} fetched successfully`
        };

        this.FETCHALL = {
            req: `${this.name} fetch all request received`,
            res: `${this.name}s fetched successfully`
        };

        this.UPDATE = {
            req: `${this.name} update request received`,
            res: `${this.name} updated successfully`
        };

        this.DELETE = {
            req: `${this.name} delete request received`,
            res: `${this.name} deleted successfully`
        };
    }
}

export { ControllerMessages };
