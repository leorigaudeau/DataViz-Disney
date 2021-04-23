//Initialisation des var env
var myMap;
var canvas;
const key = 'pk.eyJ1IjoianoxMTExIiwiYSI6ImNqc2syOHlhcjExcmk0M256emx3cncydDQifQ.dRFhBWbfIm97qGZNBzCR0A';
const mappa = new Mappa('MapboxGL', key);

//Init des tableaux/Objets utile au dev
var disneysData = [];
var disneySelected = null;
var photoClickable =[];
var imageHovers =[];
var sizeCircle = 8;
let zoom = 5
//Option d'init a la map 
var options = {
    lat: 48.85320481094248, 
    lng: 2.349720192066628,
    zoom: 5,
    style: 'mapbox://styles/mapbox/traffic-night-v2',
}
//different themes possible 
var themes = [
    {"theme" :"Aventure","cod" :"Adventure", "color":"#FFBC00"},
    {"theme" :"Musical","cod" :"Musical", "color":"#FF0086"},
    {"theme" :"Drame","cod" :"Drama", "color":"#00EDFF"},
    {"theme" :"Comédie","cod" :"Comedy", "color":"#00FF73"},
]
  

//Chargement des images et de la BDD 
function preload() {
    disneys = loadStrings('disney_movies.csv');
    enchanted_Land = loadFont('./Enchanted_Land.otf');
    imgPaillettePetit = loadImage("img/PAILLETTES_PETIT.png");
    imgPailletteMoy = loadImage("img/PAILLETTES_MOYEN.png");
    imgPailletteGrand = loadImage("img/PAILLETTES_GRAND.png");
    imgBook = loadImage("img/export_elements_livre/LIVRE.png");
    imgMusical = loadImage("img/export_elements_livre/BOKOFFICE_BOOK_MUSICAL.png");
    imgAdventure = loadImage("img/export_elements_livre/BOXOFFICE_BOOK_AVENTURE.png");
    imgComedy = loadImage("img/export_elements_livre/BOKOFFICE_BOOK_COMEDIE.png");
    imgDrama= loadImage("img/export_elements_livre/BOKOFFICE_BOOK_DRAME.png");
    imgArrow = loadImage("img/export_elements_livre/FLECHE.png");
    imgLogoDisney= loadImage("img/LOGO_DISNEY.png");
    //dessin
   imageHovers.push({"ALLADIN":loadImage("img/Dessins/ALLADIN_DESSIN.png"),"lat":"","lon":""});
   imageHovers.push({"BELLEAUBOISDORMANT":loadImage("img/Dessins/BELLEAUBOISDORMANT_DESSIN.png"),"lat":"","lon":""});
   imageHovers.push({"CARS":loadImage("img/Dessins/CARS_DESSIN.png"),"lat":"","lon":""});
   imageHovers.push({"FROZEN":loadImage("img/Dessins/FROZEN_DESSIN.png"),"lat":"","lon":""});
   imageHovers.push({"KUSCO":loadImage("img/Dessins/KUSCO_DESSIN.png"),"lat":"","lon":""});
   imageHovers.push({"LAHAUT":loadImage("img/Dessins/LAHAUT_DESSIN.png"),"lat":"","lon":""});
   imageHovers.push({"LEBOSSUDENOTREDAME":loadImage("img/Dessins/LEBOSSUDENOTREDAME_DESSIN.png"),"lat":"","lon":""});
   imageHovers.push({"MULAN":loadImage("img/Dessins/MULAN_DESSIN.png"),"lat":"","lon":""});
   imageHovers.push({"NEMO":loadImage("img/Dessins/NEMO_DESSIN.png"),"lat":"","lon":""});
   imageHovers.push({"OLIVIERCOMPAGNIE":loadImage("img/Dessins/OLIVIERCOMPAGNIE_DESSIN.png"),"lat":"","lon":""});
   imageHovers.push({"PETERPAN":loadImage("img/Dessins/PETERPAN_DESSIN.png"),"lat":"","lon":""});
   imageHovers.push({"PETITESIRENE":loadImage("img/Dessins/PETITESIRENE_DESSIN.png"),"lat":"","lon":""});
   imageHovers.push({"RAIPONCE":loadImage("img/Dessins/RAIPONCE_DESSIN.png"),"lat":"","lon":""});
   imageHovers.push({"REBELLE":loadImage("img/Dessins/REBELLE_DESSIN.png"),"lat":"","lon":""});
   imageHovers.push({"VAIANA":loadImage("img/Dessins/VAIANA_DESSIN.png"),"lat":"","lon":""});
   imageHovers.push({"BLANCHENEIGE":loadImage("img/Dessins/BLANCHENEIGE_DESSIN.png"),"lat":"","lon":""});
   imageHovers.push({"HERCULE":loadImage("img/Dessins/HERCULE_DESSIN.png"),"lat":"","lon":""});
    
    //Photos
    photoClickable.push({"ALLADIN":loadImage("img/Photo/ALLADIN.png")});
    photoClickable.push({"BELLEAUBOISDORMANT":loadImage("img/Photo/BELLEAUBOISDORMANT.png")});
    photoClickable.push({"CARS":loadImage("img/Photo/CARS.png")});
    photoClickable.push({"FROZEN":loadImage("img/Photo/FROZEN.png")});
    photoClickable.push({"KUSCO":loadImage("img/Photo/KUSCO.png")});
    photoClickable.push({"LAHAUT":loadImage("img/Photo/LAHAUT.png")});
    photoClickable.push({"LEBOSSUDENOTREDAME":loadImage("img/Photo/LEBOSSUDENOTREDAME.png")});
    photoClickable.push({"MULAN":loadImage("img/Photo/MULAN.png")});
    photoClickable.push({"NEMO":loadImage("img/Photo/NEMO.png")});
    photoClickable.push({"OLIVIERCOMPAGNIE":loadImage("img/Photo/OLIVIERCOMPAGNIE.png")});
    photoClickable.push({"PETERPAN":loadImage("img/Photo/PETERPAN.png")});
    photoClickable.push({"PETITESIRENE":loadImage("img/Photo/PETITESIRENE.png")});
    photoClickable.push({"RAIPONCE":loadImage("img/Photo/RAIPONCE.png")});
    photoClickable.push({"REBELLE":loadImage("img/Photo/REBELLE.png")});
    photoClickable.push({"VAIANA":loadImage("img/Photo/VAIANA.png")});
    photoClickable.push({"BLANCHENEIGE":loadImage("img/Photo/BLANCHENEIGE.png")});
    photoClickable.push({"HERCULE":loadImage("img/Photo/HERCULE.png")});
    
    
}


function setup() {
  // création canva initialisation de la map
    canvas = createCanvas(windowWidth, windowHeight);
    pg = createGraphics(400, 250);
    myMap = mappa.tileMap(options);
    myMap.overlay(canvas)
    

    //pour chacun Disney nous créons un objet que nous ajoutons au tableau disneysData
    for (var i = 1; i < disneys.length; i++) {
        var data = disneys[i].split(/,/);
        if (data.length > 1) {
            disneysData.push({ 
              "titre": data[0], 
              "place": data[1],
              "lat": parseFloat(data[2]), 
              "lon": parseFloat(data[3]), 
              "clicakble": parseInt(data[4]),
              "annee":data[5],
              "genre":data[6],
              "boxoffice":parseInt(data[7]),
              "titreCod":data[8]
            })
        }
    }
    // init de la font
    textFont(enchanted_Land);
}

function draw() {
  clear();

  drawPoint();
  
  image(imgLogoDisney, windowWidth-110,0, 100,100);
  stroke(0, 0, 0,0);
  
  // si nous avons cliqué sur un disney nous passons dans ce IF
  if(disneySelected){
    //theme avec celui selectionner en moin transparent 
      themes.forEach((t,index)=>{
          textSize(32);
          let c = color(t.color);
          if(disneySelected.genre == t.cod){
            c.setAlpha(255)
          }else{
            c.setAlpha(50)
          }
          fill(c);
          text(t.theme, windowWidth-100, 35*(index+3));
      });
      
      
    // partie d'Erell ajout du livre et compositon de celui-ci en fonction du Disney sélectionné
    image(imgBook, -400, 100);
    if(disneySelected.clicakble){
     //on affiche l'image du disney correspondant
     image(photoClickable[photoClickable.findIndex(d=> Object.keys(d).includes(disneySelected.titreCod))][disneySelected.titreCod],120, 280,300,400)
     image(imgArrow, 400, 470,15,30);
    }
      //on va chercher le thème du Disney choisie (ellipses de couleur avec paillettes)
     if(disneySelected.genre=="Adventure"){
        image(imgAdventure, 350, 200,100,100);
      }
      else if(disneySelected.genre=="Musical"){
        image(imgMusical, 350, 200,100,100);
      }
      else if(disneySelected.genre=="Drama"){
        image(imgDrama, 350, 200,100,100);
      }
       else if(disneySelected.genre=="Comedy"){
        image(imgComedy, 350, 200,100,100);
      }
   
   
   // affichage du texte dans le livre (lieu box-office et titre) 
    fill(0);
    textSize(20);
    text(disneySelected.place, 155, 680);
    
    textSize(36);
    text(disneySelected.titre, 155, 250);
    textSize(26);
    fill(255);
    text(disneySelected.boxoffice+"$", 360, 200);
    
  }else{
    
    //param de base on affiche les thèmes et l'image du livre fermé
     themes.forEach((t,index)=>{
        textSize(32);
        let c = color(t.color);
        fill(c);
        text(t.theme, windowWidth-100, 35*(index+3));
    });
    image(imgBook, -750, 100);
  }
}
function mouseClicked() {
    //fonction quand on click avec l'image 
    let selectedItems = []
    for (var i = 0; i < disneysData.length; i++) {
        let corrX = disneysData[i].corr.x
        let corrY = disneysData[i].corr.y
        let sizeZone = (sizeCircle * zoom) / 2
        if (mouseX > corrX - sizeZone && mouseX < corrX + sizeZone && mouseY < corrY + sizeZone && mouseY > corrY - sizeZone) {
          //ajout de tout les films ou l'user a cliquer on filtre apres 
            selectedItems.push(disneysData[i])
        }
    }
    
     // moment de sélection du disney
    if(selectedItems.length >0){
      index =selectedItems.findIndex((d) => d.clicakble == true) !=-1 ? selectedItems.findIndex((d) => d.clicakble == true) : 0
      disneySelected = selectedItems[index]
    }else{
      disneySelected = null
    }
   
}

function mouseWheel(event) {
   // gestion du zoom 
  zoom += event.delta >0 ? -0.1 : +0.1;
  if(zoom <= 1){
    zoom = 1
  }
}

function drawPoint() {
    for (var i = 0; i < disneysData.length; i++) {
      
      // on passe dans une boucle a chaque disney
        disneysData[i].corr = myMap.latLngToPixel(disneysData[i].lat, disneysData[i].lon);
        let corrX = disneysData[i].corr.x
        let corrY = disneysData[i].corr.y
        let sizeZone = (sizeCircle *zoom) / 2
        if (mouseX > corrX - sizeZone && mouseX < corrX + sizeZone && mouseY < corrY + sizeZone && mouseY > corrY - sizeZone) {
          // agrandissement du cercle pour effet hover 
            sizeCircle  = sizeCircle+2
        }
        
      
          
          // en fonction du box-office on change la taille du cercle et le nombre de paillettes au-dessus
          if(disneysData[i].boxoffice<100000000 ){
            sizeCircle = 6;
            sizeZone = (sizeCircle *zoom) / 2
            image(imgPaillettePetit, disneysData[i].corr.x-sizeZone, disneysData[i].corr.y-sizeZone-10, sizeCircle *zoom+1, sizeCircle *zoom+20);
          }
          else if(disneysData[i].boxoffice>100000000 && disneysData[i].boxoffice<300000000){
            sizeCircle = 8;
            sizeZone = (sizeCircle *zoom) / 2
            image(imgPailletteMoy, disneysData[i].corr.x-sizeZone, disneysData[i].corr.y-sizeZone-10, sizeCircle *zoom+1, sizeCircle *zoom+20);
          }
          else if(disneysData[i].boxoffice>300000000){
            sizeCircle = 10;
            sizeZone = (sizeCircle *zoom) / 2
            image(imgPailletteGrand, disneysData[i].corr.x-sizeZone, disneysData[i].corr.y-sizeZone-10, sizeCircle *zoom+1, sizeCircle *zoom+20);
          }
          
        
        
        let tmpThemes= themes.find(element => element.cod==disneysData[i].genre);
        let c = color(tmpThemes.color);
        // ellipse pleine si zoom>8
        if( zoom<8){
          fill(0, 0, 0,0);
        }else{
          c.setAlpha(50)
          fill(c);
        }
        
        // affichage des points sur la map
        c.setAlpha(100)
        stroke(c);
        ellipse(disneysData[i].corr.x, disneysData[i].corr.y, (sizeCircle-3) *zoom+1, (sizeCircle-4) *zoom+1);
        c.setAlpha(50)
        stroke(c);
        ellipse(disneysData[i].corr.x, disneysData[i].corr.y, (sizeCircle-1) *zoom+1, (sizeCircle-2) *zoom+1);
        
        strokeWeight(3);
        
        //on affiche les halos d'images sur le hover de chacune d'elles
        if (mouseX > corrX - sizeZone && mouseX < corrX + sizeZone && mouseY < corrY + sizeZone && mouseY > corrY - sizeZone) {
            if(disneysData[i].clicakble){
              image(imageHovers[imageHovers.findIndex(d=> Object.keys(d).includes(disneysData[i].titreCod))][disneysData[i].titreCod], disneysData[i].corr.x-(30*zoom)/2,disneysData[i].corr.y-(30*zoom)/2, 30*zoom,30*zoom);
            }else{
              textSize(36);
              c.setAlpha(255)
              fill(c);
              text(disneysData[i].titre, disneysData[i].corr.x+10,disneysData[i].corr.y,);
            
            }
            //reducition du cercle pour les autres points (sans hover) 
            sizeCircle  = sizeCircle-2
        }
        


    }
}
