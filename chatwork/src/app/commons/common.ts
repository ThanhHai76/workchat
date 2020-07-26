export class Common {
  public static PATHS = {
    home: '',
    profile: 'profile',
    login: 'login',
    register: 'register',
    resetPassword: 'reset-password'
  };

  public static KEYS = {
    token: 'token',
    name: 'name',
    email: 'email',
    password: 'password',
    confirm: 'confirm',

    avatar: 'avatar',
    address: 'address',
    phone: 'phone',
    website: 'website'
  };

  public static API = {
    login: '/api/login',
    signup: '/api/signup',
    userUpdate: '/api/user/',
    update: '/api/update',
    profile: '/api/profile',
    userList: '/api/user',
    logout: '/api/logout'
  };
}
