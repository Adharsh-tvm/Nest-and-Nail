export class Category {
    constructor(
        public readonly id: string,
        public name: string,
        public slug: string,
        public isActive: boolean,
        public createdAt: Date
    ) { }
}