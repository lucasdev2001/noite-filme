import { useState } from "react";
import "./App.css";
import { useEffect } from "react";
import "@picocss/pico";
import Nav from "./components/Nav";

function App() {
  //constantes em estado
  const [inputs, setInputs] = useState({});
  const [listaFilmes, setListaFilmes] = useState([]);
  const [filmesSorteados, setFilmesSorteados] = useState([]);
  const [mensagemValidacao, setMensagemValidacao] = useState(null);
  const [primeiroRender, setPrimeiroRender] = useState(true);

  //variaveis sem estado

  let intervalDado;

  //useEffects

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("listaFilmes"))) {
      setListaFilmes(JSON.parse(localStorage.getItem("listaFilmes")));
      setPrimeiroRender(false);
    } else {
      setPrimeiroRender(false);
      console.log("A lista estava vazia");
    }
  }, []);

  useEffect(() => {
    if (primeiroRender === false) {
      localStorage.setItem("listaFilmes", JSON.stringify(listaFilmes));
    }
    clearInterval(intervalDado);
  }, [listaFilmes]);

  //handlers

  const handleInputChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const handleAdicionarFilme = (e) => {
    const inputFilme = document.querySelector("#input_filme");
    if (inputFilme.value !== "") {
      setListaFilmes([...listaFilmes, inputs.input_filme]);
      inputFilme.value = "";
    } else {
      dispararMensagemValidacao("Você precisa dar um nome para o filme 😁");
    }
  };

  const handleRemoverFilme = (e) => {
    const id = e.target.id;
    setListaFilmes(listaFilmes.filter((filme) => filme !== id));
  };

  const handleDadoSortearHover = (e) => {
    const dado = e.target;
    intervalDado = setInterval(mudarImagem, 50);
    function mudarImagem() {
      let index = Math.floor(Math.random() * (7 - 1) + 1);
      dado.classList.value = `bi bi-dice-${index}-fill dice-icon`;
    }
  };

  const handleSorteio = (e) => {
    clearInterval(intervalDado);
    let index;
    for (let i = 0; i < 5; i++) {
      index = Math.floor(Math.random().toPrecision(7) * listaFilmes.length);
    }
    if (listaFilmes.length === 0) {
      dispararMensagemValidacao("Não consigo sortear uma lista vazia 😔");
    } else if (filmesSorteados.length >= 5) {
      dispararMensagemValidacao("Você realizou muitos sorteios 😵 🤯");
    } else {
      setFilmesSorteados((current) => [...current, listaFilmes[index]]);
      console.log(ListaFilmesSorteados);
    }
  };
  //funções genéricas

  function dispararMensagemValidacao(mensagem) {
    setMensagemValidacao(mensagem);
    setTimeout(() => {
      setMensagemValidacao(null);
    }, 5000);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  //componentes

  const ListaFilmes = (props) =>
    props.arrFilmes.length !== 0 &&
    props.arrFilmes.map((filme) => (
      <ol>
        <li>
          {filme}
          <a href="#remover">
            <i
              className="bi bi-x-circle-fill ol-close-icon"
              onClick={props.onRemoverFilme}
              id={filme}
            ></i>
          </a>
        </li>
      </ol>
    ));

  const ListaFilmesSorteados = (props) =>
    props.arrfilmesSorteados.length !== 0 ? (
      <center style={{ lineHeight: "1rem" }}>
        <button onClick={props.onLimparSorteados}>Limpar</button>
        {props.arrfilmesSorteados.map((filme) => (
          <h5>🎉 {filme} 🎉</h5>
        ))}
      </center>
    ) : (
      <img src="what-huh.gif" className="place-over-image" />
    );
  return (
    <div className="App">
      <Nav />
      <main className="container">
        <h1>Escolhedor de filmes-ilmes 🎥</h1>
        <div className="grid">
          <div>
            <input
              type="text"
              placeholder="nome do filme"
              onChange={handleInputChange}
              name="input_filme"
              id="input_filme"
              onKeyDown={(e) => {
                if (e.key === "Enter")
                  document.querySelector("#botao_adicionar").click();
              }}
            />
            <button onClick={handleAdicionarFilme} id="botao_adicionar">
              Adiconar filme
            </button>
            <ListaFilmes
              arrFilmes={listaFilmes}
              onRemoverFilme={handleRemoverFilme}
            />
            <center>
              <div style={{ display: "inline-block" }} className="shake">
                <a href="#sortear">
                  <i
                    className="bi bi-dice-5-fill dice-icon"
                    onMouseEnter={handleDadoSortearHover}
                    onMouseOut={() => {
                      clearInterval(intervalDado);
                    }}
                    onClick={handleSorteio}
                  ></i>
                </a>
              </div>
            </center>
          </div>
          <ListaFilmesSorteados
            arrfilmesSorteados={filmesSorteados}
            onLimparSorteados={() => {
              setFilmesSorteados([]);
            }}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
