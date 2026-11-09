// Número da Fran (somente dígitos com DDI, ex.: 5545999999999). Vazio = o WhatsApp pede para escolher o contato.
var WA_NUMBER = "";
var SERVICES = [
    ["Extensão de cílios", "Fios aplicados um a um para alongar e valorizar seu olhar com leveza.", "A partir de R$ 140"],
    ["Manutenção", "Reposição cuidadosa dos fios para manter o efeito bonito e uniforme.", "A partir de R$ 90"],
    ["Volume brasileiro", "Volume marcante e leve com fios em formato especial para um olhar expressivo.", "A partir de R$ 160"],
    ["Volume personalizado", "Mapeamento exclusivo, criado de acordo com seu formato de olhos e estilo.", "Consultar valor"],
    ["Volume híbrido", "Combinação de técnica clássica e volume para um resultado texturizado e elegante.", "A partir de R$ 150"],
    ["Design de sobrancelhas", "Design harmônico e natural, respeitando os traços únicos do seu rosto.", "A partir de R$ 45"]
];
function wa(msg) { return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg) }
document.getElementById("svc").innerHTML = SERVICES.map(function (s) {
    return '<article class="card"><h3>' + s[0] + '</h3><p>' + s[1] + '</p><div class="foot"><span class="price">' + s[2] + '</span><a class="btn ghost wa" data-msg="Olá, Fran! Quero agendar: ' + s[0] + '." href="#" target="_blank" rel="noopener" aria-label="Agendar ' + s[0] + '">Agendar</a></div></article>'
}).join("");
document.querySelectorAll(".wa").forEach(function (a) { a.href = wa(a.dataset.msg || "Olá, Fran!") });

// Cílios gerados ao longo da pálpebra (quadrática 30,170 → 300,20 → 570,170)
var g = document.getElementById("lashes"), NS = "http://www.w3.org/2000/svg", N = 34;
function q(t) { var u = 1 - t; return [u * u * 30 + 2 * u * t * 300 + t * t * 570, u * u * 170 + 2 * u * t * 20 + t * t * 170] }
for (var i = 0; i < N; i++) {
    var t = .05 + .9 * i / (N - 1), p = q(t), p2 = q(Math.min(t + .01, 1)), dx = p2[0] - p[0], dy = p2[1] - p[1], l = Math.hypot(dx, dy), nx = dy / l, ny = -dx / l;
    var len = (14 + 30 * Math.sin(Math.PI * t) ** .8) * (.85 + .3 * ((i * 37) % 7) / 7), bend = (t - .5) * 26;
    var x2 = p[0] + nx * len + bend, y2 = p[1] + ny * len, cx = p[0] + nx * len * .5 + bend * .2, cy = p[1] + ny * len * .5;
    var el = document.createElementNS(NS, "path"); el.setAttribute("class", "lash");
    el.setAttribute("d", "M" + p[0].toFixed(1) + " " + p[1].toFixed(1) + " Q" + cx.toFixed(1) + " " + cy.toFixed(1) + " " + x2.toFixed(1) + " " + y2.toFixed(1)); g.appendChild(el);
}

var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
if (window.gsap && window.ScrollTrigger && !reduce) {
    gsap.registerPlugin(ScrollTrigger);
    if (window.Lenis) {
        var lenis = new Lenis({ lerp: .1 });
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add(function (t) { lenis.raf(t * 1000) }); gsap.ticker.lagSmoothing(0);
        document.querySelectorAll('a[href^="#"]').forEach(function (a) { a.addEventListener("click", function (e) { var id = a.getAttribute("href"); if (id.length > 1 && document.querySelector(id)) { e.preventDefault(); lenis.scrollTo(id, { offset: -64 }) } }) });
    }
    var seen = false; try { seen = sessionStorage.getItem("fran-intro") } catch (e) { }
    var lid = document.getElementById("lid"), L = lid.getTotalLength();
    var tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    if (!seen) {
        gsap.set(lid, { strokeDasharray: L, strokeDashoffset: L });
        gsap.set(".lash", { scaleY: 0 });
        gsap.set(".iris,.pupil", { opacity: 0, scale: .6, transformOrigin: "50% 50%" });
        tl.to(lid, { strokeDashoffset: 0, duration: .9, ease: "power2.inOut" })
            .to(".iris,.pupil", { opacity: 1, scale: 1, duration: .6 }, "-=.3")
            .to(".lash", { scaleY: 1, duration: .5, stagger: .015 }, "-=.5")
            .from("h1 .ln span", { yPercent: 110, duration: .9, stagger: .08 }, "-=.7")
            .from("[data-in],header", { opacity: 0, y: 14, duration: .6, stagger: .08 }, "-=.4");
        try { sessionStorage.setItem("fran-intro", "1") } catch (e) { }
    } else {
        tl.from("h1 .ln span", { yPercent: 110, duration: .7, stagger: .06 }).from("[data-in]", { opacity: 0, y: 10, duration: .5, stagger: .06 }, "-=.4");
    }
    // Cílios "respiram" com o scroll no hero
    gsap.to(".eye", { scaleY: .82, transformOrigin: "50% 100%", ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: .6 } });
    gsap.to(".lash", { scaleY: 1.25, stagger: { each: .01, from: "center" }, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: .6 } });
    // Cards de serviço
    gsap.from(".card", { opacity: 0, y: 28, duration: .7, stagger: .08, ease: "power3.out", scrollTrigger: { trigger: "#svc", start: "top 82%" } });
    // Foto do Sobre: parallax leve
    gsap.fromTo("#par", { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: ".about", start: "top bottom", end: "bottom top", scrub: true } });
    // Contagem do selo
    var o = { v: 0 }, c = document.getElementById("cnt");
    ScrollTrigger.create({ trigger: ".about", start: "top 70%", once: true, onEnter: function () { gsap.to(o, { v: 4, duration: 1.2, ease: "power2.out", onUpdate: function () { c.textContent = Math.round(o.v) } }) } });
    // Depoimentos
    gsap.from(".testi blockquote", { opacity: 0, y: 24, duration: .7, stagger: .1, ease: "power3.out", scrollTrigger: { trigger: ".testi", start: "top 85%" } });
    // Cursor e botão magnético (apenas mouse)
    if (matchMedia("(pointer:fine)").matches) {
        var cur = document.getElementById("cur"), cx = gsap.quickTo(cur, "x", { duration: .25 }), cy = gsap.quickTo(cur, "y", { duration: .25 });
        addEventListener("mousemove", function (e) { cur.style.opacity = 1; cx(e.clientX); cy(e.clientY) });
        document.querySelectorAll("a,button").forEach(function (el) {
            el.addEventListener("mouseenter", function () { gsap.to(cur, { scale: 1.6, duration: .25 }) });
            el.addEventListener("mouseleave", function () { gsap.to(cur, { scale: 1, duration: .25 }) });
        });
        document.querySelectorAll(".mag").forEach(function (b) {
            var mx = gsap.quickTo(b, "x", { duration: .4, ease: "power3.out" }), my = gsap.quickTo(b, "y", { duration: .4, ease: "power3.out" });
            b.addEventListener("mousemove", function (e) { var r = b.getBoundingClientRect(); mx((e.clientX - r.left - r.width / 2) * .25); my((e.clientY - r.top - r.height / 2) * .25) });
            b.addEventListener("mouseleave", function () { mx(0); my(0) });
        });
    }
}