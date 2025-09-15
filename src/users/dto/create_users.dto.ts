import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'First Name is required' })
  @Matches(/^[A-Za-z\s-]{2,50}$/, {
    message: 'Name must be 2–50 characters and contain only letters, spaces, or hyphens',
  })
  firstName: string;

  @IsNotEmpty({ message: 'Last Name is required' })
  @Matches(/^[A-Za-z\s-]{2,50}$/, {
    message: 'Name must be 2–50 characters and contain only letters, spaces, or hyphens',
  })
  lastName: string;

  @IsNotEmpty({ message: 'Please enter the Phone Number' })
  @Matches(/^(?:\d{10}|\(\d{3}\)\s?\d{3}-\d{4}|\d{3}-\d{3}-\d{4})$/, {
    message:
      'Enter a valid phone number (e.g., 123-456-7890 or (123) 456-7890)',
  })
  phoneNumber: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Enter a valid email address (e.g., user@example.com)' })
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: 'Enter a valid email address (e.g., user@example.com)',
  })
  email: string;

  @IsNotEmpty({ message: 'Please enter the Password' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;
}
