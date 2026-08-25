# Role-based access control

| Role    | Frontend access                                        | Backend rule                                               |
| ------- | ------------------------------------------------------ | ---------------------------------------------------------- |
| Guest   | Public learning pages and account recovery             | No protected resource access                               |
| Learner | Personal learning, profile, settings, account security | Can access only own data                                   |
| Admin   | Learner access plus course-content management          | Can manage course content only when the endpoint grants it |

`src/features/auth/permissions.ts` is the single frontend policy source. It controls navigation affordances and route feedback; it is not a security boundary. The backend must authorize every request from the verified server-side role/permission claims.

Admin account actions are server-enforced through `/api/v1/admin/*`; frontend route guards merely keep those controls out of Learner and Guest navigation.
