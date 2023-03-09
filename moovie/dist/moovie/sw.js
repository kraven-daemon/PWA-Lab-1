'use strict';
const VERSION = 'v3';
const SOME_CACHE = `some-cache ${VERSION}`;
const RESSOURCE = [
    '/',
    '/styles.ef46db3751d8e999.css',
    '/runtime.ba30002c5724f1e2.js',
    '/polyfills.e4054bd04872f212.js',
    '/main.ee9db35477cc7640.js',
    '/favicon.ico',
    '/sw.js'
];

// cors is enabled
const API_ROUTE = "/api/movies";
const DBNAME = "movies";

const log = (msg) => { console.info(`🔨 ${VERSION} - ${msg}`) };
log("working...")

// lifecycle events
self.addEventListener('install', event => event.waitUntil(installServiceWorker()));
self.addEventListener('activate', event => event.waitUntil(activateServiceWorker()));
// self.addEventListener('fetch', event => event.respondWith(dispatchResponses(event)));

async function installServiceWorker() {
    log('installing...');
    // log('populating database...');
    // skipping static
    // ...cache.addAll(RESSOURCE).then(()=> self.skipWaiting());
    // self.indexedDB.open('movies', 1);
}

async function activateServiceWorker() {
    log('activating...');
    // clear old cache on activation
    // array of cache names
    const cacheKeys = await caches.keys();

    // asynchronously delete all cache not matching our current version
    for await (let cache of cacheKeys) {
        if (cache !== SOME_CACHE) {
            log(`deleting old cache... ${cache}`);
            caches.delete(cache);
        }
    }
}

// fetch push sync

// handle dispatch
async function dispatchResponses(fetchEvent) {
    try {
        const response = await fetch(fetchEvent.request);
        // clone the response object, whatever it is
        const cacheRes = response.clone();
        // open the cache
        const cache = await caches.open(SOME_CACHE);
        // cache the url and response
        cache.put(fetchEvent.request, cacheRes);

        // return response to the browser
        return response;

    } catch {
        return caches.match(fetchEvent.request).then(response => response);
    }
}

// sync
// self.addEventListener('sync', (event) => {
//     if (event.tag === 'post-data') {
//         log('received sync event for "post-data"');
//     }
// })

class MessagesService {
    async createMovies(movie) {
        return fetch(API_ROUTE, {
            method: 'POST',
            body: JSON.stringify({
                content: movie.title,
            }),
            headers: {
                'Content-Types': 'application/json'
            }
        }).catch(error => {
            this.saveMessagesInOffline(movie);
            throw error;
        });
    }
    async saveMoviesInOffline(movies) {
        const db = await openDB('movie', 1, {
            upgrade(db) {
                db.createObjectStore('moviesToSync', { keyPath: 'id' });
            }
        });
        const tx = db.transaction('moviesToSync', 'readwrite');
        tx.store.put({ ...movies });
        await tx.done;
    }
}

self.addEventListener("fetch", event => {
  if (event.request.url.indexOf(API_ROUTE) > -1) {
    event.respondWith(fetch(event.request)
      .then((resp) => {
        var cloneResp = resp.clone();
        cloneResp.json()
          .then((donnees) => {
            for (var film of donnees) {
              enregistrer('films', film);//cet appel à besoin de dbPromise
            }
            return resp;
          })
          return resp;
      })
    )
  }
  else{ 
      event.respondWith(
      caches.match(event.request).then(response => {
        return (
          // Si dans le cache statique alors le retourner  
          response ||
          // sinon, prenez la réponse de la demande, ouvrez le cache dynamique 
          //et stockez-y la réponse
          // on utilise resp puisque response est déjà utilisé
          fetch(event.request).then(resp => { 
            return caches.open().then(cache => {
              // vous devez stoker absolument un clone de la réponse soit resp
              cache.put(event.request.url, resp.clone());
              // puis renvoyez la demande d'origine au navigateur
              return resp;
            });
          })
        );
      }).catch(err => {})
    );
    }
});

self.addEventListener('sync', function(event) {
  if (event.tag === 'sync-nouveau-film') {
    console.log('[Service Worker] sync nouveau film');
    event.waitUntil(
      contenuStore('sync-films')
        .then((listeFilms) =>  {
          for (var unFilm of listeFilms) {console.log("En SW");console.log(JSON.stringify(unFilm));
            fetch('/enregistrer', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify(unFilm)
            })
              .then((res) => {console.log(res);
                //afficherDansListeFilms(leFilmEnregistre);
                if (res.ok) {
                  supprimerElement('sync-films',unFilm.NumFilm);
                }
              })
              .catch((err) => {
                console.log('Erreur avec envoyer les données', err);
              });
          }

        })
    );
  }
});







