export class Common {
  public static PATHS = {
    home: '',
    profile: 'profile',
    login: 'login',
    register: 'register',
    resetPassword: 'reset-password',
    domain:'https://localhost:8888'
  };

  public static KEYS = {
    token: 'token',
    refreshToken: 'refreshToken',
    name: 'name',
    email: 'email',
    password: 'password',
    confirm: 'confirm',
    profile: 'profile',
  };

  public static API = {
    login: '/api/login',
    signup: '/api/signup',
    userList: '/api/user',
    facebookLogin: '/api/social-signin/facebook',
    googleLogin: '/api/social-signin/google',
    logout: '/api/logout',
    refreshToken: '/api/refreshToken',
    profile: '/api/profile',
    update: '/api/update',
    updateSocialLink: '/api/updateSocialLink',
    upload: '/api/upload',
    getMsg: '/api/getMessages'
  };
}
