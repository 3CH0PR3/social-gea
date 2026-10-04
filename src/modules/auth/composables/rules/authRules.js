export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email) {
  if (!email || !email.trim()) {
    return 'El correo electrónico es requerido';
  }
  if (!emailRegex.test(email.trim())) {
    return 'Ingresa un correo electrónico válido';
  }
  return null;
}

export function validatePassword(password, minLength = 8) {
  if (!password) {
    return 'La contraseña es requerida';
  }
  if (password.length < minLength) {
    return `La contraseña debe tener al menos ${minLength} caracteres`;
  }
  return null;
}

export function validatePasswordsMatch(password, confirmPassword) {
  if (password !== confirmPassword) {
    return 'Las contraseñas no coinciden';
  }
  return null;
}

export function validateName(name, fieldName = 'nombre') {
  if (!name || !name.trim()) {
    return `Por favor ingresa tu ${fieldName}`;
  }
  return null;
}
