export interface MessageSocketEvent {
	senderId: string;
	username: string;
	message: string;
	receiverId: string;
	sendtime: number;
}
