// Utilitários de simulação humana
const delay = (ms) => new Promise(res => setTimeout(res, ms));
const randomDelay = (min = 3500, max = 8000) => delay(Math.floor(Math.random() * (max - min + 1) + min));

// Busca elementos DOM por texto limpo
function findElementByText(selector, textArray, exact = false) {
    const elements = Array.from(document.querySelectorAll(selector));
    return elements.find(el => {
        // Pega só o texto visível desse elemento
        const txt = el.textContent.trim().toLowerCase();
        // Ignorar SVG vazio ou elementos escondidos 
        if (!el.offsetParent && el.tagName !== 'svg') return false;

        for (let t of textArray) {
            if (exact ? txt === t.toLowerCase() : txt.includes(t.toLowerCase())) {
                return true;
            }
        }
        return false;
    });
}

// Polling (esperar até um elemento aparecer na tela)
async function awaitElement(selector, textArray, exact = false, timeout = 10000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
        const el = findElementByText(selector, textArray, exact);
        if (el) return el;
        await delay(500);
    }
    return null;
}

// Banco de memórias
async function jaInteragiuCom(tipo, id) {
    const data = await chrome.storage.local.get(['historicoBot']);
    const historico = data.historicoBot || { posts: [], perfis: [], dms: [] };
    return historico[tipo] && historico[tipo].includes(id);
}

async function registrarInteracao(tipo, id) {
    const data = await chrome.storage.local.get(['historicoBot']);
    const historico = data.historicoBot || { posts: [], perfis: [], dms: [] };
    if (!historico[tipo].includes(id)) {
        historico[tipo].push(id);
        await chrome.storage.local.set({ historicoBot: historico });
    }
}

function fecharModalPost() {
    const postCloseSvg = document.querySelector('svg[aria-label="Fechar"], svg[aria-label="Close"]');
    if (postCloseSvg && postCloseSvg.closest('[role="button"]') && window.location.href.includes('/p/')) {
        console.log("🤖 [InstaBot] Fechando modal do post.");
        postCloseSvg.closest('[role="button"]').click();
    }
}

function fecharChat() {
    // "Fechar bate-papo" ou ícone generalista de X perto da bolha da DM
    const closeBtns = Array.from(document.querySelectorAll('svg[aria-label^="Fechar"], svg[aria-label^="Close"]'));
    // Encontrar aquele que está dentro de um header fixo na parte inferior direita (chat box)
    for (let svg of closeBtns) {
        let btn = svg.closest('[role="button"]');
        if (btn) {
            console.log("🤖 [InstaBot] Tentando fechar provável chat bolha.");
            btn.click();
            return;
        }
    }
}

let isProcessingStep = false;

async function executeBotStep() {
    if (isProcessingStep) return;

    const { botActive, botConfig } = await chrome.storage.local.get(['botActive', 'botConfig']);
    if (!botActive) return;

    isProcessingStep = true;
    let deveRetomarCiclo = false;

    try {
        console.log("🤖 [InstaBot] ------------------------------");
        console.log("🤖 [InstaBot] Analisando tela atual...");
        await randomDelay(3000, 5000);

        const url = window.location.href;

        // ============================================
        // ESTÁGIO 1: TELA DA HASHTAG
        // ============================================
        if (url.includes('/explore/tags/') || url.includes('/explore/search/keyword/')) {
            console.log("🤖 [InstaBot] Na grade principal. Buscando foto intacta...");
            const posts = document.querySelectorAll('main a[href^="/p/"]');

            let postEncontradoBtn = null;
            for (let i = 0; i < posts.length; i++) {
                const postId = posts[i].getAttribute('href');
                if (!(await jaInteragiuCom('posts', postId))) {
                    postEncontradoBtn = posts[i];
                    break;
                }
            }

            if (postEncontradoBtn) {
                console.log("🤖 [InstaBot] > Abrindo novo post: " + postEncontradoBtn.getAttribute('href'));
                postEncontradoBtn.click();
            } else {
                console.log("🤖 [InstaBot] Todos os posts da vista já foram feitos. Rolando a tela pra baixo...");
                window.scrollBy(0, document.body.scrollHeight / 3);
                deveRetomarCiclo = true;
            }
        }

        // ============================================
        // ESTÁGIO 2: JANELA MODAL DO POST
        // ============================================
        else if (url.includes('/p/')) {
            const currentPostId = new URL(url).pathname;
            console.log(`🤖 [InstaBot] > Identificou post: ${currentPostId}`);

            if (await jaInteragiuCom('posts', currentPostId)) {
                console.warn("🤖 [InstaBot] Ops, este post já está marcado como feito. Fechando... ");
                fecharModalPost();
                deveRetomarCiclo = true;
                return; // Corta execução aqui
            }

            // 1. CURTIR
            console.log("🤖 [InstaBot] Etapa 1: Curtir.");
            const unlikeSvgs = document.querySelectorAll('svg[aria-label="Descurtir"], svg[aria-label="Unlike"]');
            if (unlikeSvgs.length > 0) {
                console.log("🤖 [InstaBot]   Já estava curtido. Pulo.");
            } else {
                const likeSvgs = Array.from(document.querySelectorAll('svg[aria-label="Curtir"], svg[aria-label="Like"]'));
                for (let svg of likeSvgs) {
                    const btn = svg.closest('[role="button"]');
                    if (btn) {
                        btn.click();
                        console.log("🤖 [InstaBot]   Coração Clicado!");
                        break;
                    }
                }
                await randomDelay(2000, 4000);
            }

            // 2. COMENTAR
            console.log("🤖 [InstaBot] Etapa 2: Comentar.");
            const corpoTexto = document.body.innerText;
            const fragmentoMeu = botConfig.commentText.substring(0, 15);

            if (corpoTexto.includes(fragmentoMeu)) {
                console.log("🤖 [InstaBot]   Meu comentário já parece estar presente ali na lista. Ignorando digitação.");
            } else {
                console.log("🤖 [InstaBot]   Procurando a caixa de textarea...");
                const commentBox = document.querySelector('textarea, div[contenteditable="true"][aria-label*="omentár"], div[contenteditable="true"][aria-label*="omment"]');

                if (commentBox) {
                    commentBox.focus();
                    console.log("🤖 [InstaBot]   Focado. Escrevendo como se fosse um usuário...");

                    // Força a inserção pelo teclado virtual (execCommand) pra engatilhar o React State
                    document.execCommand('insertText', false, botConfig.commentText);
                    commentBox.dispatchEvent(new Event('input', { bubbles: true }));
                    commentBox.dispatchEvent(new Event('change', { bubbles: true }));

                    await randomDelay(2000, 4000);

                    console.log("🤖 [InstaBot]   Buscando botão de Postar...");
                    // O botão as vezes é um <div> com role="button" ou a tag <button> 
                    const postBtn = await awaitElement('div[role="button"], button', ['postar', 'publicar', 'post'], true, 5000);

                    if (postBtn && !postBtn.hasAttribute('disabled') && postBtn.getAttribute('aria-disabled') !== "true") {
                        console.log("🤖 [InstaBot]   Botão visualizado e ativo. Clicando.");
                        postBtn.click();
                    } else {
                        console.log("🤖 [InstaBot]   Botão desabilitado/inexistente. Apelando pro Enter.");
                        commentBox.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, keyCode: 13, key: 'Enter' }));
                        commentBox.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, cancelable: true, keyCode: 13, key: 'Enter' }));
                    }
                    console.log("🤖 [InstaBot]   Etapa comentário finalizada.");
                    await randomDelay(3000, 5000);
                } else {
                    console.log("🤖 [InstaBot]   Atenção: A caixa de comentários do modal pode estar bloqueada nesta foto.");
                }
            }

            // 3. HOVER ABRIR USER CARD
            console.log("🤖 [InstaBot] Etapa 3: Hover no Nome de Usuário.");
            // Pega especificamente o Link do Header do POST
            const getHeaderLink = () => {
                const els = Array.from(document.querySelectorAll('article header a, div[role="dialog"] header a'));
                return els.find(a => a.textContent.trim().length > 0);
            };
            let profileLinkElement = getHeaderLink();

            if (profileLinkElement && !profileLinkElement.href.includes('/explore/')) {
                const perfilHandle = profileLinkElement.textContent.trim();
                console.log(`🤖 [InstaBot]   Injetando hover falso em @${perfilHandle}...`);

                // Mútiplos eventos pra simular mouse no React
                profileLinkElement.dispatchEvent(new MouseEvent('mouseover', { view: window, bubbles: true, cancelable: true }));
                profileLinkElement.dispatchEvent(new MouseEvent('mouseenter', { view: window, bubbles: true, cancelable: true }));
                profileLinkElement.dispatchEvent(new MouseEvent('mousemove', { view: window, bubbles: true, cancelable: true }));

                console.log("🤖 [InstaBot]   Aguardando o HoverCard aparecer na tela...");
                await randomDelay(4000, 6000);

                // 4. SEGUIR E CHAMAR NA DM DO HOVERCARD
                if (!(await jaInteragiuCom('dms', perfilHandle))) {
                    console.log("🤖 [InstaBot] Etapa 4: Interações do HoverCard.");

                    const followCardBtn = await awaitElement('div[role="button"] button, button', ['seguir', 'follow'], true, 3000);
                    if (followCardBtn) {
                        console.log("🤖 [InstaBot]   Clicando em Seguir.");
                        followCardBtn.click();
                        await randomDelay(2000, 4000);
                    } else {
                        console.log("🤖 [InstaBot]   Não achou o 'Seguir'. Provavelmente já nos seguimos.");
                    }

                    const dmCardBtn = await awaitElement('div[role="button"]', ['enviar mensagem', 'mensagem', 'message'], false, 3000);
                    if (dmCardBtn) {
                        console.log("🤖 [InstaBot]   Clicou para abrir o Chat (Botão Enviar Mensagem).");
                        dmCardBtn.click();
                        await randomDelay(3000, 5000);

                        // IMEDIATAMENTE APÓS ABRIR O CHAT: Fechar o modal do Post!
                        console.log("🤖 [InstaBot] Etapa 5: Fechar Post para exibir chat.");
                        fecharModalPost();
                        deveRetomarCiclo = true;

                        await randomDelay(1500, 3000);

                        // Agora que estamos "por cima" da hashtag feed, manda a mensagem
                        console.log("🤖 [InstaBot] Etapa 6: Processar Digitação na DM.");

                        let chatBoxInput = document.querySelector('div[contenteditable="true"][role="textbox"]');
                        let retries = 0;
                        while (!chatBoxInput && retries < 4) {
                            await randomDelay(1000, 2000);
                            chatBoxInput = document.querySelector('div[contenteditable="true"][role="textbox"]');
                            retries++;
                        }

                        if (chatBoxInput) {
                            const dmSnippet = botConfig.dmText.substring(0, 15);
                            if (document.body.innerText.includes(dmSnippet)) {
                                console.warn(`🤖 [InstaBot]   Aviso: Parte do texto da sua DM já era visível neste chat. Cancela envio duplicado.`);
                            } else {
                                console.log("🤖 [InstaBot]   Focando e digitando mensagem pela janela secundária...");
                                chatBoxInput.focus();
                                document.execCommand('insertText', false, botConfig.dmText);
                                await randomDelay(2000, 3000);

                                const sendDMBtn = await awaitElement('div[role="button"]:not([aria-disabled="true"])', ['enviar', 'send'], true, 3000);
                                if (sendDMBtn) {
                                    sendDMBtn.click();
                                    console.log(`🤖 [InstaBot]   Mensagem ENVIADA a @${perfilHandle}!`);
                                } else {
                                    console.log(`🤖 [InstaBot]   Botão Enviar não captado. Apelando para Enter...`);
                                    chatBoxInput.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, keyCode: 13, key: 'Enter' }));
                                    chatBoxInput.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, cancelable: true, keyCode: 13, key: 'Enter' }));
                                }
                            }
                            await registrarInteracao('dms', perfilHandle);
                            await randomDelay(3000, 5000);

                            console.log("🤖 [InstaBot] Etapa 7: Fechando painel de Chat.");
                            fecharChat();
                        } else {
                            console.log("🤖 [InstaBot]   A caixa de texto do Chat secundário não carregou ou não é compatível.");
                            fecharChat();
                        }
                    } else {
                        console.log("🤖 [InstaBot]   Botão de mensagem ausente no HoverCard desse user.");
                        fecharModalPost();
                        deveRetomarCiclo = true;
                    }
                } else {
                    console.log(`🤖 [InstaBot]   Usuário @${perfilHandle} já está na lista dos DMed historicos. Ignorando.`);
                    fecharModalPost();
                    deveRetomarCiclo = true;
                }
                await registrarInteracao('posts', currentPostId);
                console.log("🤖 [InstaBot] --- Post Completado ---");

            } else {
                console.log("🤖 [InstaBot] O Modal do Post não renderizou o cabeçalho direito (User Header Link). Fechando.");
                fecharModalPost();
                deveRetomarCiclo = true;
            }
        }
    } catch (e) {
        console.error("🤖 [InstaBot] Falha critica no Passo do Script: ", e);
    } finally {
        isProcessingStep = false;
        // Permite re-trigger quando a gente fez o modal_close forçado 
        // e a URL devolveu pra "explorar" (o observer fica cego)
        if (botActive && deveRetomarCiclo) {
            console.log("🤖 [InstaBot] Redirecionando a mira pro Feed...");
            setTimeout(executeBotStep, 4000);
        }
    }
}

// Ouvir mudanças de rotas SPA
let lastUrl = window.location.href;
new MutationObserver(() => {
    const currentUrl = window.location.href;
    if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        setTimeout(executeBotStep, 3500);
    }
}).observe(document, { subtree: true, childList: true });

// Acionamento pela Extensão recarregada
window.addEventListener('load', () => { setTimeout(executeBotStep, 3500); });
