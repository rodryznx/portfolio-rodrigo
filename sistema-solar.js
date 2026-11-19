// Raios e distâncias em escala ilustrativa para os oito planetas caberem na tela.
const universo = document.querySelector('.paisagem');
const ctx = universo.getContext('2d');
if (ctx) iniciarSistemaSolar();

function iniciarSistemaSolar() {
    const corpos = [
        ['Sol',0,40,'#ffbe4e',0], ['Mercúrio',61,4,'#b9a89e',2.1],
        ['Vênus',89,8,'#e2b782',4.4], ['Terra',122,10,'#437ba9',.6],
        ['Marte',154,7,'#c77853',2.8], ['Júpiter',210,27,'#d7ac91',5.4],
        ['Saturno',269,22,'#dbbf91',.66], ['Urano',321,13,'#93d5d8',3.3],
        ['Netuno',365,13,'#617fdd',4.9]
    ];
    const preferencias = matchMedia('(prefers-reduced-motion: reduce)');
    const links = [...document.querySelectorAll('.menu ul a')];
    const secoes = links.map(link => document.querySelector(link.hash));
    const estrelas = document.createElement('canvas');
    let largura, altura, escala, tempo = 0, progresso = 0, quadro = 0, anterior = 0;

    function ruido(n) {
        const v = Math.sin(n*91.71 + 17.23)*47652.13;
        return v-Math.floor(v);
    }
    // Textura calculada sobre uma esfera. Latitude, longitude e luz dão volume.
    function esfera([nome,,,cor]) {
        const sprite = document.createElement('canvas');
        const n = 176;
        sprite.width = sprite.height = n;
        const pintura = sprite.getContext('2d');
        const imagem = pintura.createImageData(n,n);
        const base = cor.slice(1).match(/../g).map(h => parseInt(h,16));
        for (let y=0;y<n;y++) for (let x=0;x<n;x++) {
            const u=(2*x+1)/n-1, v=(2*y+1)/n-1, r=u*u+v*v;
            if (r>=1) continue;
            const z=Math.sqrt(1-r), lon=Math.atan2(u,z), lat=Math.asin(v);
            const redemoinho=Math.sin(8*lon+4*lat)+.5*Math.sin(11*lat-5*lon);
            const faixa=Math.sin(31*lat+redemoinho*.5);
            let tinta=base, textura=.98+.045*redemoinho;
            if (nome==='Júpiter' || nome==='Saturno') textura+=.13*faixa+.065*Math.sin(67*lat+redemoinho);
            if (nome==='Terra') {
                if (Math.sin(5*lon+3*lat)+Math.cos(8*lat-2*lon)+.3*redemoinho>.38) tinta=[114,152,109];
                if (Math.sin(16*lat+4*redemoinho)> .87 || Math.abs(v)>.93) tinta=[209,225,223];
            }
            if (nome==='Sol') textura+=.085*Math.sin(33*lat+5*redemoinho)+.06*ruido(x+y*n);
            const luz=nome==='Sol' ? .85+.2*z : .26+.82*Math.max(0,-.58*u-.38*v+.70*z);
            const i=(y*n+x)*4;
            for (let c=0;c<3;c++) imagem.data[i+c]=tinta[c]*luz*textura;
            imagem.data[i+3]=Math.min(255,(1-r)*n*200);
        }
        pintura.putImageData(imagem,0,0);
        return sprite;
    }
    const texturas=corpos.map(esfera);

    // O céu é desenhado uma vez por tamanho de janela.
    function pintarCeu() {
        estrelas.width=largura;
        estrelas.height=altura;
        const ceu=estrelas.getContext('2d');
        ceu.fillStyle='#080a1c';
        ceu.fillRect(0,0,largura,altura);
        for (let i=0;i<68;i++) {
            const x=ruido(i+22)*largura;
            const y=altura*(.85-.7*x/largura+(ruido(i+100)-.5)*.40);
            const r=(.06+.17*ruido(i+7))*Math.min(largura,altura);
            const nuvem=ceu.createRadialGradient(x,y,0,x,y,r);
            nuvem.addColorStop(0,i%3 ? 'rgba(117,79,164,.13)' : 'rgba(64,113,166,.16)');
            nuvem.addColorStop(1,'rgba(73,48,120,0)');
            ceu.fillStyle=nuvem;
            ceu.fillRect(x-r,y-r,r*2,r*2);
        }
        for (let i=0;i<Math.min(3200,largura*altura/265);i++) {
            const x=ruido(i+150)*largura;
            const y=i%2 ? ruido(i+5030)*altura : altura*(.85-.7*x/largura+(ruido(i+903)-.5)*.36);
            const r=.26+ruido(i+199)**4*1.15;
            ceu.fillStyle='rgba(218,223,255,'+(.22+.65*ruido(i+301))+')';
            ceu.beginPath(); ceu.arc(x,y,r,0,2*Math.PI); ceu.fill();
        }
    }
    function desenhar() {
        ctx.drawImage(estrelas,0,0);
        const compacto=largura<761;
        const centroX=largura*(compacto ? .56 : .66);
        const centroY=altura*(compacto ? .30 : .49);
        const pos=preferencias.matches ? 0 : progresso;
        const giro=-.30+.21*pos;
        const raio=escala*(1+.10*pos);
        ctx.save();
        ctx.translate(centroX,centroY);
        ctx.rotate(giro);
        ctx.strokeStyle='rgba(195,192,235,.26)';
        ctx.lineWidth=.8;
        for (const [,orbita] of corpos.slice(1)) {
            ctx.beginPath(); ctx.ellipse(0,0,orbita*raio,orbita*raio*.53,0,0,Math.PI*2); ctx.stroke();
        }
        const visiveis=corpos.map(([,orbita,tamanho,,fase],i) => {
            const a=fase+tempo*(i ? .046/Math.sqrt(i) : 0)+pos*.65;
            const z=orbita*Math.sin(a);
            return {i,z,x:orbita*Math.cos(a)*raio,y:z*.53*raio,r:tamanho*raio*(1+z/2000)};
        }).sort((a,b)=>a.z-b.z);
        for (const {i,x,y,r} of visiveis) {
            ctx.save(); ctx.translate(x,y);
            if (i===0) {
                const halo=ctx.createRadialGradient(0,0,r*.78,0,0,r*2.6);
                halo.addColorStop(0,'#ffe3a2'); halo.addColorStop(.27,'#ffb74585'); halo.addColorStop(1,'#d6701600');
                ctx.fillStyle=halo; ctx.fillRect(-r*2.6,-r*2.6,r*5.2,r*5.2);
            }
            function aneis(inicio,fim) {
                for (let j=0;j<6;j++) {
                    ctx.strokeStyle=['#dbc497','#8c7d70','#c2ae93'][j%3];
                    ctx.lineWidth=r*.052; ctx.beginPath();
                    ctx.ellipse(0,0,r*(1.32+j*.092),r*(.27+j*.021),0,inicio,fim); ctx.stroke();
                }
            }
            if (i===6) aneis(Math.PI,2*Math.PI);
            ctx.drawImage(texturas[i],-r,-r,2*r,2*r);
            if (i===6) aneis(0,Math.PI);
            ctx.restore();
        }
        ctx.restore();
    }
    function animar(agora) {
        quadro=0;
        if (document.hidden || preferencias.matches) return;
        if (agora-anterior>=32) {
            tempo+=Math.min(agora-anterior,80)/1000;
            anterior=agora;
            desenhar();
        }
        quadro=requestAnimationFrame(animar);
    }
    function retomar() {
        cancelAnimationFrame(quadro);
        desenhar();
        if (!document.hidden && !preferencias.matches) quadro=requestAnimationFrame(animar);
    }
    function ajustar() {
        largura=universo.clientWidth; altura=universo.clientHeight;
        const densidade=Math.min(devicePixelRatio,2);
        universo.width=Math.round(largura*densidade); universo.height=Math.round(altura*densidade);
        ctx.setTransform(densidade,0,0,densidade,0,0);
        escala=Math.min(largura/(largura<761 ? 670 : 925),altura*.004);
        pintarCeu(); retomar();
    }
    function acompanhar() {
        progresso=Math.min(1,Math.max(0,scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)));
        let atual=0;
        secoes.forEach((s,i)=>{ if (s.getBoundingClientRect().top<innerHeight*.48) atual=i; });
        links.forEach((link,i)=>{
            if (i===atual) link.setAttribute('aria-current','location');
            else link.removeAttribute('aria-current');
        });
    }
    new ResizeObserver(ajustar).observe(universo);
    preferencias.addEventListener('change',retomar);
    document.addEventListener('visibilitychange',retomar);
    window.addEventListener('scroll',acompanhar,{passive:true});
    acompanhar(); ajustar();
}
