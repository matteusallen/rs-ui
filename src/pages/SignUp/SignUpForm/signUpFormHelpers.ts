import { SignUpStorePropNameType } from 'Pages/SignUp/SignUpStore';

function formatFieldName(field: SignUpStorePropNameType): string {
  const fieldArray: Array<string> = field.split('');

  const formattedStringArray: Array<string> = fieldArray.reduce((acc: Array<string>, char: string, index: number) => {
    if (index === 0) {
      acc.push(char.toUpperCase());
      return acc;
    }

    const asciiCode = char.charCodeAt(0);
    if (asciiCode >= 65 && asciiCode <= 90) acc.push(' ');
    acc.push(char);

    return acc;
  }, []);

  return formattedStringArray.join('');
}

export function getErrorMessage(field: SignUpStorePropNameType): string {
  const errorMessages = {
    firstName: 'Please enter a valid first name',
    lastName: 'Please enter a valid last name',
    phone: 'Please enter a valid phone number',
    email: 'Please enter a valid email',
    password: 'Password does not meet requirements'
  };

  if (!field) return `${formatFieldName(field)} is required`;
  return errorMessages[field];
}
