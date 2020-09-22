import { ValidationError } from 'yup';

interface CustomErrors {
  [key: string]: string;
}

export default function getValidationErrors(
  err: ValidationError,
): CustomErrors {
  const validationErros: CustomErrors = {};

  err.inner.forEach(error => {
    validationErros[error.path] = error.message;
  });

  return validationErros;
}
