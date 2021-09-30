export interface ILeiDianInfo {
    id?: string;
    name?: string;
    running?: boolean;
    checked?: boolean;
}
export class LeiDianInfo implements ILeiDianInfo {
    constructor(
        public id?: string,
        public name?: string,
        public running?: boolean,
        public checked?: boolean
    ) {
    }
}