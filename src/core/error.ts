export class EntityDoesNotExist extends Error {
  constructor(message?: string) {
    super(message ?? "Requested entity does not exist");
  }
}