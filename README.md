# carosello-app
[test] Creazione di un carosello utilizzando solamente js, html e css


Punti sviluppati
1- Introduzione frecce di navigazione IMNPLEMENTATO
2- Introduzione pallini di navigazione IMNPLEMENTATO
3- infinite loop IMNPLEMENTATO
4- Funzionalità responsive (permettere lo swipe su mobile per mostrare la foto successiva) NON IMNPLEMENTATO
5- Animazione di transizione tra le slide 75%(non implementato per i pallini di navigazione)
7- Autoplay IMNPLEMENTATO
6- Funzionalità responsive grafica (mostriamo 3 immagini affiancate su desktop ed 1 su mobile) IMNPLEMENTATO

Per runnare l'app è sufficente avere node (versione consigliata v18.12.1).

Per eseguire l'app si pùò utilizzare lo script "start" nel package.json e aprire nel browser http://localhost:4200
Altrimenti nei casi peggiori aprire sul browser il file index.html a mano.

Note:
Le freccie, i pallini di navigazione e il tasto per l'autoPlay sono stati inseriti come parametri configurabile dal componente.

<app-carosello
    showarrow="true"
    showradios="true"
    showinfiniteloop="true">
</app-carosello>

Di default il carosello usa 9 immagini mockate, per utilizzare le immagini prese da unsplash.com basta scommentare la get e commentare il setTimeout() contenuti nel file index.js  (dentro la cartella src) 
![image](https://github.com/BallaV2/carosello-app/assets/84376774/17f1b13d-3d1f-4223-8af8-c1b06b1cd209)

Il numero di immagini si puà cambiare andando a valorizzare la costante nImmagini (è consigliato utilizzare i multipli di 3).

Se si passa dalla visualizzazione desktop a mobile è consigliato ricaricare la pagina perhè l'attributo isMobile al momento non viene aggiornato su questo evento;
