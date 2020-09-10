export class User {
    constructor(
        public name: string,
        public userId: string,
        public email: string,
        public phone: string,
        public date_of_birth: string,
        public gender: string,
        public avatar: string,
        public address: string,
        public website: string,
        public about: string,
        public newestMessage: string,
        public sendtime: number
    ){}
}
