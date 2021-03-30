let questions = [];


 function getQuestionsAndAnswersDatas()
{    
  fetch('./quest.json')
  .then((response) =>  response.json())
  .then(datasFromUrl => {                             
                           datasFromUrl.forEach((eachObject) => { questions.push(eachObject)});  
                           startTheQuizAfterFetchingDataInQuestionsArray();                       
                        });                                                                       

}

getQuestionsAndAnswersDatas();              

function startTheQuizAfterFetchingDataInQuestionsArray()
{ 
  let usersAnswers = [];
  let allPoints = 0;
  let allRightAnswers = 0;

  for(let i = 0; i < questions.length; i++)
  {
    allPoints += questions[i].points; 
 
    allRightAnswers += questions[i].right.length;

  }

  function zobrazCelek()
  {
        
    function checkboxesValidation(aktualniPoleOdpovedi, aktualniOtazRight, aktualniOdpoved)
    {
      for(let i = 0; i < aktualniOtazRight.length; i++)
      {                    
        if(aktualniPoleOdpovedi.indexOf(aktualniOdpoved) == aktualniOtazRight[i]-1) 
        {
           return true;
            
        }                       
      }
      return "";
    
    }
        
    function vygenerujOdpovedi(aktualniPoleOdpovedi, aktualniOtaz)
    {
      if(typeof(aktualniPoleOdpovedi) == "object" && aktualniOtaz.right.length == 1)
      {   
         return `${aktualniPoleOdpovedi.map(function(aktualniOdpoved) {
           return ` <p><label><input type="radio" class="${aktualniPoleOdpovedi.indexOf(aktualniOdpoved) == aktualniOtaz.right-1 ? "true":""}" name="${aktualniOtaz.index}">${aktualniOdpoved}</label></p> `                          
         }).join("") }`;
     
      }
     
      else if(typeof(aktualniPoleOdpovedi) == "object" && aktualniOtaz.right.length > 1)
      {   
         return `${aktualniPoleOdpovedi.map(function(aktualniOdpoved) {
           return ` <p><label><input type="checkbox" class="${checkboxesValidation(aktualniPoleOdpovedi, aktualniOtaz.right, aktualniOdpoved)}" name="${aktualniOtaz.index}">${aktualniOdpoved}</label></p> `                          
         }).join("") }`;
     
      }
          
      else if(typeof(aktualniPoleOdpovedi) == "string")
      {                       
         return `<p><textarea id="${aktualniPoleOdpovedi}" name="${aktualniOtaz.index}" placeholder="Zde vepište odpověď..." rows="9" cols="35" style="resize: none;"></textarea></p>`;
                        
      }
   }
  
    function vygenerujOtazkySOdpovedma()
    {  
     let prost = document.getElementById("otazkovyProstor"); 
     prost.innerHTML = `
       ${questions.map(function(aktualniOtazka)  {
          return ` <div>Otázka č.${aktualniOtazka.index+1}: ${aktualniOtazka.question} (${aktualniOtazka.points}b.)</div>
                   <div>
                   ${vygenerujOdpovedi(aktualniOtazka.answers, aktualniOtazka)}
                   </div>
                   <hr /> `
          }).join("") }`  
    
    } 
    vygenerujOtazkySOdpovedma();
    
  }

function casovac()
{
  
  let p = document.getElementById("cas");
  let time = Math.ceil(4.98*60); 
  p.innerHTML = "5:00";
  
  let x = setInterval(function() {
 
    let minutes = Math.floor(time/60);
    let seconds = time%60;
    
    if(minutes < 10)
    {
      minutes = "0" + minutes;
      
    }
    if(seconds < 10)
    {
      seconds = "0" + seconds;

    }
    if(time < 60)
    {
      p.style.color = "red";
      
    }
    time--;

    if(time < 0)
    {
      clearInterval(x);
      check();
    }
    
    p.innerHTML = minutes + ":" + seconds;
    
  }, 1000);
}

  let submitBtn = document.getElementById("submit");
  submitBtn.addEventListener("click", check);

  function check()
  {
    let points = 0;
    let rightAnswers = 0;
    let inps = document.getElementsByTagName("input"); 
    let textfields = document.getElementsByTagName("textarea");
    
    if(textfields.length > 0)
    {
      for(let x = 0; x < textfields.length; x++)
      {        
        if(textfields[x].value != "")
        {
           usersAnswers.push({
                               qID:textfields[x].name, 
                               answer:textfields[x].value
                             }); 
           
           if(textfields[x].value == textfields[x].id) 
           {                                               
               points+=1;
               rightAnswers+=1;
               textfields[x].style.color = "green";
                                                
           } else { 
            
                points-=0.25;
                textfields[x].style.color = "red";                    
           } 
        }         
        textfields[x].disabled = true;
        
      }
    }   
    
    for(let i = 0; i < inps.length; i++) 
    {   
    
        //--- kód pro všechny elementy ---  
        let lab = inps[i].parentElement; 
            
        if(inps[i].classList.contains("true")) 
        {                                                    
           lab.style.color = "green";   
                    
        } else {
             
            lab.style.color = "red"; 
           
        }
        inps[i].style.display = "none";
        //--- konec kódu pro všechny elementy ---  
         
        //--- kód pouze pro zakliknuté elementy --- 
        if(inps[i].checked) 
        {     
          usersAnswers.push({
                              qID:inps[i].name, 
                              answer:inps[i].parentElement.innerText
                           }); 
                              
          for(let j = 0; j < questions.length; j++)
          { 
            if (inps[i].name == questions[j].index)     
            {        
              if(inps[i].classList.contains("true")) 
              {                                               
                 points+= (questions[j].points / questions[j].right.length);
                 rightAnswers+=1;
                                                
              }else {            
               
                points-=0.25;
                                    
              }
            }         
          }
        }
        //--- konec kódu pouze pro zakliknuté elementy ---       
    }
    
    if(points <= 0)
    {
        points = 0;
        
    }
    
    submitBtn.style.display="none";
    let casDiv = document.getElementById("pDiv");
    casDiv.style.display = "none";
    
    let result = document.getElementById("res");
    result.innerHTML = "<br> Počet správných odpovědí: " +  rightAnswers + " z " + allRightAnswers + ".<br>Počet bodů: " + points + " (úspěšnost " + ((points/allPoints)*100).toFixed(2)+ " %)";
    
    usersAnswers.sort(function(a,b) {return a.qID - b.qID});
    console.log(usersAnswers);
    alert("Děkuji za vyplnění dotazníku. Vaše odpovědi byly zaznamenány.");   
  }
  
  zobrazCelek();
  casovac();
  
}