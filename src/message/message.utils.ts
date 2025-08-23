import { Injectable } from '@nestjs/common';

@Injectable()
export class MessageUtils {
  revertString(str: string) {
    // Petterson -> nosretteP
    return str.split('').reverse().join('');
  }
}

@Injectable()
export class MessageUtilsMock {
  revertString() {
    return 'qualquer coisa';
  }
}
