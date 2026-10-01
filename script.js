const questions={
  leve:[
    ['Comer pouca comida boa e passar fome pelo resto do dia','Comer algo ruim que vai acabar com sua fome pelo dia inteiro'],
    ['Nunca mais comer seu prato favorito','Nunca mais beber sua bebida favorita'],
    ['Ficar um mês sem celular','Ficar um mês sem televisão, filmes ou séries'],
    ['Usar sempre a mesma roupa por uma semana','Usar uma roupa diferente a cada dia, mas todas dois números menores'],
    ['Nunca mais ouvir sua música favorita','Nunca mais assistir ao seu filme favorito']
  ],
  pesada:[
    ['Passar um mês sem tomar banho','Passar um mês usando a mesma roupa'],
    ['Beijar alguém completamente desconhecido','Deixar essa pessoa ler todas as suas mensagens privadas'],
    ['Comer uma comida que você considera nojenta','Sentir um cheiro horrível toda vez que alguém falar com você por um dia'],
    ['Perder todas as fotos do seu celular','Perder todas as conversas das suas redes sociais'],
    ['Ficar uma semana sem poder mentir','Ficar uma semana em que todo mundo pode saber quando você está mentindo']
  ],
  extremo:[
    ['Passar uma noite com alguém que você detesta em troca de R$ 100.000','Abrir mão dos R$ 100.000 e nunca mais receber esse dinheiro'],
    ['Descobrir que seu parceiro teve uma relação com seu maior inimigo','Descobrir que seu maior inimigo sabe todos os seus segredos'],
    ['Ter todos os seus pensamentos transmitidos em uma tela por 24 horas','Ter todas as suas pesquisas da internet exibidas para sua família'],
    ['Ficar famoso mundialmente por algo extremamente vergonhoso','Continuar anônimo, mas nunca poder contar a ninguém o que realmente aconteceu'],
    ['Ter seu pior segredo revelado para todos os seus amigos','Ter que revelar voluntariamente um segredo de outra pessoa para salvar o seu']
  ]
};

let level='leve',index=0,answered=false;
const $=id=>document.getElementById(id);
const home=$('home'),game=$('game');
const savedVotes=JSON.parse(localStorage.getItem('horaVerdadeVotes')||'{}');

function totalVotes(){return Object.values(savedVotes).reduce((a,b)=>a+b,0)}
function renderHome(){$('totalVotes').textContent=totalVotes()}
function start(selected){level=selected;index=0;home.classList.remove('active');game.classList.add('active');$('result').classList.add('hidden');renderQuestion()}
function renderQuestion(){
  answered=false;$('result').classList.add('hidden');
  const q=questions[level][index%questions[level].length];
  $('levelLabel').textContent=level==='extremo'?'EXTREMO +18':level.toUpperCase();
  $('questionNumber').textContent=`Pergunta ${index+1}`;
  $('questionText').textContent='';
  $('questionText').textContent=q[0]+' OU '+q[1];
  $('choiceA').textContent=q[0];$('choiceB').textContent=q[1];
  $('progressBar').style.width=((index%questions[level].length+1)/questions[level].length*100)+'%';
  window.scrollTo({top:0,behavior:'smooth'});
}
function vote(choice){
  if(answered)return;answered=true;
  const key=`${level}-${index%questions[level].length}`;
  if(!savedVotes[key])savedVotes[key]=[0,0];
  savedVotes[key][choice]++;localStorage.setItem('horaVerdadeVotes',JSON.stringify(savedVotes));
  const a=savedVotes[key][0],b=savedVotes[key][1],total=a+b,pa=Math.round(a/total*100),pb=100-pa;
  $('percentA').textContent=pa+'%';$('percentB').textContent=pb+'%';$('barA').style.width=pa+'%';$('barB').style.width=pb+'%';
  $('verdict').textContent=pa===pb?'Empate. Essa realmente dividiu a comunidade.':pa>pb?`A Opção A venceu por ${pa}% contra ${pb}%.`:`A Opção B venceu por ${pb}% contra ${pa}%.`;
  $('result').classList.remove('hidden');$('result').scrollIntoView({behavior:'smooth',block:'center'});renderHome();
}

document.querySelectorAll('.level').forEach(b=>b.addEventListener('click',()=>start(b.dataset.level)));
$('choiceA').addEventListener('click',()=>vote(0));$('choiceB').addEventListener('click',()=>vote(1));
$('nextBtn').addEventListener('click',()=>{index++;renderQuestion()});
$('backHome').addEventListener('click',()=>{game.classList.remove('active');home.classList.add('active');renderHome()});
$('shareBtn').addEventListener('click',async()=>{try{await navigator.share({title:'Hora da Verdade',text:'Você prefere? Duas escolhas. Nenhuma saída fácil.',url:location.href})}catch(e){}});
renderHome();
