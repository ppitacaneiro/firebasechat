import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../providers/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styles: [
  ]
})
export class ChatComponent implements OnInit {

  mensaje:string = "";
  elemento:any;
  
  constructor(public chatService:ChatService) { 
    this.chatService.loadMessages().subscribe( () => 
      this.elemento.scrollTop = this.elemento.scrollHeight
    );
  }

  ngOnInit() {
    this.elemento = document.getElementById('app-mensajes');
  }

  sendMessage() {
    
    if (this.mensaje.length === 0) {
      return;
    }

    this.chatService.saveMessages(this.mensaje)
                    .then( () => this.mensaje = "" )
                    .catch( (error) => console.error('Error al enviar',error));

  }

}
