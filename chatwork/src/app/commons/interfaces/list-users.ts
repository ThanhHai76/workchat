export interface ListUsers {
  _id: string;
  name: string;
  avatar: string;
  about: string;
  email: string;
  date_of_birth: string;
  gender: string;
  phone: string;
  address: string;
  website: string;
  status: string;
  
  senderId: string;
  receiverId: string;
  newestMessage: string;
  sendtime: number;
  selectedUser: string;
}

