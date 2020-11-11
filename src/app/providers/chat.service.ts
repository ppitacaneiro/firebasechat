import { Injectable } from '@angular/core';
import { Mensaje } from '../interfaces/mensaje.interface';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private itemsCollection: AngularFirestoreCollection<Mensaje>;

  public chats: Mensaje[] = [];
  public usuario:any = {};

  constructor(private afs: AngularFirestore,
              public auth: AngularFireAuth
            ) { 
      this.auth.authState.subscribe( user => { 
        // console.log('Usuario ' + user.uid);

        if (!user) {
          return;
        }

        this.usuario.nombre = user.displayName;
        this.usuario.id = user.uid;
      });
  }

  login(provider:string) {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  
  logout() {
    this.usuario = {};
    this.auth.signOut();
  }

  loadMessages() {
    this.itemsCollection = this.afs.collection<Mensaje>('chats', ref => ref.orderBy('date','desc')
                                                                           .limit(5) );
    return this.itemsCollection.valueChanges()
          .pipe(
            map( (messages:Mensaje[]) => {
            console.log(messages);

              this.chats = [];
              for (let message of messages) {
                this.chats.unshift(message);
              }
              return this.chats;
          }));
  }

  saveMessages(textMessage:string) {
    let message:Mensaje = {
      userName : this.usuario.nombre,
      message : textMessage,
      date : new Date().getTime(),
      uid : this.usuario.id
    };

    return this.itemsCollection.add(message);
  }
}
