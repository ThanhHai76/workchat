import { SocialUser } from 'angularx-social-login';

export class UserModel extends SocialUser {
  _id: string;
  gender: string;
  phone: string;
  date_of_birth: Date;
  address: string;
  website: string;
  avatar: string;
  about: string;
  newestMessage: string;
  sendtime: number;

  constructor(dataUser: SocialUser) {
    super();
    this.email = dataUser.email;
    this.name = dataUser.name;
    this.photoUrl = this.avatar = dataUser.photoUrl;
    this.firstName = dataUser.firstName;
    this.lastName = dataUser.lastName;
  }
}
