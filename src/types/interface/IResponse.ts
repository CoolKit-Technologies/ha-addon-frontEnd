export default interface IResponse<T = any> {
    error: number;
    msg?: string;
    data?: T;
}
