import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  // Placeholder for chat logic
  sendMessage(message: string) {
    console.log(`Sending message: ${message}`);
  }
}

