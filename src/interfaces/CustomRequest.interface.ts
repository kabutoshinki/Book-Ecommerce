export interface CustomRequest extends Request {
  flash(type: string, message: string): void;
}
