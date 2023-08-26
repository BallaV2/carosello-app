class CaroselloComponent extends HTMLElement {
    showarrow = true;
    showcheckbox = true;
    dragimgenabled = true;
    imgWidth = 0;
    template = `
    
    <div id="container" style="max-width: 1100px; margin: auto; position: relative">
        <link href="./components/carosello/carosello.component.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
        
        <div id="wrapper" class="wrapper">
            <i class="fa-solid fa-angle-left" id="goBackArrow"></i>
                <ul id="carosello" class="carosello">
                </ul>
            <i class="fa-solid fa-angle-right" id="goNextArrow"></i>
        </div>
        <i class="fa-solid fa-angle-double-right" id="infiniteArrow"></i>
    </div>
    `;

    /* Setters and getters */
    get imglist() {
        return this.getAttribute('imglist');
    }

    get showarrow() {
        return this.getAttribute('showarrow');
    }

    get showcheckbox() {
        return this.getAttribute('showcheckbox');
    }

    get dragimgenabled() {
        return this.getAttribute('dragimgenabled');
    }

    get imgWidth() {
        return this.getAttribute('imgWidth');
    }

    set imglist(val) {
        this.setAttribute('imglist', val);
    }

    set showarrow(val) {
        this.setAttribute('showarrow', val);
    }

    set showcheckbox(val) {
        this.setAttribute('showcheckbox', val);
    }

    set dragimgenabled(val) {
        this.setAttribute('dragimgenabled', val);
    }

    set imgWidth(val) {
        this.setAttribute('imgWidth', val);
    }
    

    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' }); /* Creaa una sandbox per non cozzare con il css, js... al di fuori del componente */
        this.render();
    }

    static get observedAttributes() {
        /* 
            imglist: string[] = La lista di immagini da mostrare dentro il carosello      🔴IMPORTANTE: input minimo = 3 immagini
            showarrow: boolean = Mostra o meno le freccette per andare avanti o indietro nel carosello
            showcheckbox: boolean = Mostra o meno i pallini sotto il carosello
            dragimgenabled: boolean = Abilita o meno la possibilità di sfogliare il carosello trascinando le immagini
        */
        return ['imglist', 'showarrow', 'showcheckbox', 'dragimgenabled']
    }

    /* Lifecycle che mi setta gli attributi passati in input al componente */
    attributeChangedCallback(prop, oldVal, newVal) {
        console.info('Input attributo: ', prop);
        if(prop === "imglist") {
            const urls = newVal.split(',');
            this.nestImages(urls);
            this.addImgToTopAndBottom();
            this.render();
            
        }
        if(prop === "showarrow") {
            this.showarrow = newVal == 'true' ? true : false;
            this.render();
        }
        if(prop === "showcheckbox") {
            this.showcheckbox = newVal == 'true' ? true : false;
            this.render();
        }
        if(prop === 'dragimgenabled') {
            this.render();
        }
        this.listenToEvents();
    }

    /* Lifecycle che viene chiamato quando il componente viene aggiunto al DOM tipo ngAfterViewInit */
    connectedCallback() {
        console.info('Carosello aggiunto alla pagina...');
        /* this.render(); */
    }

    /* Lifecycle che viene richiamato quando il componente viene distrutto tipo ngOnDestroy */
    disconnectedCallBack() {
        console.info('Carosello rimosso dalla pagina');
    }

    render() {
        if(this.shadowRoot){ 
            let dom = '';
            let domRef = '';
            if(this.shadowRoot.getElementById('container')){
                dom = this.shadowRoot.getElementById('container').cloneNode(true);
            }
            /* 
                La prima volta applica al componente il template di base 
                mentre le volte successive deve applicare il template preso dal DOM con tutte le modifiche apportare 
                (esempio: immagini caricate).
            */
            dom ? (this.shadowRoot.innerHTML = '', this.shadowRoot.appendChild(dom)) : this.shadowRoot.innerHTML = this.template;
        }
    }

    /* Prende gli url delle immagini passati in input e crea una lista di immagini */
    nestImages(imglist) {
        for( let i = 0; i < imglist.length; i++) {
            let imgUrl = imglist[i];
            let carosello = this.shadowRoot.getElementById('carosello');
            let li = document.createElement('li');
            let div = document.createElement('div');
            let img = document.createElement('img');
            
            img.setAttribute('src', imgUrl);
            img.setAttribute('alt', `img_${i+1}`);
            img.setAttribute('druggable', false);

            div.appendChild(img);
            div.classList.add('img');

            li.classList.add('card');
            li.appendChild(div);

            carosello.appendChild(li);

            /* 
            Risultato:
            <li class="card">
                <div class="img">
                    <img src="./url" alt="img_n">
                </div>
            </li>
            */
        }
    }

    addImgToTopAndBottom() {
        this.render();
        const carosello = this.shadowRoot.getElementById('carosello');
        this.imgWidth = this.shadowRoot.querySelector('img').offsetWidth || 400;
        let caroselloChildrens = [...carosello.children];
                
        let nImgToShow = Math.round(carosello.offsetWidth / this.imgWidth) /* Numero delle immagini da mostrare nel carosello */

        /* Inserisco una copia delle prime img all'inizio del carosello */
        caroselloChildrens.slice(-nImgToShow).reverse().forEach((img) => {
            carosello.insertAdjacentHTML("afterbegin", img.outerHTML);
        })

        /* Inserisco una copia delle prime img alla fine del carosello */
        caroselloChildrens.slice(0, nImgToShow).forEach((img) => {
            carosello.insertAdjacentHTML("beforeend", img.outerHTML);
        })
    }

    listenToEvents() {
        /* EventListener */
        const carosello = this.shadowRoot.getElementById('carosello');
        const arrows = this.shadowRoot.querySelectorAll('.wrapper i');
        const infiniteArrow = this.shadowRoot.getElementById('infiniteArrow');
        const pauseArrowTpl = '<i class="fa-solid fa-pause-circle" id="pauseArrow"></i>';
        const infiniteArrowTpl = '<i class="fa-solid fa-angle-double-right" id="infiniteArrow"></i>'
        
        let timeoutId = null;
        let isInfiniteLoop = false;

        const InfiniteScroll = (e) => {
            this.simulaCaroselloInfinito();
        }

        const autoPlay = () => {
            if(window.innerWidth < 800) return;
            timeoutId = setInterval(() => {
                carosello.scrollLeft += this.imgWidth;
            }, 1000);
        }

        const stopAutoPlay = () => {
            clearTimeout(timeoutId);
        }

        /* const onDragElement = (e) => {
            if(!isDragStart) return;
            e.preventDefault();
            carosello.classList.add('dragging');
            carosello.scrollLeft = startScrollLeft - (e.pageX - startX);
        }

        const dragStart = (e) => {
            isDragStart = true;
            startX = e.pageX;
            startScrollLeft = carosello.scrollLeft;
        }

        const dragStop = (e) => {
            isDragStart = false;
            carosello.classList.remove('dragging');
        } */

        if(carosello) {
            /* Eventi per trascinare il carosello con il muose o il cursore */

            /* carosello.addEventListener('mousemove', onDragElement);
            carosello.addEventListener('mousedown', dragStart);
            carosello.addEventListener('mouseup', dragStop);
            carosello.addEventListener('mouseleave', dragStop);

            carosello.addEventListener('touchmove', onDragElement);
            carosello.addEventListener('touchstart', dragStart);
            carosello.addEventListener('touchend', dragStop); */

            carosello.addEventListener('scroll', InfiniteScroll);
        }

        if(arrows?.length > 0) {
            arrows.forEach((arrow) => {
                arrow.addEventListener('click', (e) => {
                    this.simulaCaroselloInfinito();
                    carosello.scrollLeft += arrow.id == 'goBackArrow' ? -this.imgWidth : this.imgWidth;
                })
            })
        }

        if(infiniteArrow) {
            infiniteArrow.addEventListener('click', (e) => {
                isInfiniteLoop = !isInfiniteLoop;
                isInfiniteLoop ? autoPlay() : stopAutoPlay();

                infiniteArrow.classList.remove(isInfiniteLoop ? 'fa-angle-double-right' : 'fa-pause');
                infiniteArrow.classList.add(!isInfiniteLoop ? 'fa-angle-double-right' : 'fa-pause');
            })
        }
    }

    simulaCaroselloInfinito() {
        const carosello = this.shadowRoot.getElementById('carosello');

        if(carosello.scrollLeft === 0) {
            carosello.classList.add("no-transition");
            carosello.scrollLeft = carosello.scrollWidth - ( 2 * carosello.offsetWidth );
            carosello.classList.remove("no-transition");
        }
        if(Math.ceil(carosello.scrollLeft) === carosello.scrollWidth - carosello.offsetWidth) {
            carosello.classList.add("no-transition");
            carosello.scrollLeft = carosello.offsetWidth;
            carosello.classList.remove("no-transition");
        }
    }
}

customElements.define('app-carosello', CaroselloComponent);