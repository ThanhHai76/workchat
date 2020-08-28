import { Users } from './users';

export interface ChatLeftResponse {
	chatList: Users[];
	error: boolean;
	singleUser: boolean;
	userDisconnected: boolean;
	userid: string;
}
