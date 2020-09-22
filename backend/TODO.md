# Password recovery

**FR**

- The user must be able to recover its password informing its email;
- The user must receive an email with recover password instructions;
- O usuário deve poder resetar sua senha;

**NFR**

- Use Mailtrap to test sending emails in development environment;
- Use Amazon SES to sending email in production;
- Sending email must happen in background (background job);

**BL**

- The link sent by email to recover the password must expire within 2 hours;
- The user must confirm the new password when resetting its password;

# Profile update

**FR**

- The user must be able to update its name, email and password;

**BL**

- The user must not be able to change the email to an existing email;
- To updated the password, the user must provide the old password;
- To updated the password, the user must confirm the new password;

# Provider dashboard

**FR**

- The provider must be able to list its appointments of a specific day;
- The provider must be able to receive a notification every time a new appointment is created;
- The provider must be able to visualize unread notifications;

**NFR**

- Provider's appointments of the day must be stored in cache;
- Provider's notifications must be stored on MongoDB;
- Provider's notifications must be sent in Real Time using Socket.io;

**BL**

- Notifications must have status of read and unread to allow the provider to control;
- (TODO) The appointments created must appear in Real Time

# Appointment schedule

**FR**

- The user must be able to list all service providers that are register;
- The user must be able to list days a month that has at least one available hour for a specific provider;
- The user must be able to list available hours in a specific day for a specific provider;
- The user must be able to make a new appointment with a provider;

**NFR**

- The list of providers must by stored in cache;

**BL**

- Each appointment must have duration of 1 hour;
- The appointments must be available between 8 a.m and 6 p.m (First at 8 a.m and last at 5 p.m);
- The user must not be able to schedule in an already booked hour;
- The user must no be able to schedule in a hour that already passed;
- The user must no be able to schedule appointments with itself;
