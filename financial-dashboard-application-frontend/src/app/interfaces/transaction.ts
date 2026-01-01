export interface Transaction {
    id: number,
    amount: number,
    category: Category,
    user_id: number,
    date_of_transaction: Date,
    description: string
}

export enum Category{INCOME, HOUSE, OIL, FOOD, ENTERTAINMENT, OTHERS, GROCERIES}
