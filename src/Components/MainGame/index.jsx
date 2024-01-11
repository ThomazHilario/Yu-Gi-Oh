import './maingame.css'
import Ost from '../../assets/songs/hunter.mp3'
import cardBack from '../../assets/images/card-back.png'
import eye from '../../assets/images/millenium2.png'
import {useContext, useState, useEffect, useMemo} from 'react'
import { Context } from '../../Context'

export const MainGame = () => {
    return(
        <main id="MainGame">

            {/* Componente ContainerLeft */}
            <ContainerLeft/>

            {/* Componente ContainerRight */}
            <ContainerRight/>
        </main>
    )
}

// Componente ContainerLeft 
const ContainerLeft = () => {
    // States globais - win e lose
    const {contWin, contLoser} = useContext(Context)

    // state - visualization
    const {visualization} = useContext(Context)

    return(
        <div id="ContainerLeft">

            {/* Painel Profile */}
            <div id='painelProfile'>
                <h1>Win: <span>{contWin}</span></h1>
                <h1>Loser: <span>{contLoser}</span></h1>
            </div>

            {/* Card */}
            <div id='cardVisualization'>
                <img src={visualization ? visualization.card_images[0].image_url : cardBack}/>
            </div>

            {/* Attributes card */}
            <div id='attributesCard'>
                <h1>{visualization && visualization.name}</h1>
                <h1>{visualization && 'Ataque: ' +visualization.atk}</h1>
            </div>
        </div>
    )
}

// array Verification
const verification = []

// Componente ContainerRight 
const ContainerRight = () => {

    // Fazendo requisicao antes do componente ser renderizado
    useEffect(() => {
        // loadCards
        async function loadCards(){
            // Fazendo a requisicao
            const response = await fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php')

            // Transformando o valor da requisicao para ser manipulavel
            const data = await response.json()

            // Filtrando o resultado para vim somente monstros
            const cardsMonster = data.data.filter(element => element.type !== 'Spell Card' && element.type !== 'Trap Card')

            // setando na state cards
            setCards([...cardsMonster])

        }

        // Executando loadCards
        loadCards()

    },[])

    // Cartas do jogo
    const [cards, setCards] = useState([])

    //cartas cache
    const cardsCache = useMemo(() => cards,[cards])

    // state - myCards
    const [myCards, setMyCards] = useState([])

    // state - botCards
    const [botCards, setBotCards] = useState([])

    // state - visualization
    const {setVisualization, contWin, setContWin, contLoser, setContLoser} = useContext(Context)

    // Escolehndo cinco cartas random para o bot e para o player
    function randomCards(array){

        // Esvaziando array
        if(array.length === 5){
            for(let i = 0; i < 5; i++){
                array.splice(i)
            }
        }

        for(let i = 0; i < 5; i++){
            array.push(cardsCache[Math.floor(Math.random() * cards.length)])
        }

        
    }

    // getCards - Pegando as cartas aleatorias para o player e para o bot
    function getCards(){

        // Chamando o randomCards para escolher as cartas do bot e setando na state
        randomCards(botCards)
        setBotCards([...botCards])

        // Chamando o randomCards para escolher as cartas do player e setando na state
        randomCards(myCards)
        setMyCards([...myCards])

    }

    // SongBattle
    function audioPlay(url){
        // Instanciando o audio
        const audio = new Audio(url)

        // volume do audio
        audio.volume = 0.06
    
        // Executando audio
        audio.play()

        // Deixando o audio em loop
        audio.loop = true
    }

    // startGame - Comecando o jogo
    function startGame(){
    
        audioPlay(Ost)

        // Chamando o getCards
        getCards()

        // Alterando o display do button para none
        document.getElementById('btn-Start-Game').style.display = 'none'

        // Alterando o display do ContainerLeft
        document.getElementById('ContainerLeft').style.display = 'flex'

        // Alterando a width do ContainerRight
        document.getElementById('ContainerRight').style.width = `calc(100% - 500px})`

        // Alterando o sentido do flex-direction
        document.getElementById('ContainerRight').style.flexDirection = 'column'

        // Alterando o alinhamento na vertical
        document.getElementById('ContainerRight').style.justifyContent = 'space-evenly'

        // Alterando o display do combateTemplate para flex
        document.getElementById('templateCombate').style.display = 'flex'
    }

    // verifyConditionWin - verificando condicao de vitoria
    function verifyConditionWin(element){

        // Ocultando containerCardsBot
        document.getElementById('containerCardsBot').style.display ='none'

        // Ocultando containerCardsPLayer
        document.getElementById('containerCardsPlayer').style.display ='none'

        

        // Jogando a carta de minha escolha para o array de verificacao
        verification.push(element)

        // Jogando a carta aleatoria do bot ao array de verificacao    
        verification.push(botCards.sort((a,b) => b.atk - a.atk)[0])

        
        // Mostrando a minha carta no template
        document.getElementById('myCard').innerHTML = `<img src="${verification[0].card_images[0].image_url}" />`

        // Mostrando a carta do bot no template
        document.getElementById('botCard').innerHTML = `<img src="${verification[1].card_images[0].image_url}" />`



        // Condicao de vitoria
        if(verification[0].atk > verification[1].atk){

            // button dizendo que ganhei
            document.getElementById('resetGame').style.display = 'block'

            // Mensagem de vitoria
            document.getElementById('resetGame').textContent = 'GANHOU'

            // Incrementando ponto de vitoria
            setContWin(contWin + 1)

        } else if(verification[0].atk === verification[1].atk){

            // button dizendo que ganhei
            document.getElementById('resetGame').style.display = 'block'

            // Mensagem de derrota
            document.getElementById('resetGame').textContent = 'Empate'

        }else{
            // button dizendo que ganhei
            document.getElementById('resetGame').style.display = 'block'

            // Mensagem de derrota
            document.getElementById('resetGame').textContent = 'PERDEU'

            // Incrementando ponto de derrota
            setContLoser(contLoser + 1)
        }

    }

    // resetGameCard - Recomecando o jogo
    function resetGameCard(){

        // Chamando getCards
        getCards()



        // Resetando o valor interno
        document.getElementById('myCard').innerHTML = ``

        // Resetando o valor interno
        document.getElementById('botCard').innerHTML = ``



        // Alterando o display do button para none
        document.getElementById('resetGame').style.display = 'none'



        // Removendo as cartas do array de verificacao
        verification.pop()
        verification.pop()



        // Ocultando containerCardsBot
        document.getElementById('containerCardsBot').style.display = 'flex'

        // Ocultando containerCardsPlayer
        document.getElementById('containerCardsPlayer').style.display = 'flex'


    }


    return(         
        <div id="ContainerRight">

            {/* button start Game */}
            <button id='btn-Start-Game' onClick={startGame}>Start Game</button>

            {/* Container cards do bot */}
            <div id='containerCardsBot' className='containerCardsGame'>

                {/* Percorrendo as cartas do bot */}
                {botCards.length > 0 && botCards.map((element) => {
                    return(
                        <img key={element.id} src={cardBack}/>
                    )
                })}

            </div>


            {/* template de combate */}
            <div id='templateCombate'>

            {/* Visualizando minha carta ao escolher */}
            <div id='myCard' className='templateCardGame'></div>

                {/* Detalhe */}
                <img src={eye}/>

                {/* Visualizando a carta do bot ao escolher */}
                <div id='botCard' className='templateCardGame'></div>

            </div>
            
            {/* Button resetGame */}
            <button id='resetGame' onClick={resetGameCard}></button>

            {/* Container card do player */}
            <div id='containerCardsPlayer' className='containerCardsGame'>

            {/* Percorrendo minhas cartas */}
            {myCards.length > 0 && myCards.map((element) => {
                return(
                    <img key={element.id} src={cardBack} onClick={() => verifyConditionWin(element)} onMouseOver={() => setVisualization(element)}/>
                    )
                })}

            </div>
        </div> 
    )
}