
var WA_NUMBER = "554584311691";

var IMG = {
    hero: "img/fran-hero.jpg",
    fran: "img/fran.jpg",
    work: ["img/trabalho-1.jpg", "img/trabalho-2.jpg", "img/trabalho-3.jpg", "img/trabalho-4.jpg", "img/trabalho-5.jpg"],
    before: "img/antes.jpg",
    after: "img/depois.jpg"
};
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

(function () {
    var $ = function (id) { return document.getElementById(id) },
        fine = matchMedia("(pointer:fine)").matches,
        reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Imagens com carregamento preguiçoso; só substituem o placeholder se o arquivo existir
    var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
            if (!e.isIntersecting) return; io.unobserve(e.target);
            var b = e.target, d = b._d, im = new Image(); im.alt = d[1]; im.decoding = "async";
            im.onload = function () { b.appendChild(im); b.classList.add("has") }; im.src = d[0];
        });
    }, { rootMargin: "300px" });
    function put(box, src, alt) { if (box && src) { box._d = [src, alt]; io.observe(box) } }
    put($("hph"), IMG.hero, "Fran, especialista em cílios e sobrancelhas");
    put($("par"), IMG.fran, "Fran atendendo uma cliente");
    document.querySelectorAll(".rail figure").forEach(function (f, i) { put(f, IMG.work[i], "Trabalho de cílios " + (i + 1)) });
    put($("cb"), IMG.before, "Olhar antes do procedimento");
    put($("ca"), IMG.after, "Olhar depois do procedimento");

    // Brilho dourado que segue o mouse nos cards
    if (fine) document.querySelectorAll(".card").forEach(function (c) {
        c.addEventListener("pointermove", function (e) { var r = c.getBoundingClientRect(); c.style.setProperty("--mx", (e.clientX - r.left) + "px"); c.style.setProperty("--my", (e.clientY - r.top) + "px") });
    });

    // Foto do hero inclina levemente com o mouse
    var hp = $("hph");
    if (fine && !reduce) {
        hp.addEventListener("pointermove", function (e) { var r = hp.getBoundingClientRect(); hp.style.transform = "perspective(900px) rotateY(" + (((e.clientX - r.left) / r.width - .5) * 8).toFixed(2) + "deg) rotateX(" + ((.5 - (e.clientY - r.top) / r.height) * 8).toFixed(2) + "deg)" });
        hp.addEventListener("pointerleave", function () { hp.style.transform = "" });
    }

    // Galeria: contador, setas e arrastar com o mouse
    var rail = document.querySelector(".rail"), figs = rail.children, gc = $("gc"), step = function () { return figs[0].offsetWidth + 14 };
    function upd() { gc.textContent = ("0" + (Math.min(figs.length - 1, Math.round(rail.scrollLeft / step())) + 1)).slice(-2) + " / 0" + figs.length }
    rail.addEventListener("scroll", upd, { passive: true });
    $("gp").onclick = function () { rail.scrollBy({ left: -step(), behavior: "smooth" }) };
    $("gn").onclick = function () { rail.scrollBy({ left: step(), behavior: "smooth" }) };
    rail.addEventListener("keydown", function (e) { if (e.key === "ArrowRight") $("gn").click(); if (e.key === "ArrowLeft") $("gp").click() });
    var down = false, sx = 0, sl = 0;
    rail.addEventListener("pointerdown", function (e) { if (e.pointerType !== "mouse") return; down = true; sx = e.clientX; sl = rail.scrollLeft; rail.classList.add("drag"); rail.style.scrollSnapType = "none" });
    addEventListener("pointermove", function (e) { if (down) rail.scrollLeft = sl - (e.clientX - sx) });
    addEventListener("pointerup", function () { if (!down) return; down = false; rail.classList.remove("drag"); rail.style.scrollSnapType = "" });

    // Antes e depois (cortina)
    var cmp = $("cmp"); $("rng").addEventListener("input", function (e) { cmp.style.setProperty("--p", e.target.value + "%") });

    // Briefing que monta a mensagem do WhatsApp
    var G = [["Procedimento", SERVICES.map(function (x) { return x[0] })], ["Ocasião", ["Dia a dia", "Noiva", "Festa", "Evento"]], ["Efeito", ["Natural", "Marcante", "Glam"]]], br = $("brief"), html = "";
    G.forEach(function (g, i) {
        html += '<fieldset><legend>' + g[0] + '</legend><div class="chips">' + g[1].map(function (v) { return '<label><input type="radio" name="g' + i + '" value="' + v + '"><span>' + v + '</span></label>' }).join("") + '</div></fieldset>';
    });
    br.innerHTML = html + '<label class="nm">Seu nome<input id="bn" autocomplete="given-name"></label>';
    function msg() {
        var v = function (i) { var c = br.querySelector('input[name="g' + i + '"]:checked'); return c ? c.value : "" }, n = $("bn").value.trim();
        var m = "Olá, Fran!" + (n ? " Me chamo " + n + "." : "") + " Quero agendar" + (v(0) ? ": " + v(0) : " um horário") + ".";
        if (v(1)) m += " Ocasião: " + v(1) + "."; if (v(2)) m += " Efeito desejado: " + v(2) + ".";
        $("bgo").href = wa(m);
    }
    br.addEventListener("input", msg); msg();

    // Cursor personalizado e botões magnéticos (apenas mouse)
    if (window.gsap && fine && !reduce) {
        var cur = $("cur"), cx = gsap.quickTo(cur, "x", { duration: .25 }), cy = gsap.quickTo(cur, "y", { duration: .25 });
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
})();