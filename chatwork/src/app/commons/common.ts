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
    name: 'name',
    email: 'email',
    password: 'password',
    confirm: 'confirm',
    profile: 'profile',
  };

  public static API = {
    login: '/api/login',
    signup: '/api/signup',
    userList: '/api/userList',
    facebookLogin: '/api/social-signin/facebook',
    googleLogin: '/api/social-signin/google',
    logout: '/api/logout',
    //------------------------
    profile: '/api/profile',
    usersProfile: '/api/users',
    update: '/api/update',
    updateSocialUser: '/api/updateSocialUser',
    updateSocialLink: '/api/updateSocialLink',
    updateSocialLink_SocialUser: '/api/updateSocialLink_SocialUser',
    upload: '/api/upload',
    getAvatar:'/api/getAvatar',
  };
}
