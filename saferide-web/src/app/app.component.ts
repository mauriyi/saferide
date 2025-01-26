import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initializeApp } from 'firebase/app';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'saferide';

  firebaseConfig = {
    apiKey: "AIzaSyAGQOPkrvoRyJOIg_tCxlU4q7VEZLHhWJk",
      authDomain: "saferide-firebase.firebaseapp.com",
      databaseURL: "https://saferide-firebase-default-rtdb.firebaseio.com",
      projectId: "saferide-firebase",
      storageBucket: "saferide-firebase.firebasestorage.app",
      messagingSenderId: "646882995172",
      appId: "1:646882995172:web:e47c0c53adf161aa72b5f1",
      measurementId: "G-07MJ9P9NS2"
  };

  app = initializeApp(this.firebaseConfig);
}
