import { useState } from "react";
import "./App.css";
import { useEffect } from "react";

function App() {
  //constantes em estado
  const [inputs, setInputs] = useState({});
  const [listaFilmes, setListaFilmes] = useState([]);
  const [filmesSorteados, setFilmesSorteados] = useState([]);
  const [mensagemValidacao, setMensagemValidacao] = useState(null);
  const [primeiroRender, setPrimeiroRender] = useState(true);

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
  //handlers

  useEffect(() => {
    if (primeiroRender === false) {
      localStorage.setItem("listaFilmes", JSON.stringify(listaFilmes));
    }
  }, [listaFilmes]);

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
      localStorage.setItem("listaFilmes", JSON.stringify(listaFilmes));
      inputFilme.value = "";
    } else {
      setMensagemValidacao("Você precisa dar um nome para o filme 😁");
      setTimeout(() => {
        setMensagemValidacao(null);
      }, 5000);
    }
  };

  const handleRemoverFilme = (e) => {
    const id = e.target.id;
    setListaFilmes(listaFilmes.filter((filme) => filme !== id));
    localStorage.setItem("listaFilmes", listaFilmes);
  };

  const handleKeyPress = (e) => {
    const { key } = e;
    if (key === "Enter") document.querySelector("#botao_adicionar").click();
  };

  const handleDadoSortearHover = (e) => {
    const imagemDado = e.target;
    const intervalID = setInterval(mudarImagem, 100);
    imagemDado.classList.add("shake");
    function mudarImagem() {
      let index = Math.floor(Math.random() * (7 - 1) + 1);
      imagemDado.src = `${import.meta.env.BASE_URL}/dice-${index}-fill.svg`;

      imagemDado.classList.toggle("bg-primary");
    }
    imagemDado.addEventListener("mouseout", () => {
      clearInterval(intervalID);
      imagemDado.classList.toggle("shake");
      imagemDado.classList.remove("bg-primary");
    });
    imagemDado.addEventListener("click", () => {
      clearInterval(intervalID);
      imagemDado.classList.remove("shake");
      imagemDado.classList.add("bg-primary");
    });
  };

  const handleSorteio = () => {
    let index;
    for (let i = 0; i < 5; i++) {
      index = Math.floor(Math.random().toPrecision(7) * listaFilmes.length);
    }
    // setFilmesSorteados((current) => [...current, listaFilmes[index]]);
    if (listaFilmes.length === 0) {
      setMensagemValidacao("Não consigo sortear uma lista vazia 😔");
      setTimeout(() => {
        setMensagemValidacao(null);
      }, 5000);
    } else if (filmesSorteados.length >= 5) {
      setMensagemValidacao("Você realizou muitos sorteios 😵 🤯");
      setTimeout(() => {
        setMensagemValidacao(null);
      }, 5000);
    } else {
      setFilmesSorteados((current) => [...current, listaFilmes[index]]);
    }
  };

  //componentes

  const ItemFilme = (props) => {
    return (
      <>
        <li className="list-group-item p-3 mb-3">
          {props.filme}
          <button
            type="button"
            className="btn-close position-absolute top-50 end-0 translate-middle-y me-3"
            aria-label="Close"
            id={props.id}
            onClick={handleRemoverFilme}
          ></button>
        </li>
      </>
    );
  };

  const MensagemValidacao = (props) => {
    return (
      <div className="alert alert-warning" role="alert">
        {props.mensagem}
      </div>
    );
  };

  const FilmeSorteado = (props) => {
    return (
      <>
        <div className="p-xl-0 p-3">
          <span className="fs-3">🎉</span>
          <span className="lead flex-fill">{props.filme}</span>
          <span className="fs-3">🎉</span>
          <br />
        </div>
      </>
    );
  };

  return (
    <div className="App">
      <div className="container-lg container-fluid p-xl-5">
        <div className="d-flex row">
          <div className="col-xl-6 flex-xl-fill">
            <h1 className="mb-3 text-center text-xl-start">
              Escolhedor de filmes-ilmes
              <span className="d-xl-inline d-none">🎥</span>
            </h1>
          </div>
          <div className="col-xl-5">
            {mensagemValidacao && (
              <MensagemValidacao mensagem={mensagemValidacao} />
            )}
          </div>
        </div>
        <div className="d-flex row">
          <div className="col-xl-5 order-xl-2 text-center text-xl-start border rounded-3">
            <div>
              <div className="d-grid gap-2 mb-3 mt-3">
                <button
                  type="button"
                  name=""
                  id=""
                  className="btn btn-primary"
                  onClick={() => {
                    setFilmesSorteados([]);
                  }}
                >
                  limpar
                </button>
              </div>
            </div>
            {filmesSorteados.length === 0 ? (
              <div>
                <p className="text-secondary text-center">
                  nenhum filme foi sorteado ainda
                </p>
                <img
                  src={import.meta.env.BASE_URL + "/what-huh.gif"}
                  className="img-fluid rounded-3 mb-3"
                />
              </div>
            ) : (
              filmesSorteados.map((filme, index) => (
                <FilmeSorteado filme={filme} key={index} />
              ))
            )}
          </div>
          <div className="col-xl-6 flex-xl-fill order-xl-1 p-3">
            <input
              type="text"
              name="input_filme"
              id="input_filme"
              className="form-control mb-3"
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              placeholder="Nome do filme"
            />
            <div className="d-grid gap-2">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAdicionarFilme}
                id="botao_adicionar"
              >
                Adicionar filme
              </button>
            </div>

            <ol className="list-group list-group-numbered text-start mb-3 mt-3">
              {listaFilmes &&
                listaFilmes.map((filme, index) => (
                  <ItemFilme filme={filme} key={index} id={filme} />
                ))}
            </ol>
            <div className="text-center text-xl-start mt-3 mb-3">
              <a href="#sortear" onClick={handleSorteio}>
                <img
                  src={import.meta.env.BASE_URL + "/dice-5-fill.svg"}
                  width={64}
                  onMouseOver={handleDadoSortearHover}
                  className="shake rounded-4"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
