import { DomainError } from '../../base/errors/domain-error';

export class UserError extends DomainError {}

export class UserInvalidEmailError extends UserError {}
export class UserInvalidPasswordError extends UserError {}
