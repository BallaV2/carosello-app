class CaroselloComponent extends HTMLElement {
    showarrow = true;
    showradios = true;
    dragimgenabled = true;
    showinfiniteloop = true;
    imgWidth = 0;
    isMobile = window.innerWidth < 900;
    currentImg = window.innerWidth < 900 ? 0 : 1;
    template = `
    
    <div id="container" style="max-width: 1100px; margin: auto; position: relative">
        <link href="./components/carosello/carosello.component.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
        
        <div id="wrapper" class="wrapper">
            <i class="fa-solid fa-angle-left" class="arrow" id="goBackArrow"></i>
                <ul id="carosello" class="carosello">
                </ul>
            <i class="fa-solid fa-angle-right" class="arrow" id="goNextArrow"></i>
        </div>
        <i class="fa-solid fa-angle-double-right" id="infiniteArrow"></i>
        <ul id="radio-container"></ul>
    </div>
    `;

    /* Setters and getters */
    get imglist() {
        return this.getAttribute('imglist');
    }

    get showarrow() {
        return this.getAttribute('showarrow');
    }

    get showradios() {
        return this.getAttribute('showradios');
    }

    get imgWidth() {
        return this.getAttribute('imgWidth');
    }

    get currentImg() {
        return this.getAttribute('currentImg');
    }

    get isMobile() {
        return this.getAttribute('isMobile');
    }

    get showinfiniteloop() {
        return this.getAttribute('showinfiniteloop');
    }

    set imglist(val) {
        this.setAttribute('imglist', val);
    }

    set showarrow(val) {
        this.setAttribute('showarrow', val);
    }

    set showradios(val) {
        this.setAttribute('showradios', val);
    }

    set imgWidth(val) {
        this.setAttribute('imgWidth', val);
    }

    set currentImg(val) {
        this.setAttribute('currentImg', val);
    }

    set showinfiniteloop(val) {
        this.setAttribute('showinfiniteloop', val);
    }
    

    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' }); /* Creaa una sandbox per non cozzare con il css, js... al di fuori del componente */
        this.render();
    }

    static get observedAttributes() {
        /* 
            imglist: string[] = La lista di immagini da mostrare dentro il carosello      🔴IMPORTANTE: input minimo consigliato = 3 immagini
            showarrow: boolean = Mostra o meno le freccette per andare avanti o indietro nel carosello
            showradios: boolean = Mostra o meno i pallini sotto il carosello
            dragimgenabled: boolean = Abilita o meno la possibilità di sfogliare il carosello trascinando le immagini
        */
        return ['imglist', 'showarrow', 'showradios', 'showinfiniteloop']
    }

    /* Lifecycle che mi setta gli attributi passati in input al componente */
    attributeChangedCallback(prop, oldVal, newVal) {
        console.info('Input attributo: ', prop);
        if(prop === "imglist") {
            const urls = newVal.split(',');
            this.nestImages(urls);
            this.addImgToTopAndBottom();
            this.addManualNavigation();
            this.render();   
        }
        if(prop === "showarrow") {
            this.showarrow = newVal == 'true' ? true : false;
            this.render();
        }
        if(prop === "showradios") {
            this.showradios = newVal == 'true' ? true : false;
            this.render();
        }
        if(prop === "showinfiniteloop") {
            this.showinfiniteloop = newVal == 'true' ? true : false;
            this.render();
        }
        this.listenToEvents();
        this.checkInputAttributes();
        async () => {
            this.imgWidth = this.isMobile ? this.shadowRoot?.querySelectorAll('.img img')[0]?.clientWidth : 400;
        }
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

    checkInputAttributes() {
        const goNextArrow = this.shadowRoot.getElementById('goNextArrow')
        const goBackArrow = this.shadowRoot.getElementById('goBackArrow')
        const infiniteLoopBtn = this.shadowRoot.getElementById('infiniteArrow');
        const radioContainer = this.shadowRoot.getElementById('radio-container');

        if(!this.showarrow && goNextArrow && goBackArrow){
            goNextArrow.remove();
            goBackArrow.remove();
        }

        if(!this.showinfiniteloop && infiniteLoopBtn) {
            infiniteLoopBtn.remove();
        }

        if(!this.showradios && radioContainer) {
            radioContainer.remove();
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
        /* this.render(); */
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

        const allImg = this.shadowRoot.querySelectorAll('img');
        allImg.forEach((img, i) => {
            img.setAttribute('value', i);
        })
    }

    addManualNavigation() {
        const radioContainer = this.shadowRoot.getElementById('radio-container');
        const nImg = this.imglist.split(',');

        if(radioContainer){
            nImg.forEach((radio, i) => {
                let input = document.createElement('input');
                let li = document.createElement('li');

                input.setAttribute('type', 'radio');
                input.setAttribute('id', i);
                input.classList.add('radioBtn');
                if(window.innerWidth > 900 && i === 1) {
                    input.setAttribute('checked', true);
                    input.classList.add('no-cursor-pointer');
                }
                if(this.isMobile && i === 0){
                    input.setAttribute('checked', true);
                    input.classList.add('no-cursor-pointer');
                }

                li.appendChild(input);
                radioContainer.appendChild(li);
            })
        }
    }

    listenToEvents() {
        /* EventListener */
        const carosello = this.shadowRoot.getElementById('carosello');
        const arrows = this.shadowRoot.querySelectorAll('.wrapper i');
        const infiniteArrow = this.shadowRoot.getElementById('infiniteArrow');
        const radioBtns = this.shadowRoot.querySelectorAll('.radioBtn');
        const goNextArrow = this.shadowRoot.getElementById('goNextArrow');
        
        let timeoutId = null;
        let isInfiniteLoop = false;

        const InfiniteScroll = (e) => {
            this.simulaCaroselloInfinito();
        }

        const autoPlay = () => {
            timeoutId = setInterval(() => {
                carosello.scrollLeft += this.imgWidth;
                this.checkSelectedRadio(radioBtns, ++this.currentImg, carosello, false)
            }, 1500);
        }

        const stopAutoPlay = () => {
            clearTimeout(timeoutId);
        }

        if(carosello) {
            carosello.addEventListener('scroll', InfiniteScroll);
        }

        if(arrows?.length > 0) {
            arrows.forEach((arrow) => {
                arrow.addEventListener('click', (e) => {
                    this.simulaCaroselloInfinito()
                    carosello.scrollLeft += arrow.id == 'goBackArrow' ? -this.imgWidth : this.imgWidth;
                    if(radioBtns?.length > 0){
                        this.checkSelectedRadio(radioBtns, arrow.id == 'goBackArrow' ? --this.currentImg : ++this.currentImg, carosello , false);
                    }
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

        if(radioBtns?.length > 0) {
            radioBtns.forEach((radio) => {
                radio.addEventListener('click', (e) => {
                    this.checkSelectedRadio(radioBtns, e.currentTarget.id, carosello, true)
                })
            })
        }
    }

    checkSelectedRadio(radioBtns, rank, carosello, isRadioButton = null) {
        const imgs = this.shadowRoot.querySelectorAll('.img img');

        if(!isRadioButton) {
            if(rank == -1) {
                this.currentImg = this.imglist.split(',').length - 1;
                rank = this.imglist.split(',').length - 1;
            } else if(rank == this.imglist.split(',').length) {
                this.currentImg = 0;
                rank = 0;
            }
        }

        radioBtns.forEach((radio, i) => {
            radio.checked = rank == radio.id;
            rank == radio.id ? radio.classList.add('no-cursor-pointer') : radio.classList.remove('no-cursor-pointer');
        })

        if(isRadioButton){
            carosello.classList.add("no-transition");
            carosello.scrollLeft = 0;
            if(rank == 0) {
                carosello.scrollLeft += this.isMobile ? 0 : (this.imglist.split(',').length - 2) * this.imgWidth;
            } else if(rank == this.imglist.split(',').length - 1){
                carosello.scrollLeft += this.isMobile ? (this.imglist.split(',').length - 1) * imgs[0].clientWidth : 2 * this.imgWidth;
            } else {
                carosello.scrollLeft += (this.isMobile ? rank : (rank - 1)) * imgs[0].clientWidth;
            }
            carosello.classList.remove("no-transition");
        }

        this.currentImg = rank;
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