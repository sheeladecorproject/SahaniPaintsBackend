import type { Products, ProductsData } from "../dto/products.dto.js";
import type { ProductsRepository } from "../repository/products.repository.js";
import { BaseService } from "./base.service.js";

class ProductService extends BaseService<Products, ProductsData, ProductsRepository> {
    constructor(methods: ProductsRepository){
        super(methods, "PRODUCT");
    }
}

export { ProductService };
