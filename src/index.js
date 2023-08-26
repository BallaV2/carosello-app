const accessKey = 'Xp_zcpeEMEhK1KX1iBIrwsB0T9hh4sH2AoN2fMS29NA';
const basePath = 'https://api.unsplash.com';
const nImmagini = 9;

/* mock */
const urlsMock = [
    "https://images.unsplash.com/photo-1674867374003-f7b0a45523b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0OTMzMDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2OTMwNjE1MTN8&ixlib=rb-4.0.3&q=80&w=400", 
    "https://images.unsplash.com/photo-1688511460213-b0b3d4e2f902?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0OTMzMDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2OTMwNjE1MTN8&ixlib=rb-4.0.3&q=80&w=400", 
    "https://images.unsplash.com/photo-1690141001405-456018efb3f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0OTMzMDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2OTMwNjE1MTN8&ixlib=rb-4.0.3&q=80&w=400", 
    "https://images.unsplash.com/photo-1690800108768-efdcb2953cd9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0OTMzMDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2OTMwNjE1MTN8&ixlib=rb-4.0.3&q=80&w=400", 
    "https://images.unsplash.com/photo-1691308138375-1e887021be52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0OTMzMDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2OTMwNjE1MTN8&ixlib=rb-4.0.3&q=80&w=400", 
    "https://images.unsplash.com/photo-1691491433956-0531f5a03710?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0OTMzMDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2OTMwNjE1MTN8&ixlib=rb-4.0.3&q=80&w=400", 
    "https://images.unsplash.com/photo-1691862187686-481917f9d6d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0OTMzMDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2OTMwNjE1MTN8&ixlib=rb-4.0.3&q=80&w=400", 
    "https://images.unsplash.com/photo-1692007081099-eacaf058af14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0OTMzMDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2OTMwNjE1MTN8&ixlib=rb-4.0.3&q=80&w=400", 
    "https://images.unsplash.com/photo-1692060199891-a5372468e26a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0OTMzMDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2OTMwNjE1MTN8&ixlib=rb-4.0.3&q=80&w=400",
]

/* axios.get(basePath + '/photos/random' + `/?count=${nImmagini}&client_id=${accessKey}`).then((res) => {
    console.info("Response getImmagini: ", res);
    const urls = res?.data.map((item) => item?.urls?.small);
    const carosello = document.getElementById('my__component');
    carosello.setAttribute('imglist', urls);
    console.log(urls);
}).catch((error) => {
    console.error('Errore durante il recupero delle immagini: ', error);
}) */


setTimeout(() => {
    const carosello = document.getElementById('my__component');
    carosello.setAttribute('imglist', urlsMock);
}, 200)