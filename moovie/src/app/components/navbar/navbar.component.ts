import { Component } from '@angular/core';

import { faCoins } from '@fortawesome/free-solid-svg-icons';
// <i class="fa-sharp fa-solid fa-inbox-in"></i>

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
    faCoins = faCoins;

    installWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js', { scope: "/" })
                .then(() => navigator.serviceWorker.ready)
                .then(registration => {
                    console.log("🔨 registrated");
                    if ('SyncManager' in window) {
                        // dont want to bother with creating types for that
                        // @ts-ignore
                        registration.sync.register('post-data')
                    }
                })
        }
    }
}
