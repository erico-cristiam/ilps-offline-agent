"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";

type Screen = "home" | "chat" | "learn" | "library";
type Source = { id: string; title: string; institution: string; authority: string; url: string };
type Message = { role: "assistant" | "user"; content: string; sources?: Source[]; mode?: "gemma" | "retrieval" };
type ModelState = "checking" | "connected" | "retrieval";

const suggestedQuestions = [
  "ILPF pode ajudar na cessação de um embargo ambiental?",
  "Como recuperar uma pastagem degradada?",
  "Árvores melhoram o conforto do gado?",
];

const lessons = [
  { id: "01", title: "Entendendo a ILPF", duration: "4 min", progress: 100 },
  { id: "02", title: "Diagnóstico da propriedade", duration: "6 min", progress: 65 },
  { id: "03", title: "Regularização e planejamento", duration: "8 min", progress: 0 },
];

const library = [
  { kind: "LEI", title: "Lei nº 12.651/2012", meta: "Planalto · fonte oficial" },
  { kind: "DEC", title: "Decreto nº 6.514/2008", meta: "Texto compilado · fonte oficial" },
  { kind: "PDF", title: "ILPF e cessação de embargo", meta: "Material da equipe · revisão pendente" },
  { kind: "TEC", title: "Fundamentos e aplicações da ILPF", meta: "Embrapa · referência técnica" },
  { kind: "ART", title: "Land-use and climate risks", meta: "Science Advances · referência científica" },
];

export default function Home() {
  const [screen, setScreen] = useState<Screen>("home");
  const [profileReady, setProfileReady] = useState(false);
  const [propertySize, setPropertySize] = useState("Até 50 hectares");
  const [activity, setActivity] = useState("Pecuária");
  const [question, setQuestion] = useState("");
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [modelState, setModelState] = useState<ModelState>("checking");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Olá! Sou a tutora AGROFLORA IA. Posso consultar a base local sobre ILPF, Amazônia e regularização ambiental." },
  ]);

  useEffect(() => {
    fetch("/api/chat")
      .then((response) => response.json())
      .then((data: { connected?: boolean }) => setModelState(data.connected ? "connected" : "retrieval"))
      .catch(() => setModelState("retrieval"));
  }, []);

  async function sendQuestion(value: string) {
    const trimmed = value.trim();
    if (!trimmed || loading) return;

    const userMessage: Message = { role: "user", content: trimmed };
    setMessages((current) => [...current, userMessage]);
    setQuestion("");
    setProfileReady(true);
    setScreen("chat");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: trimmed,
          profile: { propertySize, activity },
          history: messages.map(({ role, content }) => ({ role, content })),
        }),
      });
      const data = await response.json() as { answer?: string; sources?: Source[]; mode?: "gemma" | "retrieval"; error?: string };
      if (!response.ok || !data.answer) throw new Error(data.error ?? "Não foi possível consultar o tutor.");
      setModelState(data.mode === "gemma" ? "connected" : "retrieval");
      setMessages((current) => [...current, { role: "assistant", content: data.answer ?? "", sources: data.sources, mode: data.mode }]);
    } catch (error) {
      setMessages((current) => [...current, {
        role: "assistant",
        content: error instanceof Error ? error.message : "O tutor local não respondeu. Tente novamente.",
        mode: "retrieval",
      }]);
    } finally {
      setLoading(false);
    }
  }

  function submitQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendQuestion(question);
  }

  const statusLabel = modelState === "checking" ? "verificando modelo" : modelState === "connected" ? "Gemma conectado" : "consulta RAG local";

  return (
    <main className="prototype-stage">
      <aside className="concept-panel">
        <span className="concept-kicker">PROTÓTIPO MOBILE · ECO-HACK UFAC</span>
        <Image className="brand-cover" src="/agroflora-cover.jpeg" alt="AGROFLORA IA - conhecimento e capacitação ILPF na Amazônia" width={1440} height={768} priority />
        <h1>AGROFLORA IA</h1>
        <p>Conhecimento e capacitação em Integração Lavoura-Pecuária-Floresta para produtores da Amazônia.</p>
        <dl>
          <div><dt>Modelo local</dt><dd>Gemma 3n E2B</dd></div>
          <div><dt>Base consultável</dt><dd>Leis + Embrapa + ciência</dd></div>
          <div><dt>Destino</dt><dd>Celular Android offline</dd></div>
        </dl>
        <small>O protótipo usa Ollama no computador; o aplicativo final usará inferência no dispositivo.</small>
      </aside>

      <section className="phone" aria-label="Simulação do aplicativo AGROFLORA IA">
        <div className="phone-speaker" aria-hidden="true" />
        <div className="status-bar" aria-hidden="true"><span>9:41</span><span>● ◒ ▰</span></div>

        <div className="app-viewport">
          {screen === "home" && (
            <div className="screen home-screen">
              <header className="app-topbar">
                <div className="app-brand"><span>A</span><div><strong>AGROFLORA IA</strong><small>{statusLabel}</small></div></div>
                <button className="icon-button" aria-label="Abrir menu">•••</button>
              </header>

              <section className="welcome-block">
                <span className="eyebrow">BOM DIA</span>
                <h2>O que vamos cultivar de conhecimento hoje?</h2>
                <button className="ask-card" onClick={() => setScreen("chat")}>
                  <span className="ask-icon">✦</span>
                  <span><strong>Pergunte à tutora</strong><small>Consulte a base local de ILPF</small></span>
                  <b>→</b>
                </button>
              </section>

              <section className="home-section">
                <div className="section-heading"><h3>Continue aprendendo</h3><button onClick={() => setScreen("learn")}>Ver trilha</button></div>
                <button className="lesson-card" onClick={() => setScreen("learn")}>
                  <span className="lesson-number">02</span>
                  <span className="lesson-info"><small>TRILHA FUNDAMENTOS</small><strong>Diagnóstico da propriedade</strong><i><b style={{ width: "65%" }} /></i></span>
                  <span>›</span>
                </button>
              </section>

              <section className="home-section">
                <h3>Acesso rápido</h3>
                <div className="quick-grid">
                  <button onClick={() => void sendQuestion("Como recuperar uma pastagem degradada?")}><span>PA</span><strong>Pastagem</strong><small>Recuperação</small></button>
                  <button onClick={() => void sendQuestion("ILPF pode ajudar na cessação de um embargo ambiental?")}><span>LE</span><strong>Legislação</strong><small>Embargo e PRA</small></button>
                  <button onClick={() => setScreen("library")}><span>BI</span><strong>Biblioteca</strong><small>Fontes locais</small></button>
                </div>
              </section>

              <div className="offline-card"><span>✓</span><div><strong>Base disponível sem internet</strong><small>12 trechos selecionados neste dispositivo</small></div></div>
            </div>
          )}

          {screen === "chat" && (
            <div className="screen chat-screen">
              <header className="screen-header"><button onClick={() => setScreen("home")} aria-label="Voltar">←</button><div><strong>Tutora AGROFLORA</strong><small className={modelState === "connected" ? "online" : "retrieval"}><span /> {statusLabel}</small></div><button aria-label="Informações">i</button></header>
              {!profileReady ? (
                <section className="onboarding">
                  <span className="onboarding-step">1 de 2</span>
                  <h2>Antes de começar</h2>
                  <p>Conte um pouco sobre sua propriedade para receber explicações mais próximas da sua realidade.</p>
                  <label>Tamanho da propriedade<select value={propertySize} onChange={(event) => setPropertySize(event.target.value)}><option>Até 50 hectares</option><option>De 51 a 200 hectares</option><option>Mais de 200 hectares</option></select></label>
                  <label>Atividade principal<select value={activity} onChange={(event) => setActivity(event.target.value)}><option>Pecuária</option><option>Lavoura</option><option>Sistema misto</option><option>Ainda estou planejando</option></select></label>
                  <button className="app-primary" onClick={() => setProfileReady(true)}>Continuar</button>
                  <button className="text-button" onClick={() => setProfileReady(true)}>Pular por enquanto</button>
                </section>
              ) : (
                <>
                  <div className="profile-chip"><span>Perfil</span>{propertySize} · {activity}<button onClick={() => setProfileReady(false)}>Editar</button></div>
                  <div className="messages" aria-live="polite">
                    {messages.map((message, index) => (
                      <article className={`message ${message.role}`} key={`${message.role}-${index}`}>
                        <p>{message.content}</p>
                        {message.sources && message.sources.length > 0 && (
                          <div className="message-sources"><strong>Fontes recuperadas</strong>{message.sources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.id}>{source.title}<span>{source.institution}</span></a>)}</div>
                        )}
                        {message.mode && <small><strong>Modo</strong>{message.mode === "gemma" ? "Gemma 3n E2B + RAG" : "Consulta RAG (Gemma não iniciado)"}</small>}
                      </article>
                    ))}
                    {loading && <article className="message assistant typing"><span /><span /><span /></article>}
                  </div>
                  <div className="prompt-chips">{suggestedQuestions.map((item) => <button key={item} disabled={loading} onClick={() => void sendQuestion(item)}>{item}</button>)}</div>
                  <form className="chat-composer" onSubmit={submitQuestion}><label className="sr-only" htmlFor="question">Digite sua pergunta</label><input id="question" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Digite sua pergunta..." disabled={loading} /><button type="submit" aria-label="Enviar" disabled={loading}>↑</button></form>
                  <p className="prototype-note">Conteúdo educacional. Questões legais e agronômicas exigem validação profissional e do órgão competente.</p>
                </>
              )}
            </div>
          )}

          {screen === "learn" && (
            <div className="screen learn-screen">
              <header className="screen-title"><span className="eyebrow">MINHA TRILHA</span><h2>Fundamentos da ILPF</h2><p>Aprenda no seu ritmo. O progresso fica salvo no aparelho.</p></header>
              <div className="lesson-list">{lessons.map((lesson) => <article key={lesson.id}><span className={lesson.progress === 100 ? "done" : ""}>{lesson.progress === 100 ? "✓" : lesson.id}</span><div><small>{lesson.duration}</small><strong>{lesson.title}</strong><i><b style={{ width: `${lesson.progress}%` }} /></i></div><button aria-label={`Abrir ${lesson.title}`}>›</button></article>)}</div>
              <section className="quiz-box">
                <span className="quiz-label">REVISE O QUE APRENDEU</span>
                <h3>Qual é o primeiro passo antes de planejar um sistema ILPF?</h3>
                {["Escolher as espécies de árvores", "Diagnosticar a propriedade", "Comprar novos equipamentos"].map((option) => <button className={quizAnswer === option ? "selected" : ""} key={option} onClick={() => setQuizAnswer(option)}><span>{quizAnswer === option ? "●" : "○"}</span>{option}</button>)}
                {quizAnswer && <p className={quizAnswer === "Diagnosticar a propriedade" ? "correct" : "incorrect"}>{quizAnswer === "Diagnosticar a propriedade" ? "Correto. Solo, clima, estrutura e objetivos orientam as próximas decisões." : "Tente novamente. Antes de escolher componentes, precisamos compreender a propriedade."}</p>}
              </section>
            </div>
          )}

          {screen === "library" && (
            <div className="screen library-screen">
              <header className="screen-title"><span className="eyebrow">BIBLIOTECA LOCAL</span><h2>Fontes verificáveis</h2><p>Leis, referências técnicas e ciência preparadas para consulta offline.</p></header>
              <label className="search-field"><span>⌕</span><input aria-label="Buscar na biblioteca" placeholder="Buscar assunto ou palavra-chave" /></label>
              <div className="library-filter"><button className="active">Todos</button><button>Legislação</button><button>ILPF</button><button>Clima</button></div>
              <div className="document-list">{library.map((item) => <article key={item.title}><span>{item.kind}</span><div><strong>{item.title}</strong><small>{item.meta}</small></div><button aria-label={`Abrir ${item.title}`}>›</button></article>)}</div>
              <div className="storage-info"><span>✓</span><p><strong>12 trechos disponíveis</strong><small>Fontes classificadas por autoridade</small></p></div>
            </div>
          )}
        </div>

        <nav className="bottom-nav" aria-label="Navegação principal">
          <button className={screen === "home" ? "active" : ""} onClick={() => setScreen("home")} aria-current={screen === "home" ? "page" : undefined}><span>⌂</span>Início</button>
          <button className={screen === "chat" ? "active" : ""} onClick={() => setScreen("chat")} aria-current={screen === "chat" ? "page" : undefined}><span>✦</span>Tutora</button>
          <button className={screen === "learn" ? "active" : ""} onClick={() => setScreen("learn")} aria-current={screen === "learn" ? "page" : undefined}><span>✓</span>Trilha</button>
          <button className={screen === "library" ? "active" : ""} onClick={() => setScreen("library")} aria-current={screen === "library" ? "page" : undefined}><span>▤</span>Biblioteca</button>
        </nav>
        <div className="home-indicator" aria-hidden="true" />
      </section>
    </main>
  );
}
