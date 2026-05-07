export interface Product {
    id: string;
    name: string;
    tags: string[];
    price: number;
    description: string;
    avalibility: boolean;
}

export interface Filter {
    priceRange: { min: number, max: number };
    tags: string[];
}

export function findProductByName() { }

export function findProductById() { }

// Find certain amount of flowers
export function findProduct(_num: number, _tags: string[]) { }

